import type { ReviewCard, ReviewCardSummary, ReviewRating } from "../vocabulary/review-cards";
import {
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
  type ReviewMessage,
  type ReviewMessageResponse,
} from "./messages";

export type ReviewProvider = {
  summary(): Promise<ReviewCardSummary>;
  newQueue?(): Promise<ReviewCard[]>;
  rate?(id: string, rating: ReviewRating): Promise<ReviewCard>;
};

export async function handleReviewMessage(
  message: ReviewMessage,
  provider: ReviewProvider,
): Promise<ReviewMessageResponse> {
  try {
    if (message.type === REVIEW_NEW_QUEUE_MESSAGE && provider.newQueue) {
      return { ok: true, result: { cards: await provider.newQueue() } };
    }

    if (message.type === REVIEW_RATE_MESSAGE && provider.rate) {
      return { ok: true, result: { card: await provider.rate(message.payload.id, message.payload.rating) } };
    }

    if (message.type === REVIEW_SUMMARY_MESSAGE) {
      return { ok: true, result: await provider.summary() };
    }

    throw new Error("Unsupported review message.");
  } catch {
    return {
      ok: false,
      error:
        message.type === REVIEW_SUMMARY_MESSAGE
          ? "Review summary is unavailable."
          : message.type === REVIEW_NEW_QUEUE_MESSAGE
            ? "New-word practice is unavailable."
            : "Your rating could not be saved.",
    };
  }
}
