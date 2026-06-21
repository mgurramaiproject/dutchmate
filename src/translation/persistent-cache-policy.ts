import type { TranslationRequest } from "./provider";

const DEFAULT_MAX_PERSISTED_WORD_LENGTH = 30;
const singleWordPattern = /^[\p{Letter}\p{Number}'-]+$/u;

export type PersistentCachePolicyOptions = {
  cacheHoveredWords?: boolean;
};

export function shouldPersistTranslation(
  request: TranslationRequest,
  maxWordLength = DEFAULT_MAX_PERSISTED_WORD_LENGTH,
  options: PersistentCachePolicyOptions = {},
): boolean {
  if (request.context !== "selection" && !(options.cacheHoveredWords && request.context === "hover")) {
    return false;
  }

  const text = normalizeCacheText(request.text);

  return (
    text.length > 0 &&
    text.length <= maxWordLength &&
    singleWordPattern.test(text)
  );
}

export function normalizeCacheText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
