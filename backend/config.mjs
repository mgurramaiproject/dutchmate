import { DEFAULT_TRANSLATION_PROVIDER } from "./providers/provider-factory.mjs";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const DEFAULT_DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const SUPPORTED_PROVIDERS = new Set([DEFAULT_TRANSLATION_PROVIDER, "deepl"]);

export function readBackendConfig(environment = process.env) {
  const provider = normalizeProvider(environment.TRANSLATION_PROVIDER);
  const host = normalizeHost(environment.HOST);
  const port = normalizePort(environment.PORT);
  const deepl = normalizeDeepLConfig(provider, environment);

  return {
    provider,
    host,
    port,
    deepl,
  };
}

function normalizeProvider(value) {
  const provider = (value ?? DEFAULT_TRANSLATION_PROVIDER).trim().toLowerCase();

  if (!provider) {
    throw new Error("TRANSLATION_PROVIDER must not be empty");
  }

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw new Error(`Unsupported TRANSLATION_PROVIDER "${value}". Supported providers: local-dev, deepl`);
  }

  return provider;
}

function normalizeHost(value) {
  const host = (value ?? DEFAULT_HOST).trim();

  if (!host) {
    throw new Error("HOST must not be empty");
  }

  return host;
}

function normalizePort(value) {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65535 || String(port) !== value.trim()) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

function normalizeDeepLConfig(provider, environment) {
  const apiKey = environment.DEEPL_API_KEY?.trim() ?? "";
  const apiUrl = environment.DEEPL_API_URL?.trim() ?? DEFAULT_DEEPL_API_URL;

  if (provider !== "deepl") {
    return {
      apiUrl,
    };
  }

  if (!apiKey) {
    throw new Error("DEEPL_API_KEY is required when TRANSLATION_PROVIDER=deepl");
  }

  validateHttpUrl("DEEPL_API_URL", apiUrl);

  return {
    apiKey,
    apiUrl,
  };
}

function validateHttpUrl(name, value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }
  } catch {
    throw new Error(`${name} must be a valid http or https URL`);
  }
}
