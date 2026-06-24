import { createServer } from "node:http";
import {
  normalizeTranslationRequest,
  validateTranslationRequest,
} from "./translation-request.mjs";
import {
  getProviderErrorMetadata,
  getProviderErrorStatus,
  getProviderRetryAfterSeconds,
} from "./provider-error.mjs";

const MAX_TRANSLATE_REQUEST_BYTES = 10 * 1024;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS = 4;
const DEFAULT_BACKPRESSURE_RETRY_AFTER_SECONDS = 15;
const BACKEND_BUSY_MESSAGE = "Translation backend is busy. Try again soon.";

export function createTranslationBackendServer({
  service,
  rateLimit = {},
  backpressure = {},
  logger = console,
  diagnostics = {},
}) {
  const rateLimiter = createRateLimiter(rateLimit);
  const backendPressure = createBackendPressureGuard(backpressure);
  const safeDiagnostics = getSafeDiagnostics(diagnostics);
  const runtimeSummary = createRuntimeSummary({
    maxInFlightRequests: backendPressure.maxInFlightRequests,
  });

  return createServer(async (request, response) => {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      sendEmpty(response, 204);
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, {
        ok: true,
        service: "dutchmate-backend",
        runtime: runtimeSummary.snapshot(),
      });
      return;
    }

    if (request.method !== "POST" || request.url !== "/translate") {
      sendJson(response, 404, {
        error: "Use POST /translate",
      });
      return;
    }

    const startedAt = Date.now();
    const backendPressureResult = backendPressure.tryEnter();
    if (!backendPressureResult.allowed) {
      runtimeSummary.recordBackendBusy();
      response.setHeader("Retry-After", backendPressureResult.retryAfterSeconds.toString());
      sendJson(response, 503, {
        error: BACKEND_BUSY_MESSAGE,
      });
      logTranslateRequest(logger, startedAt, {
        statusCode: 503,
        backendBusy: true,
        retryAfterSeconds: backendPressureResult.retryAfterSeconds,
        ...safeDiagnostics,
      });
      return;
    }

    const rateLimitResult = rateLimiter.check(getClientKey(request));
    if (!rateLimitResult.allowed) {
      backendPressure.leave();
      runtimeSummary.recordClientRateLimit();
      response.setHeader("Retry-After", rateLimitResult.retryAfterSeconds.toString());
      sendJson(response, 429, {
        error: "Too many translation requests. Try again soon.",
      });
      logTranslateRequest(logger, startedAt, {
        statusCode: 429,
        rateLimited: true,
        ...safeDiagnostics,
      });
      return;
    }

    try {
      const body = await readJsonBody(request);
      const validationError = validateTranslationRequest(body);

      if (validationError) {
        runtimeSummary.recordBadRequest();
        sendJson(response, 400, {
          error: validationError,
        });
        logTranslateRequest(logger, startedAt, {
          statusCode: 400,
          error: validationError,
          ...getSafeRequestMetadata(body),
          ...safeDiagnostics,
        });
        return;
      }

      const normalizedRequest = normalizeTranslationRequest(body);
      runtimeSummary.recordAcceptedRequest(normalizedRequest);
      const translation = await service.translate(normalizedRequest);
      runtimeSummary.recordSuccess();
      sendJson(response, 200, {
        translatedText: translation.translatedText,
      });
      logTranslateRequest(logger, startedAt, {
        statusCode: 200,
        ...getSafeRequestMetadata(normalizedRequest),
        ...safeDiagnostics,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid request";
      const statusCode = getProviderErrorStatus(error);
      const retryAfterSeconds = getProviderRetryAfterSeconds(error);
      runtimeSummary.recordFailure({
        statusCode,
        providerRateLimited: getProviderErrorMetadata(error).providerRateLimited === true,
      });

      if (retryAfterSeconds) {
        response.setHeader("Retry-After", retryAfterSeconds.toString());
      }

      sendJson(response, statusCode, {
        error: errorMessage,
      });
      logTranslateRequest(logger, startedAt, {
        statusCode,
        error: errorMessage,
        ...getProviderErrorMetadata(error),
        ...safeDiagnostics,
      });
    } finally {
      backendPressure.leave();
    }
  });
}

function logTranslateRequest(logger, startedAt, metadata) {
  logger.info?.(
    JSON.stringify({
      event: "translate_request",
      durationMs: Math.max(0, Date.now() - startedAt),
      ...metadata,
    }),
  );
}

