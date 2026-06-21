import { describe, expect, it } from "vitest";
import {
  getSavedVocabularyEntryId,
  normalizeSavedVocabularyText,
  SavedVocabularyStore,
  type SaveVocabularyInput,
  type SavedVocabularyStorage,
} from "./saved-vocabulary";

const saveInput: SaveVocabularyInput = {
  text: "Huis",
  sourceLanguage: "auto",
  detectedSourceLanguage: "nl",
  targetLanguage: "en",
  translatedText: "house",
  providerName: "test",
};

describe("SavedVocabularyStore", () => {
  it("saves and lists a selected word entry", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage(), {
      now: () => 1_000,
    });

    await expect(store.save(saveInput)).resolves.toMatchObject({
      status: "saved",
      entry: {
        text: "huis",
        normalizedText: "huis",
        sourceLanguage: "auto",
        detectedSourceLanguage: "nl",
        targetLanguage: "en",
        translatedText: "house",
        providerName: "test",
        createdAt: 1_000,
        updatedAt: 1_000,
      },
    });

    await expect(store.list()).resolves.toHaveLength(1);
  });

  it("returns the existing entry for duplicate saves", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    const firstResult = await store.save(saveInput);
    const secondResult = await store.save({
      ...saveInput,
      text: " huis ",
    });

    expect(firstResult.status).toBe("saved");
    expect(secondResult).toEqual({
      status: "already-saved",
      entry: firstResult.status === "saved" ? firstResult.entry : undefined,
    });
  });

  it("stores one entry per target language", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    await store.save(saveInput);
    await store.save({
      ...saveInput,
      targetLanguage: "te",
      translatedText: "ఇల్లు",
    });

    await expect(store.list()).resolves.toHaveLength(2);
  });

  it("rejects phrases and empty text", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    await expect(
      store.save({
        ...saveInput,
        text: "het huis",
      }),
    ).resolves.toEqual({
      status: "not-eligible",
      reason: "not-single-word",
    });

    await expect(
      store.save({
        ...saveInput,
        text: " ",
      }),
    ).resolves.toEqual({
      status: "not-eligible",
      reason: "not-single-word",
    });
  });

  it("refuses new saves when the max entry count is reached", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage(), {
      maxEntries: 1,
    });

    await store.save(saveInput);

    await expect(
      store.save({
        ...saveInput,
        text: "boom",
        translatedText: "tree",
      }),
    ).resolves.toEqual({
      status: "max-entries-reached",
      maxEntries: 1,
    });
  });

  it("deletes one saved entry", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());
    const result = await store.save(saveInput);

    if (result.status !== "saved") {
      throw new Error("Expected save to succeed");
    }

    await store.delete(result.entry.id);

    await expect(store.list()).resolves.toEqual([]);
  });

  it("clears all saved entries", async () => {
    const store = new SavedVocabularyStore(new MemoryStorage());

    await store.save(saveInput);
    await store.save({
      ...saveInput,
      text: "boom",
      translatedText: "tree",
    });
    await store.clear();

    await expect(store.list()).resolves.toEqual([]);
  });

  it("sorts newest entries first", async () => {
    let now = 1_000;
    const store = new SavedVocabularyStore(new MemoryStorage(), {
      now: () => now,
    });

    await store.save(saveInput);
    now = 2_000;
    await store.save({
      ...saveInput,
      text: "boom",
      translatedText: "tree",
    });

    await expect(store.list()).resolves.toMatchObject([
      { text: "boom" },
      { text: "huis" },
    ]);
  });
});

describe("saved vocabulary helpers", () => {
  it("normalizes saved text", () => {
    expect(normalizeSavedVocabularyText(" Huis  mooi ")).toBe("huis mooi");
  });

  it("prefers detected source language in entry IDs", () => {
    expect(getSavedVocabularyEntryId(saveInput)).toBe("nl\u001fhuis\u001fen");
  });

  it("uses requested source language when no detected source language exists", () => {
    expect(
      getSavedVocabularyEntryId({
        text: "huis",
        sourceLanguage: "auto",
        targetLanguage: "en",
      }),
    ).toBe("auto\u001fhuis\u001fen");
  });
});

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
