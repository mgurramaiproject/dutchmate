import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE,
  DIRECT_TRANSLATION_UNREACHABLE_MESSAGE,
  requestDirectTranslation,
} from "./direct-translation-request";

const request = {
  text: "huis",
  sourceLanguage: "nl" as const,
  targetLanguage: "en" as const,
  context: "hover" as const,
};

const settings = {
  providerEndpoint: "https://example.test/translate",
  providerApiKey: "",
  timeoutMs: 100,
};

describe("requestDirectTranslation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps provider rate limits to a friendly tooltip message", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ error: "busy" }), { status: 429 }));

    await expect(requestDirectTranslation(request, settings, fetchFn)).resolves.toEqual({
      ok: false,
      error: DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE,
    });
  });

  it("reports unreachable provider endpoints clearly", async () => {
    const fetchFn = vi.fn(async () => {
      throw new TypeError("NetworkError");
    });

    await expect(requestDirectTranslation(request, settings, fetchFn)).resolves.toEqual({
      ok: false,
      error: DIRECT_TRANSLATION_UNREACHABLE_MESSAGE,
    });
  });

  it("recovers on the next request after a failed direct translation", async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "busy" }), { status: 429 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ translatedText: "house" }), { status: 200 }),
      );

    await expect(requestDirectTranslation(request, settings, fetchFn)).resolves.toEqual({
      ok: false,
      error: DIRECT_TRANSLATION_RATE_LIMIT_MESSAGE,
    });

    await expect(requestDirectTranslation(request, settings, fetchFn)).resolves.toEqual({
      ok: true,
      result: {
        translatedText: "house",
        providerName: "custom-endpoint",
      },
    });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
