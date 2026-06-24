import { isPointInsideVisibleBox } from "./pointer-hit-box";
import { isValidTextRangeBoundary } from "./text-range-boundary";
import type { MvpLanguageCode } from "../shared/languages";
import type { HoverTranslationMode } from "../shared/settings";

const MIN_TEXT_LENGTH = 1;
const MAX_HOVER_WORD_LENGTH = 30;
const MAX_HOVER_CONTEXT_LENGTH = 180;
const supportedTargetLanguages = new Set(["en", "nl", "te"]);

export type HoverLookupInput = {
  text: string;
  x: number;
  y: number;
  start: number;
  end: number;
  sourceLanguageHint?: MvpLanguageCode;
  languageSample: string;
};

export type SelectionLookupInput =
  | { status: "none" }
  | { status: "too-long"; text: string; x: number; y: number }
  | {
      status: "ready";
      text: string;
      x: number;
      y: number;
      sourceLanguageHint?: MvpLanguageCode;
      languageSample: string;
    };

export function getHoverLookupInput(
  clientX: number,
  clientY: number,
  hoverTranslationMode: HoverTranslationMode,
): HoverLookupInput | null {
  const range = getRangeAtPoint(clientX, clientY);
  const text = range?.startContainer.textContent;

  if (!range || !text) {
    return null;
  }

  const textNode = range.startContainer;
  const offset = range.startOffset;
  const match = getWordBounds(text, offset);

  if (!match || !isValidTextRangeBoundary(textNode, text, match.start, match.end)) {
    return null;
  }

  const wordRange = document.createRange();
  wordRange.setStart(textNode, match.start);
  wordRange.setEnd(textNode, match.end);

  const rect = wordRange.getBoundingClientRect();
  if (!isPointInsideVisibleBox(clientX, clientY, rect)) {
    return null;
  }

  return {
    text: hoverTranslationMode === "word" ? match.word : getHoverTranslationText(text, match.start, match.end),
    x: rect.left,
    y: rect.bottom,
    start: match.start,
    end: match.end,
    sourceLanguageHint: getLanguageHintForNode(textNode),
    languageSample: text,
  };
}

export function getSelectionLookupInput(maxSelectionLength: number): SelectionLookupInput {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() ?? "";

  if (!selection || selectedText.length < MIN_TEXT_LENGTH || selection.rangeCount === 0) {
    return { status: "none" };
  }

  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (selectedText.length > maxSelectionLength) {
    return {
      status: "too-long",
      text: selectedText,
      x: rect.left,
      y: rect.bottom,
    };
  }

  return {
    status: "ready",
    text: selectedText,
    x: rect.left,
    y: rect.bottom,
    sourceLanguageHint: getLanguageHintForNode(selection.anchorNode),
    languageSample: selectedText,
  };
}

function getRangeAtPoint(clientX: number, clientY: number): Range | null {
  const documentWithCaretRange = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };

  if (documentWithCaretRange.caretRangeFromPoint) {
    return documentWithCaretRange.caretRangeFromPoint(clientX, clientY);
  }

  const documentWithCaretPosition = document as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };
  const position = documentWithCaretPosition.caretPositionFromPoint?.(clientX, clientY);
  if (!position) {
    return null;
  }

  const range = document.createRange();
  range.setStart(position.offsetNode, position.offset);
  range.collapse(true);
  return range;
}

function getWordBounds(text: string, offset: number): { word: string; start: number; end: number } | null {
  const wordPattern = /[\p{Letter}\p{Number}'-]+/gu;

  for (const match of text.matchAll(wordPattern)) {
    const word = match[0];
    const start = match.index ?? 0;
    const end = start + word.length;

    if (offset >= start && offset <= end && word.length <= MAX_HOVER_WORD_LENGTH) {
      return { word, start, end };
    }
  }

  return null;
}

function getHoverTranslationText(text: string, start: number, end: number): string {
  const sentenceContext = getSentenceContext(text, start, end);

  if (sentenceContext.length <= MAX_HOVER_CONTEXT_LENGTH) {
    return sentenceContext;
  }

  return getWindowContext(text, start, end);
}

function getSentenceContext(text: string, start: number, end: number): string {
  let contextStart = start;
  let contextEnd = end;

  while (contextStart > 0 && !isSentenceBoundary(text[contextStart - 1])) {
    contextStart -= 1;
  }

  while (contextEnd < text.length && !isSentenceBoundary(text[contextEnd])) {
    contextEnd += 1;
  }

  return normalizeWhitespace(text.slice(contextStart, contextEnd));
}

function getWindowContext(text: string, start: number, end: number): string {
  const hoveredLength = end - start;
  const sideBudget = Math.max(0, Math.floor((MAX_HOVER_CONTEXT_LENGTH - hoveredLength) / 2));
  const contextStart = Math.max(0, start - sideBudget);
  const contextEnd = Math.min(text.length, end + sideBudget);

  return normalizeWhitespace(text.slice(contextStart, contextEnd));
}

function isSentenceBoundary(character: string): boolean {
  return /[.!?。！？\n]/u.test(character);
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function getLanguageHintForNode(node: Node | null): MvpLanguageCode | undefined {
  const element =
    node instanceof Element
      ? node
      : node?.parentElement;
  const language =
    normalizeLanguageCode(element?.closest("[lang]")?.getAttribute("lang")) ??
    normalizeLanguageCode(document.documentElement.lang);

  return language;
}

function normalizeLanguageCode(value: string | null | undefined): MvpLanguageCode | undefined {
  const languageCode = value?.trim().toLowerCase().split("-")[0];

  return languageCode && supportedTargetLanguages.has(languageCode)
    ? (languageCode as MvpLanguageCode)
    : undefined;
}
