import { describe, expect, it, vi } from "vitest";
import { createGoogleTranslateProvider } from "./google-translate-provider.mjs";

describe("createGoogleTranslateProvider", () => {
  it("calls Google Cloud Translation with API key, text, source, and target language", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          translations: [
            {
              translatedText: "house",
            },
          ],
        },
      }),
    }));
    const provider = createGoogleTranslateProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/language/translate/v2",
      fetchFn,
    });

    await expect(
      provider.translate({
        text: "huis",
        sourceLanguage: "nl",
        targetLanguage: "en",
        context: "selection",
      }),
    ).resolves.toEqual({
      translatedText: "house",
      provider: "google-translate",
    });

    const [url, options] = fetchFn.mock.calls[0];
    expect(url.href).toBe(
      "https://example.test/language/translate/v2?key=test-key&q=huis&target=en&format=text&source=nl",
    );
    expect(options).toEqual({
      method: "POST",
    });
  });

  it("omits source language when auto detection is requested", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          translations: [
            {
              translatedText: "hello",
            },
          ],
        },
      }),
    }));
    const provider = createGoogleTranslateProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/language/translate/v2",
      fetchFn,
    });

    await provider.translate({
      text: "hallo",
      sourceLanguage: "auto",
      targetLanguage: "en",
      context: "hover",
    });

    const [url] = fetchFn.mock.calls[0];
    expect(url.searchParams.get("source")).toBeNull();
  });

  it("throws a provider rate-limit error on Google 429 responses", async () => {
    const provider = createGoogleTranslateProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/language/translate/v2",
      fetchFn: async () => ({
        ok: false,
        status: 429,
      }),
    });

    await expect(
      provider.translate({
        text: "huis",
        sourceLanguage: "nl",
        targetLanguage: "en",
        context: "selection",
      }),
    ).rejects.toMatchObject({
      message: "Google Translate returned 429",
      name: "ProviderError",
      statusCode: 429,
      providerName: "google-translate",
      providerStatus: 429,
    });
  });

  it("throws when translated text is missing", async () => {
    const provider = createGoogleTranslateProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/language/translate/v2",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          data: {
            translations: [],
          },
        }),
      }),
    });

    await expect(
      provider.translate({
        text: "huis",
        sourceLanguage: "nl",
        targetLanguage: "en",
        context: "selection",
      }),
    ).rejects.toThrow(
      "Google Translate response is missing data.translations[0].translatedText",
    );
  });
});
