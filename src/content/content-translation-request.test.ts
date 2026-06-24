import { describe, expect, it, vi } from "vitest";
import { DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE } from "./direct-translation-request";
import {
  createMemoryCache,
  requestContentTranslation,
} from "./content-translation-request";

const request = {
  text: "huis",
  sourceLanguage: "nl" as const,
  targetLanguage: "en" as const,
  context: "selection" as const,
};

describe("requestContentTranslation", () => {
  it("recovers on the next chrome lookup after a failed request", async () => {
    const cache = createMemoryCache();
    const requestDirectTranslation = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        error: DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE,
      })
      .mockResolvedValueOnce({
        ok: true,
        result: {
          translatedText: "house",
          providerName: "custom-endpoint",
        },
      });

    await expect(
      requestContentTranslation(request, {
        browserTarget: "chrome",
        cache,
        extensionApi: undefined,
        requestDirectTranslation,
        requestRuntimeTranslation: vi.fn(),
        chromeDirectTranslationFallbackMs: 0,
        delay: async () => {},
      }),
    ).resolves.toEqual({
      ok: false,
      error: DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE,
    });

    await expect(
      requestContentTranslation(request, {
        browserTarget: "chrome",
        cache,
        extensionApi: undefined,
        requestDirectTranslation,
        requestRuntimeTranslation: vi.fn(),
        chromeDirectTranslationFallbackMs: 0,
        delay: async () => {},
      }),
    ).resolves.toEqual({
      ok: true,
      result: {
        translatedText: "house",
        providerName: "custom-endpoint",
      },
    });

    expect(requestDirectTranslation).toHaveBeenCalledTimes(2);
    expect(cache.stored).toEqual({
      translatedText: "house",
      providerName: "custom-endpoint",
    });
  });

  it("recovers on the next runtime lookup after a failed request", async () => {
    const cache = createMemoryCache();
    const requestRuntimeTranslation = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        error:
          "Translation failed: Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.",
      })
      .mockResolvedValueOnce({
        ok: true,
        result: {
          translatedText: "house",
          providerName: "custom-endpoint",
        },
      });

    await expect(
      requestContentTranslation(request, {
        browserTarget: "firefox",
        cache,
        extensionApi: undefined,
        requestDirectTranslation: vi.fn(),
        requestRuntimeTranslation,
        chromeDirectTranslationFallbackMs: 0,
        delay: async () => {},
      }),
    ).resolves.toEqual({
      ok: false,
      error:
        "Translation failed: Provider endpoint is unreachable. Check that the backend is running and the endpoint URL is correct.",
    });

    await expect(
      requestContentTranslation(request, {
        browserTarget: "firefox",
        cache,
        extensionApi: undefined,
        requestDirectTranslation: vi.fn(),
        requestRuntimeTranslation,
        chromeDirectTranslationFallbackMs: 0,
        delay: async () => {},
      }),
    ).resolves.toEqual({
      ok: true,
      result: {
        translatedText: "house",
        providerName: "custom-endpoint",
      },
    });

    expect(requestRuntimeTranslation).toHaveBeenCalledTimes(2);
    expect(cache.stored).toEqual({
      translatedText: "house",
      providerName: "custom-endpoint",
    });
  });
});
