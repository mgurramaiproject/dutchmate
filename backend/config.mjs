import { DEFAULT_TRANSLATION_PROVIDER } from "./providers/provider-factory.mjs";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS = 4;
const DEFAULT_BACKPRESSURE_RETRY_AFTER_SECONDS = 15;
const DEFAULT_AZURE_TRANSLATOR_API_URL =
  "https://api.cognitive.microsofttranslator.com/translate";
const DEFAULT_DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const DEFAULT_GOOGLE_TRANSLATE_API_URL =
  "https://translation.googleapis.com/language/translate/v2";
const DEFAULT_MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const DEFAULT_MYMEMORY_SOURCE_LANGUAGE = "nl";
const SUPPORTED_LANGUAGES = new Set(["nl", "en", "te"]);
const SUPPORTED_PROVIDERS = new Set([
  DEFAULT_TRANSLATION_PROVIDER,
  "azure-translator",
  "deepl",
  "google-translate",
  "mymemory",
]);

export function readBackendConfig(environment = process.env) {
  const provider = normalizeProvider(environment.TRANSLATION_PROVIDER);
  const host = normalizeHost(environment.HOST);
  const port = normalizePort(environment.PORT);
  const rateLimit = normalizeRateLimitConfig(environment);
  const backpressure = normalizeBackpressureConfig(environment);
  const azureTranslator = normalizeAzureTranslatorConfig(provider, environment);
  const deepl = normalizeDeepLConfig(provider, environment);
  const googleTranslate = normalizeGoogleTranslateConfig(provider, environment);
  const mymemory = normalizeMyMemoryConfig(environment);

  return {
    provider,
    host,
    port,
    rateLimit,
    backpressure,
    azureTranslator,
    deepl,
    googleTranslate,
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
      `Unsupported TRANSLATION_PROVIDER "${value}". Supported providers: local-dev, azure-translator, deepl, google-translate, mymemory`,
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

function normalizeBackpressureConfig(environment) {
  return {
    maxInFlightRequests: normalizePositiveInteger(
      "BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS",
      environment.BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS,
      DEFAULT_BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS,
    ),
    retryAfterSeconds: normalizePositiveInteger(
      "BACKPRESSURE_RETRY_AFTER_SECONDS",
      environment.BACKPRESSURE_RETRY_AFTER_SECONDS,
      DEFAULT_BACKPRESSURE_RETRY_AFTER_SECONDS,
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

function normalizeAzureTranslatorConfig(provider, environment) {
  const apiKey = environment.AZURE_TRANSLATOR_KEY?.trim() ?? "";
  const apiUrl =
    environment.AZURE_TRANSLATOR_API_URL?.trim() ?? DEFAULT_AZURE_TRANSLATOR_API_URL;
  const region = environment.AZURE_TRANSLATOR_REGION?.trim() || undefined;

  if (provider !== "azure-translator") {
    return {
      apiUrl,
      region,
    };
  }

  if (!apiKey) {
    throw new Error("AZURE_TRANSLATOR_KEY is required when TRANSLATION_PROVIDER=azure-translator");
  }

  validateHttpUrl("AZURE_TRANSLATOR_API_URL", apiUrl);

  return {
    apiKey,
    apiUrl,
    region,
  };
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

function normalizeGoogleTranslateConfig(provider, environment) {
  const apiKey = environment.GOOGLE_TRANSLATE_API_KEY?.trim() ?? "";
  const apiUrl = environment.GOOGLE_TRANSLATE_API_URL?.trim() ?? DEFAULT_GOOGLE_TRANSLATE_API_URL;

  if (provider !== "google-translate") {
    return {
      apiUrl,
    };
  }

  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is required when TRANSLATION_PROVIDER=google-translate");
  }

  validateHttpUrl("GOOGLE_TRANSLATE_API_URL", apiUrl);

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
