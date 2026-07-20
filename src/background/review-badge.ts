export type ReviewBadgeProvider = {
  summary(): Promise<{ due: number }>;
};

export type ReviewBadgeExtensionApi = {
  action?: {
    setBadgeText(details: { text: string }, callback?: () => void): void | Promise<void>;
  };
};

export async function updateReviewBadge(
  extensionApi: ReviewBadgeExtensionApi | undefined,
  provider: ReviewBadgeProvider,
  enabled = true,
): Promise<void> {
  if (!extensionApi?.action) {
    return;
  }

  const { due } = await provider.summary();
  await Promise.resolve(
    extensionApi.action.setBadgeText({ text: enabled && due > 0 ? String(due) : "" }),
  );
}
