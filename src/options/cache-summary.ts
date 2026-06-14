export function getCachedWordCount(cacheValue: unknown): number {
  if (
    typeof cacheValue !== "object" ||
    cacheValue === null ||
    !("entries" in cacheValue) ||
    typeof cacheValue.entries !== "object" ||
    cacheValue.entries === null
  ) {
    return 0;
  }

  return Object.keys(cacheValue.entries).length;
}
