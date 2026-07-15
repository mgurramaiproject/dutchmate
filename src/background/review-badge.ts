import type { ReviewCardSummary } from "../vocabulary/review-cards";

export type ReviewBadgeProvider = {
  summary(): Promise<ReviewCardSummary>;
};

export type ReviewBadgeExtensionApi = {
  action?: {
    setBadgeText(details: { text: string }, callback?: () => void): void | Promise<void>;
  };
};

export async function updateReviewBadge(
  extensionApi: ReviewBadgeExtensionApi | undefined,
  provider: ReviewBadgeProvider,
): Promise<void> {
  if (!extensionApi?.action) {
    return;
  }

  const { due } = await provider.summary();
  await Promise.resolve(extensionApi.action.setBadgeText({ text: due > 0 ? String(due) : "" }));
}
