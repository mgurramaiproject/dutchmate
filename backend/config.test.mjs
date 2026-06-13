import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./config.mjs";

describe("readBackendConfig", () => {
  it("returns local defaults", () => {
    expect(readBackendConfig({})).toEqual({
      provider: "local-dev",
      host: "127.0.0.1",
      port: 8787,
      deepl: {
        apiUrl: "https://api-free.deepl.com/v2/translate",
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
        DEEPL_API_URL: " https://example.test/v2/translate ",
        MYMEMORY_API_URL: " https://example.test/get ",
        MYMEMORY_SOURCE_LANGUAGE: " TE ",
        MYMEMORY_EMAIL: " learner@example.com ",
      }),
    ).toEqual({
      provider: "local-dev",
      host: "0.0.0.0",
      port: 3000,
      deepl: {
        apiUrl: "https://example.test/v2/translate",
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
      deepl: {
        apiKey: "test-key",
        apiUrl: "https://example.test/v2/translate",
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

  it("rejects unsupported providers", () => {
    expect(() => readBackendConfig({ TRANSLATION_PROVIDER: "deepl" })).toThrow(
      "DEEPL_API_KEY is required when TRANSLATION_PROVIDER=deepl",
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

  it("rejects invalid DeepL URLs", () => {
    expect(() =>
      readBackendConfig({
        TRANSLATION_PROVIDER: "deepl",
        DEEPL_API_KEY: "test-key",
        DEEPL_API_URL: "not-a-url",
      }),
    ).toThrow("DEEPL_API_URL must be a valid http or https URL");
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
