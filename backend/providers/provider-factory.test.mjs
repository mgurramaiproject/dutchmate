import { describe, expect, it } from "vitest";
import { createProvider } from "./provider-factory.mjs";

describe("createProvider", () => {
  it("normalizes provider names", () => {
    expect(createProvider(" LOCAL-DEV ").name).toBe("local-dev");
  });

  it("rejects unsupported providers", () => {
    expect(() => createProvider("unknown")).toThrow(
      'Unsupported TRANSLATION_PROVIDER "unknown". Supported providers: local-dev, deepl, mymemory',
    );
  });

  it("creates DeepL providers", () => {
    const provider = createProvider("deepl", {
      deepl: {
        apiKey: "test-key",
        apiUrl: "https://example.test/v2/translate",
      },
    });

    expect(provider.name).toBe("deepl");
  });

  it("creates MyMemory providers", () => {
    const provider = createProvider("mymemory", {
      mymemory: {
        apiUrl: "https://example.test/get",
        defaultSourceLanguage: "nl",
      },
    });

    expect(provider.name).toBe("mymemory");
  });
});
