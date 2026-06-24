import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./config.mjs";

describe("readBackendConfig", () => {
  it("returns local defaults", () => {
    expect(readBackendConfig({})).toEqual({
      provider: "local-dev",
      host: "127.0.0.1",
      port: 8787,
      rateLimit: {
        maxRequests: 60,
        windowMs: 60000,
      },
      backpressure: {
        maxInFlightRequests: 4,
        retryAfterSeconds: 15,
      },
      azureTranslator: {
        apiUrl: "https://api.cognitive.microsofttranslator.com/translate",
        region: undefined,
      },
      deepl: {
        apiUrl: "https://api-free.deepl.com/v2/translate",
      },
      googleTranslate: {
        apiUrl: "https://translation.googleapis.com/language/translate/v2",
      },
      mymemory: {
        apiUrl: "https://api.mymemory.translated.net/get",
        defaultSourceLanguage: "nl",
        email: undefined,
      },
    });
  });

  it("normalizes configured values", () => {
    expect(
      readBackendConfig({
        TRANSLATION_PROVIDER: " LOCAL-DEV ",
        HOST: " 0.0.0.0 ",
        PORT: "3000",
        RATE_LIMIT_MAX_REQUESTS: "30",
        RATE_LIMIT_WINDOW_MS: "15000",
        BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS: "8",
        BACKPRESSURE_RETRY_AFTER_SECONDS: "9",
        AZURE_TRANSLATOR_API_URL: " https://example.test/translate ",
        AZURE_TRANSLATOR_REGION: " westeurope ",
        DEEPL_API_URL: " https://example.test/v2/translate ",
        GOOGLE_TRANSLATE_API_URL: " https://example.test/language/translate/v2 ",
        MYMEMORY_API_URL: " https://example.test/get ",
        MYMEMORY_SOURCE_LANGUAGE: " TE ",
        MYMEMORY_EMAIL: " learner@example.com ",
      }),
    ).toEqual({
      provider: "local-dev",
      host: "0.0.0.0",
      port: 3000,
      rateLimit: {
        maxRequests: 30,
        windowMs: 15000,
      },
      backpressure: {
        maxInFlightRequests: 8,
        retryAfterSeconds: 9,
      },
      azureTranslator: {
        apiUrl: "https://example.test/translate",
        region: "westeurope",
      },
      deepl: {
        apiUrl: "https://example.test/v2/translate",
      },
      googleTranslate: {
        apiUrl: "https://example.test/language/translate/v2",
      },
      mymemory: {
        apiUrl: "https://example.test/get",
        defaultSourceLanguage: "te",
        email: "learner@example.com",
      },
    });
  });

  it("accepts DeepL config when its API key is present", () => {
    expect(
      readBackendConfig({
        TRANSLATION_PROVIDER: "deepl",
        DEEPL_API_KEY: " test-key ",
        DEEPL_API_URL: "https://example.test/v2/translate",
      }),
    ).toEqual({
      provider: "deepl",
      host: "127.0.0.1",
      port: 8787,
      rateLimit: {
        maxRequests: 60,
        windowMs: 60000,
      },
      backpressure: {
        maxInFlightRequests: 4,
        retryAfterSeconds: 15,
      },
      azureTranslator: {
        apiUrl: "https://api.cognitive.microsofttranslator.com/translate",
        region: undefined,
      },
      deepl: {
        apiKey: "test-key",
        apiUrl: "https://example.test/v2/translate",
      },
      googleTranslate: {
        apiUrl: "https://translation.googleapis.com/language/translate/v2",
      },
      mymemory: {
        apiUrl: "https://api.mymemory.translated.net/get",
        defaultSourceLanguage: "nl",
        email: undefined,
      },
    });
  });

  it("accepts Azure Translator config when its API key is present", () => {
    expect(
      readBackendConfig({
        TRANSLATION_PROVIDER: "azure-translator",
        AZURE_TRANSLATOR_KEY: " test-key ",
        AZURE_TRANSLATOR_API_URL: "https://example.test/translate",
        AZURE_TRANSLATOR_REGION: " westeurope ",
      }),
    ).toEqual({
      provider: "azure-translator",
      host: "127.0.0.1",
      port: 8787,
      rateLimit: {
        maxRequests: 60,
        windowMs: 60000,
      },
      backpressure: {
        maxInFlightRequests: 4,
        retryAfterSeconds: 15,
      },
      azureTranslator: {
        apiKey: "test-key",
        apiUrl: "https://example.test/translate",
        region: "westeurope",
      },
      deepl: {
        apiUrl: "https://api-free.deepl.com/v2/translate",
      },
      googleTranslate: {
        apiUrl: "https://translation.googleapis.com/language/translate/v2",
      },
      mymemory: {
        apiUrl: "https://api.mymemory.translated.net/get",
        defaultSourceLanguage: "nl",
        email: undefined,
      },
    });
  });

  it("accepts Google Translate config when its API key is present", () => {
    expect(
      readBackendConfig({
        TRANSLATION_PROVIDER: "google-translate",
        GOOGLE_TRANSLATE_API_KEY: " test-key ",
        GOOGLE_TRANSLATE_API_URL: "https://example.test/language/translate/v2",
      }),
    ).toEqual({
      provider: "google-translate",
      host: "127.0.0.1",
      port: 8787,
      rateLimit: {
        maxRequests: 60,
        windowMs: 60000,
      },
      backpressure: {
        maxInFlightRequests: 4,
        retryAfterSeconds: 15,
      },
      azureTranslator: {
        apiUrl: "https://api.cognitive.microsofttranslator.com/translate",
        region: undefined,
      },
      deepl: {
        apiUrl: "https://api-free.deepl.com/v2/translate",
      },
      googleTranslate: {
        apiKey: "test-key",
        apiUrl: "https://example.test/language/translate/v2",
      },
      mymemory: {
        apiUrl: "https://api.mymemory.translated.net/get",
        defaultSourceLanguage: "nl",
        email: undefined,
      },
    });
  });

  it("rejects empty providers", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: " " })).toThrow(
      "TRANSLATION_PROVIDER must not be empty",
    );
  });

  it("rejects Azure Translator config without an API key when selected", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "azure-translator" })).toThrow(
      "AZURE_TRANSLATOR_KEY is required when TRANSLATION_PROVIDER=azure-translator",
    );
  });

  it("rejects DeepL config without an API key when selected", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "deepl" })).toThrow(
      "DEEPL_API_KEY is required when TRANSLATION_PROVIDER=deepl",
    );
  });

  it("rejects Google Translate config without an API key when selected", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "google-translate" })).toThrow(
      "GOOGLE_TRANSLATE_API_KEY is required when TRANSLATION_PROVIDER=google-translate",
    );
  });

  it("rejects unsupported providers", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "unknown" })).toThrow(
      'Unsupported TRANSLATION_PROVIDER "unknown". Supported providers: local-dev, azure-translator, deepl, google-translate, mymemory',
    );
  });

  it("rejects empty hosts", () => {
    expect(() => readBackendConfig({ HOST: " " })).toThrow("HOST must not be empty");
  });

  it("rejects invalid ports", () => {
    expect(() => readBackendConfig({ PORT: "0" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
    expect(() => readBackendConfig({ PORT: "65536" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
    expect(() => readBackendConfig({ PORT: "8787abc" })).toThrow(
      "PORT must be an integer between 1 and 65535",
    );
  });

  it("rejects invalid rate limit values", () => {
    expect(() => readBackendConfig({ RATE_LIMIT_MAX_REQUESTS: "0" })).toThrow(
      "RATE_LIMIT_MAX_REQUESTS must be a positive integer",
    );
    expect(() => readBackendConfig({ RATE_LIMIT_WINDOW_MS: "60000ms" })).toThrow(
      "RATE_LIMIT_WINDOW_MS must be a positive integer",
    );
    expect(() => readBackendConfig({ BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS: "0" })).toThrow(
      "BACKPRESSURE_MAX_IN_FLIGHT_REQUESTS must be a positive integer",
    );
    expect(() => readBackendConfig({ BACKPRESSURE_RETRY_AFTER_SECONDS: "soon" })).toThrow(
      "BACKPRESSURE_RETRY_AFTER_SECONDS must be a positive integer",
    );
  });

  it("rejects invalid DeepL URLs", () => {
    expect(() =>
      readBackendConfig({
        TRANSLATION_PROVIDER: "deepl",
        DEEPL_API_KEY: "test-key",
        DEEPL_API_URL: "not-a-url",
      }),
    ).toThrow("DEEPL_API_URL must be a valid http or https URL");
  });

  it("rejects invalid Azure Translator URLs", () => {
    expect(() =>
      readBackendConfig({
        TRANSLATION_PROVIDER: "azure-translator",
        AZURE_TRANSLATOR_KEY: "test-key",
        AZURE_TRANSLATOR_API_URL: "not-a-url",
      }),
    ).toThrow("AZURE_TRANSLATOR_API_URL must be a valid http or https URL");
  });

  it("rejects invalid Google Translate URLs", () => {
    expect(() =>
      readBackendConfig({
        TRANSLATION_PROVIDER: "google-translate",
        GOOGLE_TRANSLATE_API_KEY: "test-key",
        GOOGLE_TRANSLATE_API_URL: "not-a-url",
      }),
    ).toThrow("GOOGLE_TRANSLATE_API_URL must be a valid http or https URL");
  });

  it("rejects invalid MyMemory URLs", () => {
    expect(() => readBackendConfig({ MYMEMORY_API_URL: "not-a-url" })).toThrow(
      "MYMEMORY_API_URL must be a valid http or https URL",
    );
  });

  it("rejects MyMemory source languages outside the MVP language set", () => {
    expect(() => readBackendConfig({ MYMEMORY_SOURCE_LANGUAGE: "fr" })).toThrow(
      "MYMEMORY_SOURCE_LANGUAGE must be one of: nl, en, te",
    );
  });
});
