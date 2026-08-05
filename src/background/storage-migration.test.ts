import { describe, expect, it } from "vitest";
import { migrateExtensionStorage, STORAGE_MIGRATION_KEY } from "./storage-migration";
import { LocalCacheStorage, type LocalCacheExtensionApi } from "./local-cache-storage";
import { LEARNING_RECORD_STORAGE_KEY, LearningRecordStore } from "../vocabulary/learning-record";
import type { SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";

describe("extension storage migration", () => {
  it("migrates legacy learning data automatically and records the completed migration", async () => {
    const storage = new MemoryStorage();
    await storage.set("dutchmate.savedVocabulary.v1", { entries: {
      "nl\u001fhuis\u001fen": { id: "nl\u001fhuis\u001fen", text: "huis", normalizedText: "huis", sourceLanguage: "auto", detectedSourceLanguage: "nl", targetLanguage: "en", translatedText: "house", providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." },
    } });
    const records = new LearningRecordStore(storage, () => 10_000);

    await migrateExtensionStorage(storage, records);

    await expect(records.list()).resolves.toEqual([expect.objectContaining({ dutch: "huis", english: "house" })]);
    expect(storage.values.get(LEARNING_RECORD_STORAGE_KEY)).toEqual(expect.objectContaining({ version: 2 }));
    expect(storage.values.get(STORAGE_MIGRATION_KEY)).toEqual({ version: 1 });
  });

  it("leaves the source data and migration marker untouched when the write fails", async () => {
    const storage = new FailingStorage();
    const legacy = { entries: { "nl\u001fhuis\u001fen": { id: "nl\u001fhuis\u001fen", text: "huis", normalizedText: "huis", sourceLanguage: "auto", detectedSourceLanguage: "nl", targetLanguage: "en", translatedText: "house", providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: null } } };
    await storage.set("dutchmate.savedVocabulary.v1", legacy);
    const before = structuredClone(legacy);

    await expect(migrateExtensionStorage(storage, new LearningRecordStore(storage, () => 10_000))).rejects.toThrow("Storage unavailable");

    expect(storage.values.get("dutchmate.savedVocabulary.v1")).toEqual(before);
    expect(storage.values.has(LEARNING_RECORD_STORAGE_KEY)).toBe(false);
    expect(storage.values.has(STORAGE_MIGRATION_KEY)).toBe(false);
  });

  it("does not replace the existing learning record when a local read fails", async () => {
    const existingRecord = {
      version: 2,
      items: { "nl\u001fhuis": { dutch: "huis", id: "nl\u001fhuis" } },
      lessonProgress: { "lesson\u001f1": { stage: "keep" } },
      rhythm: { activeDays: { "2026-08-05": { completedAt: 1_000 } } },
    };
    const extensionApi = createReadFailingExtensionApi({
      [LEARNING_RECORD_STORAGE_KEY]: existingRecord,
    });
    const storage = new LocalCacheStorage(extensionApi);

    await expect(
      migrateExtensionStorage(storage, new LearningRecordStore(storage, () => 10_000)),
    ).rejects.toThrow("Storage unavailable");

    expect(extensionApi.values[LEARNING_RECORD_STORAGE_KEY]).toEqual(existingRecord);
    expect(extensionApi.values[STORAGE_MIGRATION_KEY]).toBeUndefined();
  });

  it("recovers legacy history when an earlier migration left an empty record", async () => {
    const storage = new MemoryStorage();
    await storage.set(LEARNING_RECORD_STORAGE_KEY, {
      version: 2,
      items: {},
      lessonProgress: {},
      rhythm: {},
    });
    await storage.set(STORAGE_MIGRATION_KEY, { version: 1 });
    await storage.set("dutchmate.savedVocabulary.v1", { entries: {
      "nl\u001fhuis\u001fen": { id: "nl\u001fhuis\u001fen", text: "huis", normalizedText: "huis", sourceLanguage: "auto", detectedSourceLanguage: "nl", targetLanguage: "en", translatedText: "house", providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." },
    } });
    const records = new LearningRecordStore(storage, () => 10_000);

    await migrateExtensionStorage(storage, records);

    await expect(records.list()).resolves.toEqual([expect.objectContaining({ dutch: "huis", english: "house" })]);
  });

  it("recovers missing legacy items and review evidence without replacing current items", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 10_000);
    const currentItem = await records.createOrMerge({ dutch: "fiets", english: "bike", source: "webpage" });
    const progressedItem = await records.createOrMerge({ dutch: "stoel", english: "chair", source: "webpage" });
    await records.recordMissionResult(progressedItem.id, "recognition", "got-it", 0);
    await storage.set(STORAGE_MIGRATION_KEY, { version: 1 });
    await storage.set("dutchmate.savedVocabulary.v1", { entries: {
      "nl\u001fhuis\u001fen": { id: "nl\u001fhuis\u001fen", text: "huis", normalizedText: "huis", sourceLanguage: "auto", detectedSourceLanguage: "nl", targetLanguage: "en", translatedText: "house", providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." },
    } });
    await storage.set("dutchmate.reviewCards.v1", { cards: {
      "nl\u001ffiets": { id: "nl\u001ffiets", dutch: "fiets", english: "bike", telugu: null, pageContext: null, createdAt: 1_000, updatedAt: 2_000, dueAt: 5_000, lastReviewedAt: 2_000, lastRating: "good", reviewCount: 2 },
      "nl\u001fstoel": { id: "nl\u001fstoel", dutch: "stoel", english: "chair", telugu: null, pageContext: null, createdAt: 1_000, updatedAt: 2_000, dueAt: 5_000, lastReviewedAt: 2_000, lastRating: "good", reviewCount: 5 },
    } });

    await migrateExtensionStorage(storage, records);

    await expect(records.list()).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({ dutch: "fiets", english: "bike", recognition: expect.objectContaining({ attemptCount: 2, dueAt: 5_000 }) }),
      expect.objectContaining({ dutch: "huis", english: "house" }),
      expect.objectContaining({ dutch: "stoel", english: "chair", recognition: expect.objectContaining({ attemptCount: 1 }) }),
    ]));
    await expect(records.list()).resolves.toHaveLength(3);
    expect((await records.list()).find((item) => item.dutch === "fiets")?.id).toBe(currentItem.id);
  });
});

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> { return this.values.get(key); }
  async set(key: string, value: unknown): Promise<void> { this.values.set(key, value); }
}

class FailingStorage extends MemoryStorage {
  override async set(key: string, value: unknown): Promise<void> {
    if (key === LEARNING_RECORD_STORAGE_KEY) throw new Error("Storage unavailable");
    await super.set(key, value);
  }
}

type ReadFailingExtensionApi = LocalCacheExtensionApi & {
  values: Record<string, unknown>;
};

function createReadFailingExtensionApi(values: Record<string, unknown>): ReadFailingExtensionApi {
  const extensionApi: ReadFailingExtensionApi = {
    values: { ...values },
    runtime: {},
    storage: {
      local: {
        get(_keys, callback) {
          extensionApi.runtime.lastError = { message: "Storage unavailable" };
          callback({});
          extensionApi.runtime.lastError = undefined;
        },
        set(items, callback) {
          extensionApi.values = { ...extensionApi.values, ...items };
          callback?.();
        },
      },
    },
  };

  return extensionApi;
}
