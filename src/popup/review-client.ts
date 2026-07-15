import type { ReviewCard, ReviewCardSummary, ReviewRating } from "../vocabulary/review-cards";
import {
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
  type ReviewMessage,
  type ReviewMessageResponse,
} from "../background/messages";

export type PopupRuntimeApi = {
  runtime: {
    sendMessage(message: ReviewMessage): Promise<ReviewMessageResponse>;
  };
};

export type ReviewClient = {
  getSummary(): Promise<ReviewCardSummary>;
  getNewQueue(): Promise<ReviewCard[]>;
  rateCard(id: string, rating: ReviewRating): Promise<ReviewCard>;
};

export function createReviewClient(extensionApi: PopupRuntimeApi): ReviewClient {
  return {
    async getSummary() {
      const response = await extensionApi.runtime.sendMessage({
        type: REVIEW_SUMMARY_MESSAGE,
      });

      if (isReviewSummaryResponse(response)) {
        return response.result;
      }

      if (isErrorResponse(response)) {
        throw new Error(response.error);
      }

      throw new Error("Review summary is unavailable.");
    },
    async getNewQueue() {
      const response = await extensionApi.runtime.sendMessage({
        type: REVIEW_NEW_QUEUE_MESSAGE,
      });

      if (isNewQueueResponse(response)) {
        return response.result.cards;
      }

      throw new Error(getReviewError(response, "New-word practice is unavailable."));
    },
    async rateCard(id, rating) {
      const response = await extensionApi.runtime.sendMessage({
        type: REVIEW_RATE_MESSAGE,
        payload: { id, rating },
      });

      if (isRatedCardResponse(response)) {
        return response.result.card;
      }

      throw new Error(getReviewError(response, "Your rating could not be saved."));
    },
  };
}

function isReviewSummaryResponse(response: unknown): response is {
  ok: true;
  result: ReviewCardSummary;
} {
  if (
    typeof response !== "object" ||
    response === null ||
    !("ok" in response) ||
    response.ok !== true ||
    !("result" in response) ||
    typeof response.result !== "object" ||
    response.result === null
  ) {
    return false;
  }

  const result = response.result as Record<string, unknown>;
  return (
    typeof result.total === "number" &&
    typeof result.due === "number" &&
    typeof result.new === "number" &&
    Array.isArray(result.recent)
  );
}

function isErrorResponse(response: unknown): response is { ok: false; error: string } {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === false &&
    "error" in response &&
    typeof response.error === "string"
  );
}

function isNewQueueResponse(response: unknown): response is { ok: true; result: { cards: ReviewCard[] } } {
  return isSuccessfulResponse(response) && "cards" in response.result && Array.isArray(response.result.cards);
}

function isRatedCardResponse(response: unknown): response is { ok: true; result: { card: ReviewCard } } {
  return isSuccessfulResponse(response) && "card" in response.result && typeof response.result.card === "object";
}

function isSuccessfulResponse(response: unknown): response is {
  ok: true;
  result: Record<string, unknown>;
} {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null
  );
}

function getReviewError(response: unknown, fallback: string): string {
  return isErrorResponse(response) ? response.error : fallback;
}
