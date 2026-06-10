import { describe, expect, it, vi } from "vitest";
import { createDeepLProvider } from "./deepl-provider.mjs";

describe("createDeepLProvider", () => {
  it("calls DeepL translate API and maps the response", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        translations: [
          {
            detected_source_language: "FR",
            text: "hello",
          },
        ],
      }),
    }));
    const provider = createDeepLProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/v2/translate",
      fetchFn,
    });

    await expect(
      provider.translate({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).resolves.toEqual({
      translatedText: "hello",
      provider: "deepl",
    });

    expect(fetchFn).toHaveBeenCalledWith("https://example.test/v2/translate", {
      method: "POST",
      headers: {
        Authorization: "DeepL-Auth-Key test-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: ["bonjour"],
        target_lang: "EN",
      }),
    });
  });

  it("throws on non-OK responses", async () => {
    const provider = createDeepLProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/v2/translate",
      fetchFn: async () => ({
        ok: false,
        status: 403,
      }),
    });

    await expect(
      provider.translate({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).rejects.toThrow("DeepL returned 403");
  });

  it("throws when translated text is missing", async () => {
    const provider = createDeepLProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/v2/translate",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          translations: [],
        }),
      }),
    });

    await expect(
      provider.translate({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).rejects.toThrow("DeepL response is missing translations[0].text");
  });
});
