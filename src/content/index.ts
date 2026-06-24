import { getHoverRequestKey } from "./hover-request-key";
import { isPointInsideVisibleBox } from "./pointer-hit-box";
import { type RuntimeTranslationExtensionApi } from "./runtime-translation-client";
import { withTooltipTranslationTimeout } from "./tooltip-translation-timeout";
import { getSelectionTooLongMessage } from "./selection-limit-message";
import { isValidTextRangeBoundary } from "./text-range-boundary";
import {
  WebpageLookupModule,
  type WebpageLookupModuleEvent,
} from "./webpage-lookup-module";
import { createRuntimeLookupAdapter } from "./runtime-lookup-adapter";
import { createTooltipViewAdapter } from "./tooltip-view-adapter";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import {
  defaultSettings,
  mergeSettings,
  normalizeSettings,
  SELECTION_LENGTH_LIMITS,
  type ExtensionSettings,
  type HoverTranslationMode,
} from "../shared/settings";

const MIN_TEXT_LENGTH = 1;
const MAX_HOVER_WORD_LENGTH = 30;
const MAX_HOVER_CONTEXT_LENGTH = 180;
const TOOLTIP_TRANSLATION_TIMEOUT_MS = 9000;
const CHROME_DIRECT_TRANSLATION_FALLBACK_MS = 1200;
const DIRECT_TRANSLATION_TIMEOUT_MS = 15000;
const supportedTargetLanguages = new Set(["en", "nl", "te"]);
const supportedSourceLanguages = new Set(["auto", "en", "nl", "te"]);

type StorageChange = {
  newValue?: unknown;
};

type TranslationContext = "hover" | "selection";

type ExtensionStorageApi = {
  storage: {
    local: {
      get(keys: string | string[], callback: (items: Record<string, unknown>) => void): void;
      set(items: Record<string, unknown>, callback?: () => void): void;
    };
    sync: {
      get(defaults: ExtensionSettings, callback: (settings: Partial<ExtensionSettings>) => void): void;
    };
    onChanged: {
      addListener(
        callback: (changes: Record<string, StorageChange>, areaName: string) => void,
      ): void;
    };
  };
  runtime: RuntimeTranslationExtensionApi["runtime"];
};

const extensionGlobal = globalThis as typeof globalThis & {
  browser?: ExtensionStorageApi;
  chrome?: ExtensionStorageApi;
};
const extensionApi = extensionGlobal.chrome ?? extensionGlobal.browser;

let hoverTimer: number | undefined;
let lastHoverKey = "";
let activeSelectionText = "";
let currentSettings = defaultSettings;
const lookupModule = new WebpageLookupModule({
  getSettings: () => currentSettings,
  transport: createRuntimeLookupAdapter({
    browserTarget: __BROWSER_TARGET__,
    chromeDirectTranslationFallbackMs: CHROME_DIRECT_TRANSLATION_FALLBACK_MS,
    directTranslationTimeoutMs: DIRECT_TRANSLATION_TIMEOUT_MS,
    extensionApi,
    getSettings: () => currentSettings,
    delay,
  }),
  runWithTimeout: withTooltipTranslationTimeout,
  tooltipTimeoutMs: TOOLTIP_TRANSLATION_TIMEOUT_MS,
});
const tooltipView = createTooltipViewAdapter(() => {
  void lookupModule.handleSaveAction();
});

document.addEventListener("mousemove", handleMouseMove, { passive: true });
document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
document.addEventListener("mouseup", handleSelection, { passive: true });
document.addEventListener("scroll", clearSelectionAndHideTooltip, { passive: true });
document.addEventListener("click", handlePageClick, { passive: true });
document.addEventListener("keydown", handleKeyDown);
extensionApi?.storage.onChanged.addListener(handleStorageChanged);
lookupModule.subscribe(handleLookupModuleEvent);

void refreshSettings();

