import { describe, expect, it } from "vitest";
import {
  getReviewCardSummary,
  getDueReviewQueue,
  getAllReviewQueue,
  getNewReviewQueue,
  migrateSavedVocabulary,
  rateReviewCard,
  ReviewCardStore,
  type ReviewCard,
} from "./review-cards";
import {
  SavedVocabularyStore,
  type SavedVocabularyEntry,
  type SavedVocabularyStorage,
} from "./saved-vocabulary";

describe("review card migration", () => {
  it("groups Dutch-English-Telugu pairs into one canonical card", () => {
    const cards = migrateSavedVocabulary([
      savedEntry({
        id: "nl\u001fhuis\u001fte",
        targetLanguage: "te",
        translatedText: "ఇల్లు",
        createdAt: 2_000,
        updatedAt: 2_000,
      }),
      savedEntry({
        id: "nl\u001fhuis\u001fen",
        targetLanguage: "en",
        translatedText: "house",
        createdAt: 1_000,
        updatedAt: 1_000,
      }),
    ]);

    expect(cards).toEqual([
      {
        id: "nl\u001fhuis",
        dutch: "huis",
        english: "house",
        telugu: "ఇల్లు",
        pageContext: null,
        createdAt: 1_000,
        updatedAt: 2_000,
        dueAt: null,
        lastReviewedAt: null,
        lastRating: null,
        reviewCount: 0,
      },
    ]);
  });

  it("keeps partial cards reviewable and preserves review metadata", () => {
    const existingCard: ReviewCard = {
      id: "nl\u001fboom",
      dutch: "boom",
      english: null,
      telugu: null,
      pageContext: "Een boom langs de weg.",
      createdAt: 1_000,
      updatedAt: 1_000,
      dueAt: 5_000,
      lastReviewedAt: 4_000,
      lastRating: "hard",
      reviewCount: 2,
    };

    expect(
      migrateSavedVocabulary(
        [savedEntry({ id: "nl\u001fboom\u001fen", text: "boom", translatedText: "tree" })],
        [existingCard],
      ),
    ).toEqual([
      {
        ...existingCard,
        english: "tree",
        updatedAt: 1_000,
      },
    ]);
  });

  it("persists the canonical migration alongside saved vocabulary", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage);
    await savedVocabulary.save(
      savedEntry({
        targetLanguage: "en",
        translatedText: "tree",
        text: "boom",
        normalizedText: "boom",
        id: "nl\u001fboom\u001fen",
      }),
    );

    const reviewCards = new ReviewCardStore(savedVocabulary, storage);

    await expect(reviewCards.list()).resolves.toMatchObject([
      { id: "nl\u001fboom", dutch: "boom", english: "tree" },
    ]);
    expect(storage.values.get("dutchmate.reviewCards.v1")).toMatchObject({
      cards: {
        "nl\u001fboom": { dutch: "boom", english: "tree" },
      },
    });
  });

  it("does not guess the learning language for undetected automatic entries", () => {
    expect(
      migrateSavedVocabulary([
        savedEntry({ detectedSourceLanguage: undefined, sourceLanguage: "auto" }),
      ]),
    ).toEqual([]);
  });
});

describe("review card summary", () => {
  it("separates new and due cards and lists recent cards first", () => {
    const cards: ReviewCard[] = [
      card({ id: "nl\u001foud", dutch: "oud", createdAt: 1_000, dueAt: 4_000, reviewCount: 1 }),
      card({ id: "nl\u001fnieuw", dutch: "nieuw", createdAt: 3_000 }),
      card({ id: "nl\u001flate", dutch: "late", createdAt: 2_000, dueAt: 8_000, reviewCount: 1 }),
      card({ id: "nl\u001fvers", dutch: "vers", createdAt: 4_000 }),
    ];

    expect(getReviewCardSummary(cards, 5_000)).toEqual({
      total: 4,
      due: 1,
      new: 2,
      recent: [cards[3], cards[1], cards[2]],
    });
  });
});

