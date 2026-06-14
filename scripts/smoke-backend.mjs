const DEFAULT_BASE_URL = "http://localhost:8787";

const baseUrl = normalizeBaseUrl(process.argv[2] ?? process.env.BACKEND_BASE_URL ?? DEFAULT_BASE_URL);

try {
  await smokeHealth(baseUrl);
  await smokeTranslate(baseUrl);
  console.log(`Backend smoke test passed: ${baseUrl}`);
} catch (error) {
  console.error(
    `Backend smoke test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
  );
  process.exitCode = 1;
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

async function smokeHealth(baseUrl) {
  const response = await fetch(`${baseUrl}/health`);
  const body = await readJsonResponse(response, "GET /health");

  if (!response.ok || body?.ok !== true) {
    throw new Error(`GET /health returned ${response.status}`);
  }
}

async function smokeTranslate(baseUrl) {
  const response = await fetch(`${baseUrl}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    }),
  });
  const body = await readJsonResponse(response, "POST /translate");

  if (!response.ok || typeof body?.translatedText !== "string" || !body.translatedText.trim()) {
    throw new Error(`POST /translate returned ${response.status}`);
  }
}

async function readJsonResponse(response, label) {
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} did not return JSON`);
  }
}
