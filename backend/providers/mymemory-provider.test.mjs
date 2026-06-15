import { describe, expect, it, vi } from "vitest";
import { createMyMemoryProvider } from "./mymemory-provider.mjs";

describe("createMyMemoryProvider", () => {
  it("calls MyMemory with configured source fallback and maps the response", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        responseData: {
          translatedText: "హలో",
        },
      }),
    }));
    const provider = createMyMemoryProvider({
      apiUrl: "https://example.test/get",
      defaultSourceLanguage: "nl",
      email: "learner@example.com",
      fetchFn,
    });

    await expect(
      provider.translate({
        text: "hallo",
        sourceLanguage: "auto",
        targetLanguage: "te",
        context: "hover",
      }),
    ).resolves.toEqual({
      translatedText: "హలో",
      provider: "mymemory",
    });

    const url = fetchFn.mock.calls[0][0];
    expect(url.href).toBe(
      "https://example.test/get?q=hallo&langpair=nl%7Cte&mt=1&de=learner%40example.com",
    );
  });

  it("uses explicit source language when provided", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        responseData: {
          translatedText: "hallo",
        },
      }),
    }));
    const provider = createMyMemoryProvider({
      apiUrl: "https://example.test/get",
      defaultSourceLanguage: "nl",
      fetchFn,
    });

    await provider.translate({
      text: "hello",
      sourceLanguage: "en",
      targetLanguage: "nl",
      context: "selection",
    });

    expect(fetchFn.mock.calls[0][0].searchParams.get("langpair")).toBe("en|nl");
  });

  it("throws a provider rate-limit error on MyMemory 429 responses", async () => {
    const provider = createMyMemoryProvider({
      apiUrl: "https://example.test/get",
      fetchFn: async () => ({
        ok: false,
        status: 429,
      }),
    });

    await expect(
      provider.translate({
        text: "hallo",
        sourceLanguage: "auto",
        targetLanguage: "te",
        context: "hover",
      }),
    ).rejects.toMatchObject({
      message: "MyMemory returned 429",
      name: "ProviderError",
      statusCode: 429,
      providerName: "mymemory",
      providerStatus: 429,
    });
  });

  it("throws when translated text is missing", async () => {
    const provider = createMyMemoryProvider({
      apiUrl: "https://example.test/get",
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          responseData: {},
        }),
      }),
    });

    await expect(
      provider.translate({
        text: "hallo",
        sourceLanguage: "auto",
        targetLanguage: "te",
        context: "hover",
      }),
    ).rejects.toThrow("MyMemory response is missing responseData.translatedText");
  });
});
