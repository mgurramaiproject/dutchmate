import {
  normalizeTranslationRequest,
  validateTranslationRequest,
} from "./translation-request.mjs";
import {
  getProviderErrorMetadata,
  getProviderErrorStatus,
  getProviderRetryAfterSeconds,
} from "./provider-error.mjs";

const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS = 4;
const DEFAULT_BACKPRESSURE_RETRY_AFTER_SECONDS = 15;
const BACKEND_BUSY_MESSAGE = "Translation backend is busy. Try again soon.";

export function createTranslateRequestModule({
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

  return {
    runtimeSummary,

    async handle({ body, clientKey }) {
      const startedAt = Date.now();
      const backendPressureResult = backendPressure.tryEnter();
      if (!backendPressureResult.allowed) {
        runtimeSummary.recordBackendBusy();
        const response = {
          statusCode: 503,
          headers: {
            "Retry-After": backendPressureResult.retryAfterSeconds.toString(),
          },
          payload: {
            error: BACKEND_BUSY_MESSAGE,
          },
        };
        logTranslateRequest(logger, startedAt, {
          statusCode: response.statusCode,
          backendBusy: true,
          retryAfterSeconds: backendPressureResult.retryAfterSeconds,
          ...safeDiagnostics,
        });
        return response;
      }

      let shouldLeavePressure = true;

      try {
        const rateLimitResult = rateLimiter.check(clientKey);
        if (!rateLimitResult.allowed) {
          runtimeSummary.recordClientRateLimit();
          return buildAndLogResult({
            logger,
            startedAt,
            safeDiagnostics,
            response: {
              statusCode: 429,
              headers: {
                "Retry-After": rateLimitResult.retryAfterSeconds.toString(),
              },
              payload: {
                error: "Too many translation requests. Try again soon.",
              },
            },
            logMetadata: {
              statusCode: 429,
              rateLimited: true,
            },
          });
        }

        const validationError = validateTranslationRequest(body);
        if (validationError) {
          runtimeSummary.recordBadRequest();
          return buildAndLogResult({
            logger,
            startedAt,
            safeDiagnostics,
            response: {
              statusCode: 400,
              payload: {
                error: validationError,
              },
            },
            logMetadata: {
              statusCode: 400,
              error: validationError,
              ...getSafeRequestMetadata(body),
            },
          });
        }

        const normalizedRequest = normalizeTranslationRequest(body);
        runtimeSummary.recordAcceptedRequest(normalizedRequest);
        const translation = await service.translate(normalizedRequest);
        runtimeSummary.recordSuccess();

        return buildAndLogResult({
          logger,
          startedAt,
          safeDiagnostics,
          response: {
            statusCode: 200,
            payload: {
              translatedText: translation.translatedText,
            },
          },
          logMetadata: {
            statusCode: 200,
            ...getSafeRequestMetadata(normalizedRequest),
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Invalid request";
        const statusCode = getProviderErrorStatus(error);
        const retryAfterSeconds = getProviderRetryAfterSeconds(error);
        runtimeSummary.recordFailure({
          statusCode,
          providerRateLimited: getProviderErrorMetadata(error).providerRateLimited === true,
        });

        return buildAndLogResult({
          logger,
          startedAt,
          safeDiagnostics,
          response: {
            statusCode,
            headers: retryAfterSeconds
              ? {
                  "Retry-After": retryAfterSeconds.toString(),
                }
              : undefined,
            payload: {
              error: errorMessage,
            },
          },
          logMetadata: {
            statusCode,
            error: errorMessage,
            ...getProviderErrorMetadata(error),
          },
        });
      } finally {
        if (shouldLeavePressure) {
          backendPressure.leave();
        }
      }
    },
  };
}

function buildAndLogResult({
  logger,
  startedAt,
  safeDiagnostics,
  response,
  logMetadata,
}) {
  logTranslateRequest(logger, startedAt, {
    ...logMetadata,
    ...safeDiagnostics,
  });
  return response;
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
