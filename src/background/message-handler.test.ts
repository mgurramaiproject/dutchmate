import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      sync: {
        get: vi.fn(),
      },
    },
  },
}));
import {
  REVIEW_CLEAR_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  LEARNING_CREATE_OR_MERGE_MESSAGE,
  LEARNING_EXPORT_MESSAGE,
  LEARNING_IMPORT_MESSAGE,
  LEARNING_RECORD_ENCOUNTER_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
  type BackgroundMessageResponse,
} from "./messages";
import { createBackgroundMessageHandler } from "./message-handler";
import { ReviewCardStore } from "../vocabulary/review-cards";
import { SavedVocabularyStore, type SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";
import { defaultSettings } from "../shared/settings";
import { createVocabularyBackup } from "../vocabulary/vocabulary-backup";
import { LearningRecordStore } from "../vocabulary/learning-record";

describe("createBackgroundMessageHandler", () => {
  it("refreshes the badge after vocabulary saves and ratings", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const refreshBadge = vi.fn(async () => undefined);
    const handleMessage = createBackgroundMessageHandler({
      savedVocabulary,
      reviewCards,
      reviewSettings: {
        read: async () => defaultSettings,
        update: async (changes) => ({ ...defaultSettings, ...changes }),
      },
      refreshBadge,
    });

    await send(handleMessage, {
      type: SAVE_VOCABULARY_MESSAGE,
      payload: {
        text: "huis",
        sourceLanguage: "auto",
        detectedSourceLanguage: "nl",
        targetLanguage: "en",
        translatedText: "house",
        providerName: "test",
      },
    });
    await send(handleMessage, {
      type: REVIEW_RATE_MESSAGE,
      payload: { id: "nl\u001fhuis", rating: "good" },
    });
    await expect(
      send(handleMessage, {
        type: REVIEW_SETTINGS_UPDATE_MESSAGE,
        payload: { dailyReviewBadge: false },
      }),
    ).resolves.toMatchObject({ ok: true, result: { settings: { dailyReviewBadge: false } } });

    expect(refreshBadge).toHaveBeenCalledTimes(3);
  });

  it("refreshes the badge after import and clear", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const refreshBadge = vi.fn(async () => undefined);
    const handleMessage = createBackgroundMessageHandler({
      savedVocabulary,
      reviewCards,
      refreshBadge,
    });
    const backup = createVocabularyBackup([
      {
        id: "nl\u001fhuis",
        dutch: "huis",
        english: "house",
        telugu: null,
        pageContext: null,
        createdAt: 1_000,
        updatedAt: 1_000,
        dueAt: null,
        lastReviewedAt: null,
        lastRating: null,
        reviewCount: 0,
      },
    ], 1_000);

    await send(handleMessage, {
      type: REVIEW_IMPORT_MESSAGE,
      payload: { document: JSON.stringify(backup) },
    });
    await send(handleMessage, { type: REVIEW_CLEAR_MESSAGE });

    await expect(reviewCards.list()).resolves.toEqual([]);
    expect(refreshBadge).toHaveBeenCalledTimes(2);
  });

  it("handles learning records through the typed background contract with an injected clock", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({
      savedVocabulary, reviewCards, learningRecords: new LearningRecordStore(storage, () => 1_000), refreshBadge: async () => undefined,
    });
    await expect(send(handleMessage, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload: { dutch: "goedemorgen", english: "good morning", source: "webpage" } })).resolves.toMatchObject({ ok: true, result: { item: { id: "nl\u001fgoedemorgen", createdAt: 1_000 } } });
    const exported = await send(handleMessage, { type: LEARNING_EXPORT_MESSAGE });
    expect(exported).toMatchObject({ ok: true, result: { backup: { version: 2, learningItems: [expect.objectContaining({ english: "good morning" })] } } });
    const versionOne = createVocabularyBackup([{ id: "nl\u001fboom", dutch: "boom", english: "tree", telugu: null, pageContext: null, createdAt: 1, updatedAt: 1, dueAt: null, lastReviewedAt: null, lastRating: null, reviewCount: 0 }], 1_000);
    await expect(send(handleMessage, { type: LEARNING_IMPORT_MESSAGE, payload: { document: JSON.stringify(versionOne) } })).resolves.toMatchObject({ ok: true, result: { importedCount: 1, totalCount: 2 } });
  });

  it("records an encounter without changing mastery through the learning contract", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const records = new LearningRecordStore(storage, () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_RECORD_ENCOUNTER_MESSAGE, payload: { id: item.id, context: "Een huis staat daar." } })).resolves.toEqual({ ok: true, result: { recorded: true } });
    await expect(records.list()).resolves.toEqual([expect.objectContaining({ contexts: [{ text: "Een huis staat daar.", addedAt: 1_000 }], recognition: item.recognition, recall: item.recall })]);
  });
});

async function send(
  handleMessage: ReturnType<typeof createBackgroundMessageHandler>,
  message: Parameters<typeof handleMessage>[0],
): Promise<BackgroundMessageResponse> {
  return new Promise((resolve) => {
    expect(handleMessage(message, resolve)).toBe(true);
  });
}

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}
