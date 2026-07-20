import { describe, expect, it } from "vitest";
import { LEARNING_RECORD_STORAGE_KEY, LearningRecordStore, parseLearningBackup } from "./learning-record";
import type { SavedVocabularyStorage } from "./saved-vocabulary";

describe("LearningRecordStore", () => {
  it("migrates legacy Dutch meanings and review history once without duplicates", async () => {
    const storage = new MemoryStorage();
    await storage.set("dutchmate.savedVocabulary.v1", { entries: {
      "nl\u001fhuis\u001fen": entry("en", "house"),
      "nl\u001fhuis\u001fte": entry("te", "ఇల్లు"),
    } });
    await storage.set("dutchmate.reviewCards.v1", { cards: { "nl\u001fhuis": card() } });
    const records = new LearningRecordStore(storage, () => 10_000);

    const [first] = await records.list();
    const [second] = await records.list();

    expect(first).toMatchObject({ id: "nl\u001fhuis", kind: "word", english: "house", telugu: "ఇల్లు", recognition: { state: "learning", dueAt: 5_000, attemptCount: 2 }, recall: { state: "new", attemptCount: 0 } });
    expect(first.sources).toEqual(expect.arrayContaining([expect.objectContaining({ providerName: "test", detectedSourceLanguage: "nl", targetLanguage: "en" })]));
    expect(second).toEqual(first);
    expect((storage.values.get(LEARNING_RECORD_STORAGE_KEY) as { items: Record<string, unknown> }).items).toHaveProperty("nl\u001fhuis");
  });

  it("merges new records safely and exports only learning data", async () => {
    const storage = new MemoryStorage();
    await storage.set("providerApiKey", "secret");
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "  goede   morgen ", kind: "chunk", english: "good morning", source: "webpage", context: "Goede morgen, buur!" });
    await records.createOrMerge({ dutch: "goede morgen", telugu: "శుభోదయం", source: "lesson", context: "Goede morgen, buur!" });
    const backup = await records.exportBackup();

    expect(backup.version).toBe(2);
    expect(backup.learningItems[0]).toMatchObject({ id: "nl\u001fgoede morgen", kind: "chunk", english: "good morning", telugu: "శుభోదయం", contexts: [{ text: "Goede morgen, buur!" }] });
    expect(JSON.stringify(backup)).not.toContain("secret");
  });

  it("rejects malformed or unsupported imports before changing storage", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "huis", english: "house" });
    const before = JSON.stringify(storage.values.get(LEARNING_RECORD_STORAGE_KEY));
    expect(() => parseLearningBackup('{"version":2}')).toThrow("not a supported");
    expect(() => parseLearningBackup("not json")).toThrow("not valid JSON");
    expect(() => parseLearningBackup({ format: "dutchmate-learning-backup", version: 2, exportedAt: 1, lessonProgress: {}, rhythm: {}, learningItems: [{ id: "nl\u001fhuis", learningLanguage: "nl", normalizedDutch: "huis", dutch: "huis", kind: "word", english: null, telugu: null, sources: [], contexts: [{ text: "not the saved item", addedAt: 1 }], recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1 }] })).toThrow("invalid learning item");
    expect(JSON.stringify(storage.values.get(LEARNING_RECORD_STORAGE_KEY))).toBe(before);
  });

  it("does not revive deleted or cleared records from compatibility storage", async () => {
    const storage = new MemoryStorage();
    await storage.set("dutchmate.savedVocabulary.v1", { entries: { "nl\u001fhuis\u001fen": entry("en", "house") } });
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.delete("nl\u001fhuis");
    await expect(records.list()).resolves.toEqual([]);
    await records.createOrMerge({ dutch: "boom", english: "tree" });
    await records.clear();
    await expect(records.list()).resolves.toEqual([]);
  });
});

function entry(targetLanguage: "en" | "te", translatedText: string) { return { id: `nl\u001fhuis\u001f${targetLanguage}`, text: "huis", normalizedText: "huis", sourceLanguage: "auto" as const, detectedSourceLanguage: "nl" as const, targetLanguage, translatedText, providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." }; }
function card() { return { id: "nl\u001fhuis", dutch: "huis", english: null, telugu: null, pageContext: "Een huis staat daar.", createdAt: 1_000, updatedAt: 3_000, dueAt: 5_000, lastReviewedAt: 4_000, lastRating: "good" as const, reviewCount: 2 }; }
class MemoryStorage implements SavedVocabularyStorage { readonly values = new Map<string, unknown>(); async get(key: string) { return this.values.get(key); } async set(key: string, value: unknown) { this.values.set(key, value); } }
