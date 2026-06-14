import { afterEach, describe, expect, it, vi } from "vitest";
import type { TranslationRequest } from "./provider";
import { CustomEndpointTranslationProvider } from "./custom-endpoint-provider";
import { PersistentTranslationCache } from "./persistent-translation-cache";
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

  it("reports unreachable provider endpoints clearly", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new TypeError("NetworkError when attempting to fetch resource."),
    );
    const provider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
    );

    await expect(provider.translate(request)).rejects.toThrow(
      "Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.",
    );
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

  it("stores and reuses eligible single-word selections from persistent cache", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response(JSON.stringify({ translatedText: "house" }), { status: 200 });
    });
    const persistentCache = new PersistentTranslationCache(new MemoryStorage());
    const selectionRequest: TranslationRequest = {
      text: "huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    };

    const firstProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );
    await firstProvider.translate(selectionRequest);

    const secondProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );

    await expect(secondProvider.translate(selectionRequest)).resolves.toEqual({
      translatedText: "house",
      providerName: "custom-endpoint",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not persist hover translations", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 });
    });
    const persistentCache = new PersistentTranslationCache(new MemoryStorage());

    const firstProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );
    await firstProvider.translate(request);

    const secondProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );
    await secondProvider.translate(request);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not persist selected phrases", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      return new Response(JSON.stringify({ translatedText: "the house" }), { status: 200 });
    });
    const persistentCache = new PersistentTranslationCache(new MemoryStorage());
    const phraseRequest: TranslationRequest = {
      text: "het huis",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    };

    const firstProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );
    await firstProvider.translate(phraseRequest);

    const secondProvider = new CustomEndpointTranslationProvider(
      {
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      },
      new TranslationCache(10),
      persistentCache,
    );
    await secondProvider.translate(phraseRequest);

    expect(fetchMock).toHaveBeenCalledTimes(2);
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

class MemoryStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
