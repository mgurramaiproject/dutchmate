import { createServer } from "node:http";
import {
  normalizeTranslationRequest,
  validateTranslationRequest,
} from "./translation-request.mjs";

export function createTranslationBackendServer({ service }) {
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

    try {
      const body = await readJsonBody(request);
      const validationError = validateTranslationRequest(body);

      if (validationError) {
        sendJson(response, 400, {
          error: validationError,
        });
        return;
      }

      const translation = await service.translate(normalizeTranslationRequest(body));
      sendJson(response, 200, {
        translatedText: translation.translatedText,
      });
    } catch (error) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });
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

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) {
    throw new Error("Request body is required");
  }

  return JSON.parse(rawBody);
}
