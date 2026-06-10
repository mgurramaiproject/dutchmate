import { describe, expect, it } from "vitest";
import type { TranslationRequest, TranslationResult } from "./provider";
import { TranslationCache } from "./translation-cache";

const baseRequest: TranslationRequest = {
  text: "bonjour",
  sourceLanguage: "auto",
  targetLanguage: "en",
  context: "hover",
};

const baseResult: TranslationResult = {
  translatedText: "hello",
  providerName: "test",
};

describe("TranslationCache", () => {
  it("returns cached translations for the same request", () => {
    const cache = new TranslationCache(2);

    cache.set(baseRequest, baseResult);

    expect(cache.get(baseRequest)).toEqual(baseResult);
  });

  it("keeps target language, context, and text as separate cache keys", () => {
    const cache = new TranslationCache(3);
    const selectionRequest = { ...baseRequest, context: "selection" as const };

    cache.set(baseRequest, baseResult);

    expect(cache.get(selectionRequest)).toBeNull();
  });

  it("evicts the oldest entry after reaching max size", () => {
    const cache = new TranslationCache(1);
    const secondRequest = { ...baseRequest, text: "hola" };

    cache.set(baseRequest, baseResult);
    cache.set(secondRequest, { ...baseResult, translatedText: "hello again" });

    expect(cache.get(baseRequest)).toBeNull();
    expect(cache.get(secondRequest)?.translatedText).toBe("hello again");
  });
});

