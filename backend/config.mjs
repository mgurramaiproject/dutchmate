import { DEFAULT_TRANSLATION_PROVIDER } from "./providers/provider-factory.mjs";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const DEFAULT_MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const DEFAULT_MYMEMORY_SOURCE_LANGUAGE = "nl";
const SUPPORTED_LANGUAGES = new Set(["nl", "en", "te"]);
const SUPPORTED_PROVIDERS = new Set([DEFAULT_TRANSLATION_PROVIDER, "deepl", "mymemory"]);

export function readBackendConfig(environment = process.env) {
  const provider = normalizeProvider(environment.TRANSLATION_PROVIDER);
  const host = normalizeHost(environment.HOST);
  const port = normalizePort(environment.PORT);
  const rateLimit = normalizeRateLimitConfig(environment);
  const deepl = normalizeDeepLConfig(provider, environment);
  const mymemory = normalizeMyMemoryConfig(environment);

  return {
    provider,
    host,
    port,
    rateLimit,
    deepl,
    mymemory,
  };
}

function normalizeProvider(value) {
  const provider = (value ?? DEFAULT_TRANSLATION_PROVIDER).trim().toLowerCase();

  if (!provider) {
    throw new Error("TRANSLATION_PROVIDER must not be empty");
  }

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw new Error(
      `Unsupported TRANSLATION_PROVIDER "${value}". Supported providers: local-dev, deepl, mymemory`,
    );
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

function normalizeRateLimitConfig(environment) {
  return {
    maxRequests: normalizePositiveInteger(
      "RATE_LIMIT_MAX_REQUESTS",
      environment.RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    ),
    windowMs: normalizePositiveInteger(
      "RATE_LIMIT_WINDOW_MS",
      environment.RATE_LIMIT_WINDOW_MS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
    ),
  };
}

function normalizePositiveInteger(name, value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1 || String(parsedValue) !== value.trim()) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
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

function normalizeMyMemoryConfig(environment) {
  const apiUrl = environment.MYMEMORY_API_URL?.trim() ?? DEFAULT_MYMEMORY_API_URL;
  const defaultSourceLanguage = (
    environment.MYMEMORY_SOURCE_LANGUAGE ?? DEFAULT_MYMEMORY_SOURCE_LANGUAGE
  )
    .trim()
    .toLowerCase();
  const email = environment.MYMEMORY_EMAIL?.trim() || undefined;

  validateHttpUrl("MYMEMORY_API_URL", apiUrl);
  validateSupportedLanguage("MYMEMORY_SOURCE_LANGUAGE", defaultSourceLanguage);

  return {
    apiUrl,
    defaultSourceLanguage,
    email,
  };
}

function validateSupportedLanguage(name, value) {
  if (!SUPPORTED_LANGUAGES.has(value)) {
    throw new Error(`${name} must be one of: nl, en, te`);
  }
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
