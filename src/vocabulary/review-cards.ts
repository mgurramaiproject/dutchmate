import {
  SavedVocabularyStore,
  normalizeSavedVocabularyText,
  type SavedVocabularyEntry,
  type SavedVocabularyStorage,
} from "./saved-vocabulary";

export const REVIEW_CARDS_STORAGE_KEY = "dutchmate.reviewCards.v1";
export const REVIEW_CARD_RECENT_LIMIT = 3;
const DAY_IN_MS = 24 * 60 * 60 * 1_000;

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

  async newQueue(): Promise<ReviewCard[]> {
    return getNewReviewQueue(await this.list());
  }

  async dueQueue(): Promise<ReviewCard[]> {
    return getDueReviewQueue(await this.list(), this.now());
  }

  async allQueue(): Promise<ReviewCard[]> {
    return getAllReviewQueue(await this.list());
  }

  async rate(id: string, rating: ReviewRating): Promise<ReviewCard> {
    const cards = await this.list();
    const card = cards.find((candidate) => candidate.id === id);

    if (!card) {
      throw new Error("Review card not found.");
    }

    const updatedCard = rateReviewCard(card, rating, this.now());
    await this.storage.set(
      REVIEW_CARDS_STORAGE_KEY,
      { cards: Object.fromEntries(cards.map((candidate) => [
        candidate.id,
        candidate.id === id ? updatedCard : candidate,
      ])) },
    );
    return updatedCard;
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

    if (card.pageContext === null && entry.pageContext) {
      card.pageContext = entry.pageContext.slice(0, 240);
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

export function getNewReviewQueue(cards: ReviewCard[]): ReviewCard[] {
  return cards
    .filter((card) => card.reviewCount === 0)
    .sort(compareByCreationTime);
}

export function getDueReviewQueue(cards: ReviewCard[], now = Date.now()): ReviewCard[] {
  return cards
    .filter((card) => card.reviewCount > 0 && card.dueAt !== null && card.dueAt <= now)
    .sort((first, second) => first.dueAt! - second.dueAt! || first.id.localeCompare(second.id));
}

export function getAllReviewQueue(cards: ReviewCard[]): ReviewCard[] {
  return [...cards].sort(compareByCreationTime);
}

function compareByCreationTime(first: ReviewCard, second: ReviewCard): number {
  return first.createdAt - second.createdAt || first.id.localeCompare(second.id);
}

export function rateReviewCard(card: ReviewCard, rating: ReviewRating, reviewedAt: number): ReviewCard {
  const intervalDays = rating === "good" ? 3 : rating === "easy" ? 7 : 1;

  return {
    ...card,
    updatedAt: reviewedAt,
    dueAt: reviewedAt + intervalDays * DAY_IN_MS,
    lastReviewedAt: reviewedAt,
    lastRating: rating,
    reviewCount: card.reviewCount + 1,
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
