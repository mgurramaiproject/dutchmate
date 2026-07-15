import type { ReviewCardSummary } from "../vocabulary/review-cards";
import {
  REVIEW_SUMMARY_MESSAGE,
  type ReviewMessageResponse,
  type ReviewSummaryMessage,
} from "../background/messages";

export type PopupRuntimeApi = {
  runtime: {
    sendMessage(message: ReviewSummaryMessage): Promise<ReviewMessageResponse>;
  };
};

export type ReviewSummaryClient = {
  getSummary(): Promise<ReviewCardSummary>;
};

export function createReviewSummaryClient(extensionApi: PopupRuntimeApi): ReviewSummaryClient {
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
