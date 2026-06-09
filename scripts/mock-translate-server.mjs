import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT ?? "8787", 10);

const server = createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
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

    sendJson(response, 200, {
      translatedText: mockTranslate(body.text, body.targetLanguage),
    });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Mock translation endpoint listening at http://localhost:${port}/translate`);
});

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
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

function validateTranslationRequest(body) {
  if (!isObject(body)) {
    return "Request body must be a JSON object";
  }

  if (typeof body.text !== "string" || !body.text.trim()) {
    return "text is required";
  }

  if (body.sourceLanguage !== "auto") {
    return "sourceLanguage must be auto";
  }

  if (typeof body.targetLanguage !== "string" || !body.targetLanguage.trim()) {
    return "targetLanguage is required";
  }

  if (body.context !== "hover" && body.context !== "selection") {
    return "context must be hover or selection";
  }

  return null;
}

function mockTranslate(text, targetLanguage) {
  return `[mock ${targetLanguage}] ${text}`;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
