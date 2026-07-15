import type { ReviewCardSummary } from "../vocabulary/review-cards";
import type { ReviewMessage, ReviewMessageResponse } from "./messages";

export type ReviewSummaryProvider = {
  summary(): Promise<ReviewCardSummary>;
};

export async function handleReviewMessage(
  message: ReviewMessage,
  provider: ReviewSummaryProvider,
): Promise<ReviewMessageResponse> {
  try {
    return {
      ok: true,
      result: await provider.summary(),
    };
  } catch {
    return {
      ok: false,
      error: "Review summary is unavailable.",
    };
  }
}
