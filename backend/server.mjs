import { createServer } from "node:http";
import {
  applyHeaders,
  getClientKey,
  readJsonBody,
  sendEmpty,
  sendJson,
  setCorsHeaders,
} from "./http-transport.mjs";
import { createTranslateRequestModule } from "./translate-request-module.mjs";

export function createTranslationBackendServer({
  service,
  rateLimit = {},
  backpressure = {},
  logger = console,
  diagnostics = {},
}) {
  const translateRequests = createTranslateRequestModule({
    service,
    rateLimit,
    backpressure,
    logger,
    diagnostics,
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
        runtime: translateRequests.runtimeSummary.snapshot(),
      });
      return;
    }

    if (request.method !== "POST" || request.url !== "/translate") {
      sendJson(response, 404, {
        error: "Use POST /translate",
      });
      return;
    }

    const admission = translateRequests.admit({
      clientKey: getClientKey(request),
    });
    if (!admission.ok) {
      applyHeaders(response, admission.response.headers);
      sendJson(response, admission.response.statusCode, admission.response.payload);
      return;
    }

    let result;
    try {
      const body = await readJsonBody(request);
      result = await translateRequests.handleAdmitted({
        body,
        requestContext: admission.requestContext,
      });
    } catch (error) {
      result = translateRequests.handleBadRequest({
        requestContext: admission.requestContext,
        error,
      });
    }

    applyHeaders(response, result.headers);
    sendJson(response, result.statusCode, result.payload);
  });
}
