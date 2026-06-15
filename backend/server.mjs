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

export function createTranslationBackendServer({
  service,
  rateLimit = {},
  logger = console,
  diagnostics = {},
}) {
  const rateLimiter = createRateLimiter(rateLimit);
  const safeDiagnostics = getSafeDiagnostics(diagnostics);

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
    const rateLimitResult = rateLimiter.check(getClientKey(request));
    if (!rateLimitResult.allowed) {
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
      const translation = await service.translate(normalizedRequest);
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
