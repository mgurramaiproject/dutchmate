import type { ReviewCard, ReviewCardSummary, ReviewRating } from "../vocabulary/review-cards";
import {
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_DUE_QUEUE_MESSAGE,
  REVIEW_ALL_QUEUE_MESSAGE,
  REVIEW_CLEAR_MESSAGE,
  REVIEW_EXPORT_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
  type ReviewMessage,
  type ReviewMessageResponse,
} from "./messages";
import { parseVocabularyBackup, type VocabularyBackup } from "../vocabulary/vocabulary-backup";

export type ReviewProvider = {
  summary(): Promise<ReviewCardSummary>;
  newQueue?(): Promise<ReviewCard[]>;
  dueQueue?(): Promise<ReviewCard[]>;
  allQueue?(): Promise<ReviewCard[]>;
  rate?(id: string, rating: ReviewRating): Promise<ReviewCard>;
  exportBackup?(): Promise<VocabularyBackup>;
  importBackup?(backup: VocabularyBackup): Promise<ReviewCard[]>;
  clear?(): Promise<void>;
};

export async function handleReviewMessage(
  message: ReviewMessage,
  provider: ReviewProvider,
): Promise<ReviewMessageResponse> {
  try {
    if (message.type === REVIEW_EXPORT_MESSAGE && provider.exportBackup) {
      return { ok: true, result: { backup: await provider.exportBackup() } };
    }

    if (message.type === REVIEW_IMPORT_MESSAGE && provider.importBackup) {
      const backup = parseVocabularyBackup(message.payload.document);
      return { ok: true, result: { cards: await provider.importBackup(backup) } };
    }

    if (message.type === REVIEW_CLEAR_MESSAGE && provider.clear) {
      await provider.clear();
      return { ok: true, result: { cleared: true } };
    }

    if (message.type === REVIEW_NEW_QUEUE_MESSAGE && provider.newQueue) {
      return { ok: true, result: { cards: await provider.newQueue() } };
    }

    if (message.type === REVIEW_DUE_QUEUE_MESSAGE && provider.dueQueue) {
      return { ok: true, result: { cards: await provider.dueQueue() } };
    }

    if (message.type === REVIEW_ALL_QUEUE_MESSAGE && provider.allQueue) {
      return { ok: true, result: { cards: await provider.allQueue() } };
    }

    if (message.type === REVIEW_RATE_MESSAGE && provider.rate) {
      return { ok: true, result: { card: await provider.rate(message.payload.id, message.payload.rating) } };
    }

    if (message.type === REVIEW_SUMMARY_MESSAGE) {
      return { ok: true, result: await provider.summary() };
    }

    throw new Error("Unsupported review message.");
  } catch (error) {
    return {
      ok: false,
      error: getReviewMessageError(message, error),
    };
  }
}

function getReviewMessageError(message: ReviewMessage, error: unknown): string {
  switch (message.type) {
    case REVIEW_SUMMARY_MESSAGE:
      return "Review summary is unavailable.";
    case REVIEW_NEW_QUEUE_MESSAGE:
      return "New-word practice is unavailable.";
    case REVIEW_DUE_QUEUE_MESSAGE:
      return "Due-word review is unavailable.";
    case REVIEW_ALL_QUEUE_MESSAGE:
      return "All-word review is unavailable.";
    case REVIEW_EXPORT_MESSAGE:
      return "Vocabulary export is unavailable.";
    case REVIEW_IMPORT_MESSAGE:
      return error instanceof Error ? error.message : "Vocabulary import failed.";
    case REVIEW_CLEAR_MESSAGE:
      return "Vocabulary could not be cleared.";
    case REVIEW_RATE_MESSAGE:
      return "Your rating could not be saved.";
  }
}
