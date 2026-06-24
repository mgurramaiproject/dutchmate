import { createServer } from "node:http";
import { createTranslateRequestModule } from "./translate-request-module.mjs";

const MAX_TRANSLATE_REQUEST_BYTES = 10 * 1024;

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

      if (result.headers) {
        for (const [name, value] of Object.entries(result.headers)) {
          response.setHeader(name, value);
        }
      }
      sendJson(response, result.statusCode, result.payload);
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });
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
