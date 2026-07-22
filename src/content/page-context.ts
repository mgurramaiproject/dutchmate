import { isSingleSavedVocabularyWord, normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";
import { normalizeMissionText } from "./mission-text";

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
  const block = parent?.closest("p, li, blockquote, figcaption, td, h1, h2, h3, h4, h5, h6");
  const container = block ?? parent?.closest("article, section, main") ?? parent;
  const pageText = container?.textContent ?? "";
  return getReliablePageContext(pageText, selectedText) ?? getPhrasePageContext(pageText, selectedText);
}

function getPhrasePageContext(pageText: string, selectedText: string): string | null {
  const page = normalizeMissionText(pageText);
  const selection = normalizeMissionText(selectedText);
  const words = selection.match(/[\p{Letter}\p{Number}][\p{Letter}\p{Number}'’-]*/gu) ?? [];
  if (words.length < 2 || !page.includes(selection)) return null;

  const index = page.indexOf(selection);
  const sentenceStart = Math.max(page.lastIndexOf(".", index), page.lastIndexOf("!", index), page.lastIndexOf("?", index)) + 1;
  const afterSelection = index + selection.length;
  const sentenceEnds = [page.indexOf(".", afterSelection), page.indexOf("!", afterSelection), page.indexOf("?", afterSelection)].filter((end) => end >= 0);
  const sentenceEnd = sentenceEnds.length > 0 ? Math.min(...sentenceEnds) + 1 : page.length;
  const context = page.slice(sentenceStart, sentenceEnd).trim();
  return context.length <= MAX_PAGE_CONTEXT_LENGTH ? context : selection;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
