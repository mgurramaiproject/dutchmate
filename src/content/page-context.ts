import { isSingleSavedVocabularyWord, normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";

export const MAX_PAGE_CONTEXT_LENGTH = 240;

export function getReliablePageContext(pageText: string, selectedText: string): string | null {
  const word = normalizeSavedVocabularyText(selectedText);
  if (!isSingleSavedVocabularyWord(word)) {
    return null;
  }

  const sentences = pageText.match(/[^.!?。！？\n]+[.!?。！？]+/gu) ?? [];
  const wordPattern = new RegExp(`(?:^|[^\\p{Letter}\\p{Number}])${escapeRegExp(word)}(?:$|[^\\p{Letter}\\p{Number}])`, "iu");
  const sentence = sentences
    .map((candidate) => candidate.replace(/\s+/g, " ").trim())
    .find((candidate) => wordPattern.test(candidate));

  if (!sentence) {
    return null;
  }

  if (sentence.length <= MAX_PAGE_CONTEXT_LENGTH) {
    return sentence;
  }

  const wordStart = sentence.toLocaleLowerCase().indexOf(word.toLocaleLowerCase());
  const start = Math.min(
    Math.max(0, wordStart - Math.floor((MAX_PAGE_CONTEXT_LENGTH - word.length) / 2)),
    sentence.length - MAX_PAGE_CONTEXT_LENGTH,
  );
  return sentence.slice(start, start + MAX_PAGE_CONTEXT_LENGTH).trim();
}

export function getSelectionPageContext(
  selection: Pick<Selection, "anchorNode">,
  selectedText: string,
): string | null {
  const parent = selection.anchorNode?.parentElement;
  const container = parent?.closest("p, li, blockquote, figcaption, td, article, section, main") ?? parent;
  return getReliablePageContext(container?.textContent ?? "", selectedText);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
