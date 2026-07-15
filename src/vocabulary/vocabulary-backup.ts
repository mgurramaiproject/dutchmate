import type { ReviewCard, ReviewRating } from "./review-cards";
import { normalizeSavedVocabularyText } from "./saved-vocabulary";

export const VOCABULARY_BACKUP_FORMAT = "dutchmate-vocabulary-backup";
export const VOCABULARY_BACKUP_VERSION = 1;

export type VocabularyBackup = {
  format: typeof VOCABULARY_BACKUP_FORMAT;
  version: typeof VOCABULARY_BACKUP_VERSION;
  exportedAt: number;
  cards: ReviewCard[];
};

export function createVocabularyBackup(
  cards: ReviewCard[],
  exportedAt = Date.now(),
): VocabularyBackup {
  return {
    format: VOCABULARY_BACKUP_FORMAT,
    version: VOCABULARY_BACKUP_VERSION,
    exportedAt,
    cards: cards.map((card) => ({ ...card })),
  };
}

export function serializeVocabularyBackup(
  cards: ReviewCard[],
  exportedAt = Date.now(),
): string {
  return `${JSON.stringify(createVocabularyBackup(cards, exportedAt), null, 2)}\n`;
}

export function parseVocabularyBackup(input: string | unknown): VocabularyBackup {
  const value = typeof input === "string" ? parseJson(input) : input;

  if (!isRecord(value) || value.format !== VOCABULARY_BACKUP_FORMAT || value.version !== VOCABULARY_BACKUP_VERSION) {
    throw new Error("This vocabulary file is not a supported DutchMate backup.");
  }

  if (!isFiniteNumber(value.exportedAt) || !Array.isArray(value.cards)) {
    throw new Error("This vocabulary file is not a supported DutchMate backup.");
  }

  const cards = value.cards.map((card) => {
    if (!isReviewCard(card)) {
      throw new Error("This vocabulary file contains an invalid review card.");
    }
    return card;
  });

  return {
    format: VOCABULARY_BACKUP_FORMAT,
    version: VOCABULARY_BACKUP_VERSION,
    exportedAt: value.exportedAt,
    cards,
  };
}

function parseJson(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    throw new Error("This vocabulary file is not valid JSON.");
  }
}

function isReviewCard(value: unknown): value is ReviewCard {
  if (!isRecord(value)) {
    return false;
  }

  const dutch = value.dutch;
  const normalizedDutch = typeof dutch === "string" ? normalizeSavedVocabularyText(dutch) : "";
  return (
    typeof value.id === "string" && value.id === `nl\u001f${normalizedDutch}` &&
    normalizedDutch.length > 0 &&
    value.dutch === normalizedDutch &&
    isNullableString(value.english) &&
    isNullableString(value.telugu) &&
    isNullableString(value.pageContext) &&
    (value.pageContext === null || value.pageContext.length <= 240) &&
    isFiniteNumber(value.createdAt) &&
    isFiniteNumber(value.updatedAt) &&
    isNullableFiniteNumber(value.dueAt) &&
    isNullableFiniteNumber(value.lastReviewedAt) &&
    isNullableReviewRating(value.lastRating) &&
    isNonNegativeInteger(value.reviewCount)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableReviewRating(value: unknown): value is ReviewRating | null {
  return value === null || value === "again" || value === "hard" || value === "good" || value === "easy";
}
