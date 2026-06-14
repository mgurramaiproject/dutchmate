export function getCachedWordCount(cacheValue: unknown): number {
  const entries = getCacheEntries(cacheValue);

  if (!entries) {
    return 0;
  }

  const words = new Set<string>();

  for (const entry of Object.values(entries)) {
    const word = getEntryWord(entry);

    if (word) {
      words.add(word);
    }
  }

  return words.size;
}

function getCacheEntries(cacheValue: unknown): Record<string, unknown> | null {
  if (
    typeof cacheValue !== "object" ||
    cacheValue === null ||
    !("entries" in cacheValue) ||
    typeof cacheValue.entries !== "object" ||
    cacheValue.entries === null
  ) {
    return null;
  }

  return cacheValue.entries as Record<string, unknown>;
}

function getEntryWord(entry: unknown): string | null {
  if (
    typeof entry !== "object" ||
    entry === null ||
    !("request" in entry) ||
    typeof entry.request !== "object" ||
    entry.request === null ||
    !("text" in entry.request) ||
    typeof entry.request.text !== "string"
  ) {
    return null;
  }

  const word = entry.request.text.trim().toLowerCase();
  return word || null;
}
