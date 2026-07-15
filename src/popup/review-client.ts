import type { ReviewCard, ReviewCardSummary, ReviewRating } from "../vocabulary/review-cards";
import {
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_DUE_QUEUE_MESSAGE,
  REVIEW_ALL_QUEUE_MESSAGE,
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
  getDueQueue(): Promise<ReviewCard[]>;
  getAllQueue(): Promise<ReviewCard[]>;
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
      return getQueue(extensionApi, REVIEW_NEW_QUEUE_MESSAGE, "New-word practice is unavailable.");
    },
    async getDueQueue() {
      return getQueue(extensionApi, REVIEW_DUE_QUEUE_MESSAGE, "Due-word review is unavailable.");
    },
    async getAllQueue() {
      return getQueue(extensionApi, REVIEW_ALL_QUEUE_MESSAGE, "All-word review is unavailable.");
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

async function getQueue(
  extensionApi: PopupRuntimeApi,
  type: typeof REVIEW_NEW_QUEUE_MESSAGE | typeof REVIEW_DUE_QUEUE_MESSAGE | typeof REVIEW_ALL_QUEUE_MESSAGE,
  fallback: string,
): Promise<ReviewCard[]> {
  const response = await extensionApi.runtime.sendMessage({ type });

  if (isReviewQueueResponse(response)) {
    return response.result.cards;
  }

  throw new Error(getReviewError(response, fallback));
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

function isReviewQueueResponse(response: unknown): response is { ok: true; result: { cards: ReviewCard[] } } {
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
