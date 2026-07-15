import {
  SavedVocabularyStore,
  normalizeSavedVocabularyText,
  type SavedVocabularyEntry,
  type SavedVocabularyStorage,
} from "./saved-vocabulary";

export const REVIEW_CARDS_STORAGE_KEY = "dutchmate.reviewCards.v1";
export const REVIEW_CARD_RECENT_LIMIT = 3;

export type ReviewRating = "again" | "hard" | "good" | "easy";

export type ReviewCard = {
  id: string;
  dutch: string;
  english: string | null;
  telugu: string | null;
  pageContext: string | null;
  createdAt: number;
  updatedAt: number;
  dueAt: number | null;
  lastReviewedAt: number | null;
  lastRating: ReviewRating | null;
  reviewCount: number;
};

export type ReviewCardSummary = {
  total: number;
  due: number;
  new: number;
  recent: ReviewCard[];
};

export class ReviewCardStore {
  constructor(
    private readonly savedVocabulary: SavedVocabularyStore,
    private readonly storage: SavedVocabularyStorage,
    private readonly now: () => number = Date.now,
  ) {}

  async list(): Promise<ReviewCard[]> {
    const previousCards = parseReviewCardData(await this.storage.get(REVIEW_CARDS_STORAGE_KEY));
    const cards = migrateSavedVocabulary(
      await this.savedVocabulary.list(),
      Object.values(previousCards),
    );

    await this.storage.set(
      REVIEW_CARDS_STORAGE_KEY,
      { cards: Object.fromEntries(cards.map((card) => [card.id, card])) },
    );

    return cards;
  }

  async summary(): Promise<ReviewCardSummary> {
    return getReviewCardSummary(await this.list(), this.now());
  }
}

export function migrateSavedVocabulary(
  entries: SavedVocabularyEntry[],
  existingCards: ReviewCard[] = [],
): ReviewCard[] {
  const existingById = new Map(existingCards.map((card) => [card.id, card]));
  const cards = new Map<string, ReviewCard>();

  for (const entry of entries) {
    if (!isDutchLearningEntry(entry)) {
      continue;
    }

    const id = getReviewCardId(entry.text);
    const card = cards.get(id) ?? createReviewCard(entry, existingById.get(id));

    card.createdAt = Math.min(card.createdAt, entry.createdAt);
    card.updatedAt = Math.max(card.updatedAt, entry.updatedAt);

    if (entry.targetLanguage === "en" && card.english === null) {
      card.english = entry.translatedText;
    }

    if (entry.targetLanguage === "te" && card.telugu === null) {
      card.telugu = entry.translatedText;
    }

    cards.set(id, card);
  }

  return [...cards.values()].sort((first, second) => second.createdAt - first.createdAt);
}

export function getReviewCardId(dutch: string): string {
  return `nl\u001f${normalizeSavedVocabularyText(dutch)}`;
}

export function getReviewCardSummary(
  cards: ReviewCard[],
  now = Date.now(),
  recentLimit = REVIEW_CARD_RECENT_LIMIT,
): ReviewCardSummary {
  return {
    total: cards.length,
    due: cards.filter(
      (card) => card.reviewCount > 0 && card.dueAt !== null && card.dueAt <= now,
    ).length,
    new: cards.filter((card) => card.reviewCount === 0).length,
    recent: [...cards]
      .sort((first, second) => second.createdAt - first.createdAt)
      .slice(0, recentLimit),
  };
}

function createReviewCard(entry: SavedVocabularyEntry, existing?: ReviewCard): ReviewCard {
  return (
    existing ?? {
      id: getReviewCardId(entry.text),
      dutch: normalizeSavedVocabularyText(entry.text),
      english: null,
      telugu: null,
      pageContext: null,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      dueAt: null,
      lastReviewedAt: null,
      lastRating: null,
      reviewCount: 0,
    }
  );
}

function isDutchLearningEntry(entry: SavedVocabularyEntry): boolean {
  const sourceLanguage = entry.detectedSourceLanguage ?? entry.sourceLanguage;
  return sourceLanguage === "nl" &&
    (entry.targetLanguage === "en" || entry.targetLanguage === "te");
}

function parseReviewCardData(value: unknown): Record<string, ReviewCard> {
  if (
    typeof value === "object" &&
    value !== null &&
    "cards" in value &&
    typeof value.cards === "object" &&
    value.cards !== null
  ) {
    return value.cards as Record<string, ReviewCard>;
  }

  return {};
}
