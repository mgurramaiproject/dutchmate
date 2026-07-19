export const PERSISTENT_TRANSLATION_CACHE_KEY = "dutchmate.translationCache.v1";

export type StorageChange = {
  oldValue?: unknown;
  newValue?: unknown;
};

export function shouldRefreshCacheCount(
  changes: Record<string, StorageChange>,
  areaName: string,
): boolean {
  if (areaName !== "local") {
    return false;
  }

  return PERSISTENT_TRANSLATION_CACHE_KEY in changes;
}
