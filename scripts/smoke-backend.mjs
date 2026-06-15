import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "http://localhost:8787";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await runSmokeBackend({
    baseUrl: process.argv[2] ?? process.env.BACKEND_BASE_URL ?? DEFAULT_BASE_URL,
  });

  process.exitCode = result.ok ? 0 : 1;
}

export async function runSmokeBackend({
  baseUrl,
  fetchFn = fetch,
  stdout = console.log,
  stderr = console.error,
}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  try {
    await smokeHealth(normalizedBaseUrl, fetchFn);
    stdout(`Backend health check passed: ${normalizedBaseUrl}`);
  } catch (error) {
    stderr(`Backend health check failed: ${getErrorMessage(error)}`);
    return { ok: false };
  }

  try {
    await smokeTranslate(normalizedBaseUrl, fetchFn);
    stdout(`Backend translation smoke test passed: ${normalizedBaseUrl}`);
    return { ok: true };
  } catch (error) {
    stderr(`Backend translation smoke test failed: ${getErrorMessage(error)}`);
    return { ok: false };
  }
}

export function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

async function smokeHealth(baseUrl, fetchFn) {
  const response = await fetchFn(`${baseUrl}/health`);
  const body = await readJsonResponse(response, "GET /health");

  if (!response.ok || body?.ok !== true) {
    throw new Error(`GET /health returned ${response.status}`);
  }
}

async function smokeTranslate(baseUrl, fetchFn) {
  const response = await fetchFn(`${baseUrl}/translate`, {
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
    const providerError = typeof body?.error === "string" ? `: ${body.error}` : "";
    throw new Error(`POST /translate returned ${response.status}${providerError}`);
  }
}

async function readJsonResponse(response, label) {
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} did not return JSON`);
  }
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error";
}
