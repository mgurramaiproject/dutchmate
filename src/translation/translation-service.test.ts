import { afterEach, describe, expect, it, vi } from "vitest";
import type { TranslationRequest, TranslationResult } from "./provider";
import { TranslationCache } from "./translation-cache";
import { TranslationService } from "./translation-service";

const request: TranslationRequest = {
  text: "bonjour",
  sourceLanguage: "auto",
  targetLanguage: "en",
  context: "selection",
};

describe("TranslationService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the placeholder provider when no endpoint is configured", async () => {
    const service = new TranslationService(
      async () => ({
        providerEndpoint: "",
        providerApiKey: "",
      }),
      new TranslationCache(10),
    );

    await expect(service.translate(request)).resolves.toEqual({
      translatedText: "Translation will appear here. (en)",
      providerName: "placeholder",
    });
  });

  it("uses the custom endpoint provider when an endpoint is configured", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ translatedText: "hello" }), { status: 200 }),
    );
    const service = new TranslationService(
      async () => ({
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      }),
      new TranslationCache(10),
    );

    await expect(service.translate(request)).resolves.toEqual({
      translatedText: "hello",
      providerName: "custom-endpoint",
    });
  });

  it("uses persistent cache before calling the custom endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const service = new TranslationService(
      async () => ({
        providerEndpoint: "https://example.test/translate",
        providerApiKey: "",
      }),
      new TranslationCache(10),
      {
        async get(): Promise<TranslationResult> {
          return {
            translatedText: "hello from persistent cache",
            providerName: "custom-endpoint",
          };
        },
        async set(): Promise<void> {},
      },
    );

    await expect(service.translate(request)).resolves.toEqual({
      translatedText: "hello from persistent cache",
      providerName: "custom-endpoint",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
