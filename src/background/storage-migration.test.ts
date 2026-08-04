import { describe, expect, it } from "vitest";
import { migrateExtensionStorage, STORAGE_MIGRATION_KEY } from "./storage-migration";
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