function handleMouseMove(event: MouseEvent): void {
  if (isTooltipEvent(event)) {
    return;
  }

  window.clearTimeout(hoverTimer);

  if (!currentSettings.isEnabled || !currentSettings.translateOnHover) {
    lookupModule.clear();
    return;
  }

  hoverTimer = window.setTimeout(() => {
    if (hasActiveSelection()) {
      return;
    }

    const hit = getWordAtPoint(event.clientX, event.clientY);

    if (!hit) {
      lookupModule.clear();
      return;
    }

    const hoverText = getHoverTextForSettings(hit);
    const hoverKey = getHoverRequestKey({
      text: hoverText,
      languageSample: hit.languageSample,
      sourceLanguageHint: hit.sourceLanguageHint,
      start: hit.start,
      end: hit.end,
    });
    if (hoverKey === lastHoverKey) {
      return;
    }

    lastHoverKey = hoverKey;
    showTranslation(
      hoverText,
      "hover",
      hit.x,
      hit.y,
      hit.sourceLanguageHint,
      hit.languageSample,
    );
  }, currentSettings.hoverDelayMs);
}

function handleSelection(event: MouseEvent): void {
  if (isTooltipEvent(event)) {
    return;
  }

  window.clearTimeout(hoverTimer);

  if (!currentSettings.isEnabled || !currentSettings.translateOnSelection) {
    return;
  }

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() ?? "";

  if (
    !selection ||
    selectedText.length < MIN_TEXT_LENGTH ||
    selection.rangeCount === 0
  ) {
    return;
  }

  const rect = selection.getRangeAt(0).getBoundingClientRect();

  if (selectedText.length > currentSettings.maxSelectionLength) {
    activeSelectionText = selectedText;
    tooltipView.showError(getSelectionTooLongMessage(currentSettings.maxSelectionLength), rect.left, rect.bottom);
    return;
  }

  activeSelectionText = selectedText;
  showTranslation(
    selectedText,
    "selection",
    rect.left,
    rect.bottom,
    getLanguageHintForNode(selection.anchorNode),
    selectedText,
  );
}

async function showTranslation(
  text: string,
  context: TranslationContext,
  x: number,
  y: number,
  sourceLanguageHint?: MvpLanguageCode,
  languageSample = text,
): Promise<void> {
  await lookupModule.beginLookup({
    text,
    context,
    x,
    y,
    sourceLanguageHint,
    languageSample,
  });
}

function handleLookupModuleEvent(event: WebpageLookupModuleEvent): void {
  if (event.type === "render-loading") {
    tooltipView.showLoading(event.message, event.x, event.y);
    return;
  }

  if (event.type === "render-error") {
    tooltipView.showError(event.message, event.x, event.y);
    return;
  }

  if (event.type === "render-result") {
    tooltipView.showResult(event.response, event.x, event.y, event.saveAction);
    return;
  }

  if (event.type === "save-state-changed") {
    tooltipView.updateSaveButton(event.saveAction);
    return;
  }

  hideTooltip();
}

function hideTooltip(): void {
  tooltipView.hide();
  lastHoverKey = "";
}

function clearSelectionAndHideTooltip(): void {
  activeSelectionText = "";
  lookupModule.clear();
}

function handlePageClick(event: MouseEvent): void {
  if (isTooltipEvent(event)) {
    return;
  }

  if (hasActiveSelection()) {
    return;
  }

  clearSelectionAndHideTooltip();
}

function handleMouseLeave(): void {
  if (lookupModule.shouldKeepVisibleOnMouseLeave()) {
    return;
  }

  lookupModule.clear();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    clearSelectionAndHideTooltip();
  }
}

function isTooltipEvent(event: Event): boolean {
  return tooltipView.isTooltipEvent(event);
}

function hasActiveSelection(): boolean {
  const selectedText = window.getSelection()?.toString().trim() ?? "";

  if (!selectedText) {
    activeSelectionText = "";
    return false;
  }

  return selectedText === activeSelectionText || lookupModule.hasActiveSelectionControl();
}

function getHoverTextForSettings(hit: { word: string; translationText: string }): string {
  return currentSettings.hoverTranslationMode === "word" ? hit.word : hit.translationText;
}

