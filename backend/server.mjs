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

    try {
      const body = await readJsonBody(request);
      const result = await translateRequests.handle({
        body,
        clientKey: getClientKey(request),
      });

      applyHeaders(response, result.headers);
      sendJson(response, result.statusCode, result.payload);
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });
}