function getSafeRequestMetadata(body) {
  return {
    context: typeof body.context === "string" ? body.context : undefined,
    sourceLanguage: typeof body.sourceLanguage === "string" ? body.sourceLanguage : undefined,
    targetLanguage: typeof body.targetLanguage === "string" ? body.targetLanguage : undefined,
    textLength: typeof body.text === "string" ? body.text.trim().length : undefined,
  };
}

function getSafeDiagnostics(diagnostics) {
  return {
    configuredProvider: getOptionalString(diagnostics.configuredProvider),
    myMemoryEmailConfigured:
      typeof diagnostics.myMemoryEmailConfigured === "boolean"
        ? diagnostics.myMemoryEmailConfigured
        : undefined,
  };
}

function createRuntimeSummary(
  { maxInFlightRequests = DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS } = {},
  now = () => new Date(),
) {
  const summary = {
    startedAt: now().toISOString(),
    lastTranslateAt: null,
    translateRequestsAcceptedTotal: 0,
    requestedTextCharactersTotal: 0,
    translateSuccessTotal: 0,
    translateFailureTotal: 0,
    badRequestTotal: 0,
    clientRateLimitedTotal: 0,
    backendBusyTotal: 0,
    providerErrorTotal: 0,
    providerRateLimitedTotal: 0,
    inFlightRequests: 0,
    maxInFlightRequests,
    byContext: {
      hover: 0,
      selection: 0,
    },
  };

  return {
    recordAcceptedRequest(request) {
      summary.lastTranslateAt = now().toISOString();
      summary.translateRequestsAcceptedTotal += 1;
      summary.requestedTextCharactersTotal += request.text.length;
      summary.inFlightRequests += 1;

      if (request.context === "hover" || request.context === "selection") {
        summary.byContext[request.context] += 1;
      }
    },
    recordSuccess() {
      summary.translateSuccessTotal += 1;
      summary.inFlightRequests = Math.max(0, summary.inFlightRequests - 1);
    },
    recordBadRequest() {
      summary.badRequestTotal += 1;
      summary.translateFailureTotal += 1;
    },
    recordClientRateLimit() {
      summary.clientRateLimitedTotal += 1;
      summary.translateFailureTotal += 1;
    },
    recordBackendBusy() {
      summary.backendBusyTotal += 1;
      summary.translateFailureTotal += 1;
    },
    recordFailure({ statusCode, providerRateLimited }) {
      summary.translateFailureTotal += 1;
      summary.inFlightRequests = Math.max(0, summary.inFlightRequests - 1);

      if (statusCode >= 500 || statusCode === 429) {
        summary.providerErrorTotal += 1;
      }

      if (providerRateLimited) {
        summary.providerRateLimitedTotal += 1;
      }
    },
    snapshot() {
      return structuredClone(summary);
    },
  };
}

function createBackendPressureGuard({
  maxInFlightRequests = DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS,
  retryAfterSeconds = DEFAULT_BACKPRESSURE_RETRY_AFTER_SECONDS,
} = {}) {
  let inFlightRequests = 0;

  return {
    maxInFlightRequests,
    tryEnter() {
      if (inFlightRequests >= maxInFlightRequests) {
        return {
          allowed: false,
          retryAfterSeconds,
        };
      }

      inFlightRequests += 1;
      return {
        allowed: true,
        retryAfterSeconds: 0,
      };
    },
    leave() {
      inFlightRequests = Math.max(0, inFlightRequests - 1);
    },
  };
}

function getOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function createRateLimiter({
  maxRequests = DEFAULT_RATE_LIMIT_MAX_REQUESTS,
  windowMs = DEFAULT_RATE_LIMIT_WINDOW_MS,
  now = () => Date.now(),
} = {}) {
  const clients = new Map();

  return {
    check(clientKey) {
      const currentTime = now();
      const existing = clients.get(clientKey);

      if (!existing || currentTime >= existing.resetAt) {
        clients.set(clientKey, {
          count: 1,
          resetAt: currentTime + windowMs,
        });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (existing.count >= maxRequests) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - currentTime) / 1000)),
        };
      }

      existing.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

function getClientKey(request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.socket.remoteAddress ?? "unknown";
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode);
  response.end();
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

async function readJsonBody(request) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    totalBytes += chunk.length;

    if (totalBytes > MAX_TRANSLATE_REQUEST_BYTES) {
      throw new Error("Request body is too large");
    }

    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) {
    throw new Error("Request body is required");
  }

  return JSON.parse(rawBody);
}