function getWordAtPoint(
  clientX: number,
  clientY: number,
): {
  word: string;
  translationText: string;
  x: number;
  y: number;
  start: number;
  end: number;
  sourceLanguageHint?: MvpLanguageCode;
  languageSample: string;
} | null {
  const range = getRangeAtPoint(clientX, clientY);

  const text = range?.startContainer.textContent;

  if (!range || !text) {
    return null;
  }

  const textNode = range.startContainer;
  const offset = range.startOffset;

  const match = getWordBounds(text, offset);
  if (!match) {
    return null;
  }

  if (!isValidTextRangeBoundary(textNode, text, match.start, match.end)) {
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
    word: match.word,
    translationText: getHoverTranslationText(text, match.start, match.end),
    x: rect.left,
    y: rect.bottom,
    start: match.start,
    end: match.end,
    sourceLanguageHint: getLanguageHintForNode(textNode),
    languageSample: text,
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

async function refreshSettings(): Promise<void> {
  currentSettings = await readSettings();
}

function handleStorageChanged(changes: Record<string, StorageChange>, areaName: string): void {
  lookupModule.handleStorageChanged(changes, areaName);

  if (areaName !== "sync") {
    return;
  }

  currentSettings = mergeSettings(currentSettings, settingChangesToPartialSettings(changes));
  lookupModule.applySettings();

  if (!currentSettings.isEnabled) {
    hideTooltip();
  }
}

function settingChangesToPartialSettings(
  changes: Record<string, StorageChange>,
): Partial<ExtensionSettings> {
  return {
    isEnabled: getOptionalBooleanSetting(changes.isEnabled?.newValue),
    translateOnHover: getOptionalBooleanSetting(changes.translateOnHover?.newValue),
    translateOnSelection: getOptionalBooleanSetting(changes.translateOnSelection?.newValue),
    cacheHoveredWords: getOptionalBooleanSetting(changes.cacheHoveredWords?.newValue),
    hoverTranslationMode: getOptionalHoverTranslationModeSetting(
      changes.hoverTranslationMode?.newValue,
    ),
    hoverDelayMs: getOptionalNumberSetting(changes.hoverDelayMs?.newValue),
    maxSelectionLength: getOptionalSelectionLengthSetting(changes.maxSelectionLength?.newValue),
    sourceLanguage: getOptionalSourceLanguageSetting(changes.sourceLanguage?.newValue),
    targetLanguage: getOptionalTargetLanguageSetting(changes.targetLanguage?.newValue),
    translateToOtherMvpLanguages: getOptionalBooleanSetting(
      changes.translateToOtherMvpLanguages?.newValue,
    ),
    learningLanguage: getOptionalTargetLanguageSetting(changes.learningLanguage?.newValue),
    nativeLanguage: getOptionalTargetLanguageSetting(changes.nativeLanguage?.newValue),
    bridgeLanguage: getOptionalTargetLanguageSetting(changes.bridgeLanguage?.newValue),
    providerEndpoint: getOptionalStringSetting(changes.providerEndpoint?.newValue),
    providerApiKey: getOptionalStringSetting(changes.providerApiKey?.newValue),
  };
}

async function readSettings(): Promise<ExtensionSettings> {
  if (!extensionApi) {
    return defaultSettings;
  }

  return new Promise((resolve) => {
    extensionApi.storage.sync.get(defaultSettings, (stored) => {
      if (extensionApi.runtime.lastError) {
        resolve(defaultSettings);
        return;
      }

      resolve(normalizeSettings(stored, defaultSettings));
    });
  });
}

function getOptionalHoverTranslationModeSetting(value: unknown): HoverTranslationMode | undefined {
  return value === "word" || value === "sentence" ? value : undefined;
}

function getOptionalStringSetting(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getOptionalTargetLanguageSetting(value: unknown): MvpLanguageCode | undefined {
  return typeof value === "string" && supportedTargetLanguages.has(value)
    ? (value as MvpLanguageCode)
    : undefined;
}

function getOptionalSourceLanguageSetting(value: unknown): SourceLanguageCode | undefined {
  return typeof value === "string" && supportedSourceLanguages.has(value)
    ? (value as SourceLanguageCode)
    : undefined;
}

function getOptionalBooleanSetting(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function getOptionalNumberSetting(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getOptionalSelectionLengthSetting(value: unknown): number | undefined {
  const numberValue = getOptionalNumberSetting(value);

  if (numberValue === undefined) {
    return undefined;
  }

  return Math.min(
    Math.max(numberValue, SELECTION_LENGTH_LIMITS.min),
    SELECTION_LENGTH_LIMITS.max,
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
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
