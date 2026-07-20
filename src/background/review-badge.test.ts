import { describe, expect, it, vi } from "vitest";
import { updateReviewBadge, type ReviewBadgeProvider } from "./review-badge";
import { ReviewCardStore } from "../vocabulary/review-cards";
import { SavedVocabularyStore, type SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";
import { LearningRecordStore } from "../vocabulary/learning-record";

describe("updateReviewBadge", () => {
  it("shows the reviewed due count", async () => {
    const setBadgeText = vi.fn(async () => undefined);
    const provider: ReviewBadgeProvider = {
      summary: async () => ({ total: 4, due: 2, new: 1, recent: [] }),
    };

    await updateReviewBadge({ action: { setBadgeText } }, provider);

    expect(setBadgeText).toHaveBeenCalledWith({ text: "2" });
  });

  it("hides the badge when no reviewed cards are due", async () => {
    const setBadgeText = vi.fn(async () => undefined);
    const provider: ReviewBadgeProvider = {
      summary: async () => ({ total: 1, due: 0, new: 1, recent: [] }),
    };

    await updateReviewBadge({ action: { setBadgeText } }, provider);

    expect(setBadgeText).toHaveBeenCalledWith({ text: "" });
  });

  it("hides the badge when the preference is disabled", async () => {
    const setBadgeText = vi.fn(async () => undefined);

    await updateReviewBadge(
      { action: { setBadgeText } },
      { summary: async () => ({ total: 1, due: 2, new: 0, recent: [] }) },
      false,
    );

    expect(setBadgeText).toHaveBeenCalledWith({ text: "" });
  });

  it("reflects initialization and later local review mutations", async () => {
    let now = 1_000;
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    await savedVocabulary.save({
      text: "huis",
      sourceLanguage: "auto",
      detectedSourceLanguage: "nl",
      targetLanguage: "en",
      translatedText: "house",
      providerName: "test",
    });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => now);
    const setBadgeText = vi.fn(async () => undefined);
    const badge = { action: { setBadgeText } };

    await updateReviewBadge(badge, reviewCards);
    await reviewCards.rate("nl\u001fhuis", "again");
    now += 24 * 60 * 60 * 1_000;
    await updateReviewBadge(badge, reviewCards);

    expect(setBadgeText).toHaveBeenNthCalledWith(1, { text: "" });
    expect(setBadgeText).toHaveBeenNthCalledWith(2, { text: "1" });
  });

  it("counts an item with recall-only work due", async () => {
    const now = 2_000;
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    await storage.set("dutchmate.learningRecord.v2", { version: 2, items: { [item.id]: { ...item, recall: { ...item.recall, attemptCount: 1, dueAt: now } } }, lessonProgress: {}, rhythm: {} });
    const setBadgeText = vi.fn(async () => undefined);
    await updateReviewBadge({ action: { setBadgeText } }, records);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "1" });
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
