import { describe, expect, it } from "vitest";
import type { TranslationRequest, TranslationResult } from "./provider";
import {
  getPersistentCacheEntryKey,
  PersistentTranslationCache,
  type PersistentTranslationCacheStorage,
} from "./persistent-translation-cache";

const selectionRequest: TranslationRequest = {
  text: "huis",
  sourceLanguage: "nl",
  targetLanguage: "en",
  context: "selection",
};

const result: TranslationResult = {
  translatedText: "house",
  providerName: "test",
};

describe("PersistentTranslationCache", () => {
  it("stores and reads a single-word selection", async () => {
    const cache = new PersistentTranslationCache(new MemoryStorage());

    await cache.set(selectionRequest, result);

    await expect(cache.get(selectionRequest)).resolves.toEqual(result);
  });

  it("does not store hovered words", async () => {
    const cache = new PersistentTranslationCache(new MemoryStorage());
    const hoverRequest: TranslationRequest = {
      ...selectionRequest,
      context: "hover",
    };

    await cache.set(hoverRequest, result);

    await expect(cache.get(hoverRequest)).resolves.toBeNull();
  });

  it("does not store selected phrases", async () => {
    const cache = new PersistentTranslationCache(new MemoryStorage());
    const phraseRequest: TranslationRequest = {
      ...selectionRequest,
      text: "het huis",
    };

    await cache.set(phraseRequest, result);

    await expect(cache.get(phraseRequest)).resolves.toBeNull();
  });

  it("expires old entries", async () => {
    let now = 1_000;
    const cache = new PersistentTranslationCache(new MemoryStorage(), {
      ttlMs: 100,
      now: () => now,
    });

    await cache.set(selectionRequest, result);
    now = 1_101;

    await expect(cache.get(selectionRequest)).resolves.toBeNull();
  });

  it("evicts the oldest entry over the max entry count", async () => {
    let now = 1_000;
    const cache = new PersistentTranslationCache(new MemoryStorage(), {
      maxEntries: 1,
      now: () => now,
    });
    const secondRequest: TranslationRequest = {
      ...selectionRequest,
      text: "boom",
    };

    await cache.set(selectionRequest, result);
    now = 1_001;
    await cache.set(secondRequest, { ...result, translatedText: "tree" });

    await expect(cache.get(selectionRequest)).resolves.toBeNull();
    await expect(cache.get(secondRequest)).resolves.toEqual({
      translatedText: "tree",
      providerName: "test",
    });
  });

  it("normalizes text in the cache key", () => {
    expect(
      getPersistentCacheEntryKey({
        ...selectionRequest,
        text: " huis ",
      }),
    ).toBe(getPersistentCacheEntryKey(selectionRequest));
  });
});

class MemoryStorage implements PersistentTranslationCacheStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
