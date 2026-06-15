import { describe, expect, it, vi } from "vitest";
import { createAzureTranslatorProvider } from "./azure-translator-provider.mjs";

describe("createAzureTranslatorProvider", () => {
  it("calls Azure Translator with key, region, source language, and target language", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => [
        {
          translations: [{ text: "house", to: "en" }],
        },
      ],
    }));
    const provider = createAzureTranslatorProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/translate",
      region: "westeurope",
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
      provider: "azure-translator",
    });

    const [url, options] = fetchFn.mock.calls[0];
    expect(url.href).toBe(
      "https://example.test/translate?api-version=3.0&to=en&from=nl",
    );
    expect(options).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Ocp-Apim-Subscription-Key": "test-key",
        "Ocp-Apim-Subscription-Region": "westeurope",
      },
      body: JSON.stringify([{ Text: "huis" }]),
    });
  });

  it("omits source language and region when auto/global mode is used", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => [
        {
          translations: [{ text: "hello", to: "en" }],
        },
      ],
    }));
    const provider = createAzureTranslatorProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/translate",
      fetchFn,
    });

    await provider.translate({
      text: "hallo",
      sourceLanguage: "auto",
      targetLanguage: "en",
      context: "hover",
    });

    const [url, options] = fetchFn.mock.calls[0];
    expect(url.searchParams.get("from")).toBeNull();
    expect(options.headers).not.toHaveProperty("Ocp-Apim-Subscription-Region");
  });

  it("throws a provider rate-limit error on Azure 429 responses", async () => {
    const provider = createAzureTranslatorProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/translate",
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
      message: "Azure Translator returned 429",
      name: "ProviderError",
      statusCode: 429,
      providerName: "azure-translator",
      providerStatus: 429,
    });
  });

  it("throws when translated text is missing", async () => {
    const provider = createAzureTranslatorProvider({
      apiKey: "test-key",
      apiUrl: "https://example.test/translate",
      fetchFn: async () => ({
        ok: true,
        json: async () => [{ translations: [] }],
      }),
    });

    await expect(
      provider.translate({
        text: "huis",
        sourceLanguage: "nl",
        targetLanguage: "en",
        context: "selection",
      }),
    ).rejects.toThrow("Azure Translator response is missing translations[0].text");
  });
});