describe("new-card practice", () => {
  it("selects only never-rated cards in oldest-first order", () => {
    const cards = [
      card({ id: "nl\u001fnewest", createdAt: 3_000 }),
      card({ id: "nl\u001foldest", createdAt: 1_000 }),
      card({ id: "nl\u001freviewed", createdAt: 500, reviewCount: 1, dueAt: 2_000 }),
    ];

    expect(getNewReviewQueue(cards)).toEqual([
      expect.objectContaining({ id: "nl\u001foldest" }),
      expect.objectContaining({ id: "nl\u001fnewest" }),
    ]);
  });

  it.each([
    ["again", 1],
    ["hard", 1],
    ["good", 3],
    ["easy", 7],
  ] as const)("schedules %s after its rating", (rating, days) => {
    const reviewedAt = 10_000;

    expect(rateReviewCard(card(), rating, reviewedAt)).toMatchObject({
      dueAt: reviewedAt + days * 24 * 60 * 60 * 1_000,
      lastReviewedAt: reviewedAt,
      lastRating: rating,
      reviewCount: 1,
      updatedAt: reviewedAt,
    });
  });

  it("persists a rating and returns the updated card", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage);
    await savedVocabulary.save(savedEntry({ text: "huis", translatedText: "house" }));
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 20_000);

    const [newCard] = await reviewCards.newQueue();
    const updated = await reviewCards.rate(newCard.id, "good");

    expect(updated).toMatchObject({
      id: newCard.id,
      dueAt: 20_000 + 3 * 24 * 60 * 60 * 1_000,
      lastRating: "good",
      reviewCount: 1,
    });
    await expect(reviewCards.newQueue()).resolves.toEqual([]);
    expect(storage.values.get("dutchmate.reviewCards.v1")).toMatchObject({
      cards: {
        [newCard.id]: updated,
      },
    });
  });

  it("provides due and all queues from the persisted canonical cards", async () => {
    let now = 20_000;
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    await savedVocabulary.save(savedEntry({ text: "huis", translatedText: "house" }));
    await savedVocabulary.save(savedEntry({ text: "boom", translatedText: "tree" }));
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => now);

    await reviewCards.rate("nl\u001fhuis", "again");
    now += 24 * 60 * 60 * 1_000;

    await expect(reviewCards.dueQueue()).resolves.toEqual([
      expect.objectContaining({ id: "nl\u001fhuis" }),
    ]);
    await expect(reviewCards.allQueue()).resolves.toEqual([
      expect.objectContaining({ id: "nl\u001fboom" }),
      expect.objectContaining({ id: "nl\u001fhuis" }),
    ]);
  });
});

describe("review queues", () => {
  it("selects only reviewed due cards in earliest-due order", () => {
    const cards = [
      card({ id: "nl\u001flate", dutch: "late", reviewCount: 1, dueAt: 9_000 }),
      card({ id: "nl\u001fnew", dutch: "new", createdAt: 500 }),
      card({ id: "nl\u001fold", dutch: "old", reviewCount: 2, dueAt: 4_000 }),
      card({ id: "nl\u001ffuture", dutch: "future", reviewCount: 1, dueAt: 20_000 }),
    ];

    expect(getDueReviewQueue(cards, 10_000)).toEqual([
      expect.objectContaining({ id: "nl\u001fold" }),
      expect.objectContaining({ id: "nl\u001flate" }),
    ]);
  });

  it("includes every card in oldest-creation order for all-card review", () => {
    const cards = [
      card({ id: "nl\u001fnewest", createdAt: 3_000 }),
      card({ id: "nl\u001foldest", createdAt: 1_000, reviewCount: 1, dueAt: 5_000 }),
      card({ id: "nl\u001fmiddle", createdAt: 2_000 }),
    ];

    expect(getAllReviewQueue(cards)).toEqual([
      expect.objectContaining({ id: "nl\u001foldest" }),
      expect.objectContaining({ id: "nl\u001fmiddle" }),
      expect.objectContaining({ id: "nl\u001fnewest" }),
    ]);
  });
});

function savedEntry(overrides: Partial<SavedVocabularyEntry> = {}): SavedVocabularyEntry {
  return {
    id: "nl\u001fhuis\u001fen",
    text: "huis",
    normalizedText: "huis",
    sourceLanguage: "auto",
    detectedSourceLanguage: "nl",
    targetLanguage: "en",
    translatedText: "house",
    providerName: "test",
    createdAt: 1_000,
    updatedAt: 1_000,
    ...overrides,
  };
}

function card(overrides: Partial<ReviewCard> = {}): ReviewCard {
  return {
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
    ...overrides,
  };
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
