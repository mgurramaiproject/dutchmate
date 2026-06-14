import { afterEach, describe, expect, it, vi } from "vitest";
import type { TranslationRequest } from "./provider";
import { CustomEndpointTranslationProvider } from "./custom-endpoint-provider";
import { TranslationCache } from "./translation-cache";

const request: TranslationRequest = {
  text: "bonjour",
  sourceLanguage: "auto",
  targetLanguage: "en",
  context: "hover",
};

describe("CustomEndpointTranslationProvider", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("posts the translation request and bearer token to the configured endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 }),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "secret",
      },
      new TranslationCache(10),
    );

    const result = await provider.translate(request);

    expect(result).toEqual({
      translatedText: "hello",
      providerName: "custom-endpoint",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/translate",
      expect.objectContaining({
        method: "POST",
        signal: expect.any(AbortSignal),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret",
        },
        body: JSON.stringify(request),
      }),
    );
  });

  it("omits authorization when no API key is configured", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 }),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await provider.translate(request);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/translate",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("rejects a response that is missing translatedText", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ text: "hello" }), { status: 200 }),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await expect(provider.translate(request)).rejects.toThrow(
      "Provider response is missing translatedText",
    );
  });

  it("rejects non-OK provider responses with status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "nope" }), { status: 503 }),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await expect(provider.translate(request)).rejects.toThrow("Provider returned 503");
  });

  it("times out slow provider requests", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_endpoint, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
        timeoutMs: 25,
      },
      new TranslationCache(10),
    );

    const translation = expect(provider.translate(request)).rejects.toThrow(
      "Provider request timed out",
    );
    await vi.advanceTimersByTimeAsync(25);

    await translation;
  });

  it("does not call the endpoint twice for a repeated hover translation", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 }),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await provider.translate(request);
    await provider.translate(request);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("calls the endpoint again when the target language changes", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 });
    });
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await provider.translate(request);
    await provider.translate({
      ...request,
      targetLanguage: "te",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
