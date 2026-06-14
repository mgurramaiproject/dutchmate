import { getHoverRequestKey } from "./hover-request-key";
import { getSelectionTooLongMessage } from "./selection-limit-message";
import { TooltipRequestState, type TooltipContext } from "./tooltip-request-state";

const MIN_TEXT_LENGTH = 1;
const MAX_HOVER_WORD_LENGTH = 30;
const MAX_HOVER_CONTEXT_LENGTH = 180;
const MIN_SELECTION_LENGTH = 50;
const MAX_SELECTION_LENGTH = 150;
const MAX_TOOLTIP_TEXT_LENGTH = 1000;
const TRANSLATE_MESSAGE = "hoverTranslate.translate";
const defaultSettings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: MAX_SELECTION_LENGTH,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: true,
  providerEndpoint: "",
  providerApiKey: "",
};
const supportedTargetLanguages = new Set(["en", "nl", "te"]);
const supportedSourceLanguages = new Set(["auto", "en", "nl", "te"]);
const mvpLanguages = [
  { code: "en", label: "English" },
  { code: "nl", label: "Dutch" },
  { code: "te", label: "Telugu" },
];
const dutchLanguageHints = new Set([
  "aan",
  "alsjeblieft",
  "ben",
  "dank",
  "dat",
  "de",
  "een",
  "en",
  "engels",
  "geen",
  "goedemorgen",
  "hallo",
  "heb",
  "hebben",
  "het",
  "hoe",
  "huis",
  "ik",
  "is",
  "je",
  "jij",
  "kan",
  "leren",
  "maar",
  "met",
  "nederlands",
  "niet",
  "ook",
  "op",
  "spreek",
  "taal",
  "te",
  "van",
  "voor",
  "waar",
  "wat",
  "wij",
  "zijn",
]);
const englishLanguageHints = new Set([
  "a",
  "an",
  "and",
  "are",
  "dutch",
  "english",
  "for",
  "good",
  "hello",
  "i",
  "in",
  "is",
  "morning",
  "not",
  "of",
  "on",
  "please",
  "thank",
  "thanks",
  "telugu",
  "that",
  "the",
  "to",
  "with",
  "you",
]);

type ExtensionSettings = {
  isEnabled: boolean;
  translateOnHover: boolean;
  translateOnSelection: boolean;
  hoverTranslationMode: string;
  hoverDelayMs: number;
  maxSelectionLength: number;
  sourceLanguage: string;
  targetLanguage: string;
  translateToOtherMvpLanguages: boolean;
  providerEndpoint: string;
  providerApiKey: string;
};

type StorageChange = {
  newValue?: unknown;
};

type TranslationContext = TooltipContext;

type TranslateMessageResponse =
  | {
      ok: true;
      result: {
        translatedText: string;
        providerName: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

type ExtensionStorageApi = {
  storage: {
    sync: {
      get(defaults: ExtensionSettings, callback: (settings: Partial<ExtensionSettings>) => void): void;
    };
    onChanged: {
      addListener(
        callback: (changes: Record<string, StorageChange>, areaName: string) => void,
      ): void;
    };
  };
  runtime: {
    lastError?: { message?: string };
    sendMessage(
      message: unknown,
      callback: (response?: TranslateMessageResponse) => void,
    ): void;
  };
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
const tooltipRequestState = new TooltipRequestState();

const tooltip = document.createElement("div");
tooltip.id = "hover-translate-tooltip";
tooltip.setAttribute("role", "status");
tooltip.hidden = true;
tooltip.textContent = "Translation will appear here.";

const style = document.createElement("style");
style.textContent = `
  #hover-translate-tooltip {
    position: fixed;
    z-index: 2147483647;
    max-width: min(360px, calc(100vw - 24px));
    padding: 8px 10px;
    border: 1px solid rgba(15, 23, 42, 0.18);
    border-radius: 6px;
    background: #111827;
    color: #f9fafb;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);
    font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    pointer-events: none;
    white-space: pre-line;
  }

  #hover-translate-tooltip[data-state="loading"] {
    color: #dbeafe;
  }

  #hover-translate-tooltip[data-state="error"] {
    border-color: rgba(248, 113, 113, 0.65);
    background: #7f1d1d;
    color: #fee2e2;
  }

  #hover-translate-tooltip .hover-translate-row {
    display: block;
  }

  #hover-translate-tooltip .hover-translate-label {
    font-weight: 700;
  }
`;

document.documentElement.append(style, tooltip);

document.addEventListener("mousemove", handleMouseMove, { passive: true });
document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
document.addEventListener("mouseup", handleSelection, { passive: true });
document.addEventListener("scroll", clearSelectionAndHideTooltip, { passive: true });
document.addEventListener("click", handlePageClick, { passive: true });
document.addEventListener("keydown", handleKeyDown);
extensionApi?.storage.onChanged.addListener(handleStorageChanged);

void refreshSettings();

function handleMouseMove(event: MouseEvent): void {
  window.clearTimeout(hoverTimer);

  if (!currentSettings.isEnabled || !currentSettings.translateOnHover) {
    hideTooltip();
    return;
  }

  hoverTimer = window.setTimeout(() => {
    if (hasActiveSelection()) {
      return;
    }

    const hit = getWordAtPoint(event.clientX, event.clientY);

    if (!hit) {
      hideTooltip();
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

function handleSelection(): void {
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
    showTooltipMessage(
      getSelectionTooLongMessage(currentSettings.maxSelectionLength),
      "error",
      "selection",
      rect.left,
      rect.bottom,
    );
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
  sourceLanguageHint?: string,
  languageSample = text,
): Promise<void> {
  const requestId = beginTooltipRequest("Translating...", context, x, y);

  const response = await requestTranslationForCurrentSettings(
    text,
    context,
    languageSample,
    sourceLanguageHint,
  );

  if (!tooltipRequestState.isCurrent(requestId)) {
    return;
  }

  showTooltipResult(response, x, y);
}

function beginTooltipRequest(
  message: string,
  context: TranslationContext,
  x: number,
  y: number,
): number {
  const requestId = tooltipRequestState.begin(context);
  tooltip.dataset.state = "loading";
  tooltip.textContent = message;
  positionTooltip(x, y);
  tooltip.hidden = false;
  return requestId;
}

function showTooltipMessage(
  message: string,
  state: "error" | "success",
  context: TranslationContext,
  x: number,
  y: number,
): void {
  tooltipRequestState.begin(context);
  tooltip.dataset.state = state;
  tooltip.textContent = message;
  positionTooltip(x, y);
  tooltip.hidden = false;
}

function showTooltipResult(response: TranslateMessageResponse, x: number, y: number): void {
  tooltip.dataset.state = response.ok ? "success" : "error";

  if (response.ok && response.result.providerName === "multi-target") {
    renderMultiTargetTooltip(truncateTooltipText(response.result.translatedText));
  } else {
    tooltip.textContent = truncateTooltipText(response.ok ? response.result.translatedText : response.error);
  }

  positionTooltip(x, y);
}

function renderMultiTargetTooltip(text: string): void {
  const rows = text.split("\n").map((line) => {
    const separatorIndex = line.indexOf(":");
    const row = document.createElement("span");
    row.className = "hover-translate-row";

    if (separatorIndex === -1) {
      row.textContent = line;
      return row;
    }

    const label = document.createElement("span");
    label.className = "hover-translate-label";
    label.textContent = line.slice(0, separatorIndex + 1);

    row.append(label, " " + line.slice(separatorIndex + 1).trimStart());
    return row;
  });

  tooltip.replaceChildren(...rows);
}

function truncateTooltipText(text: string): string {
  if (text.length <= MAX_TOOLTIP_TEXT_LENGTH) {
    return text;
  }

  return `${text.slice(0, MAX_TOOLTIP_TEXT_LENGTH).trimEnd()}...`;
}

function positionTooltip(x: number, y: number): void {
  const padding = 12;
  const offset = 14;

  tooltip.style.left = `${Math.min(x + offset, window.innerWidth - padding)}px`;
  tooltip.style.top = `${Math.min(y + offset, window.innerHeight - padding)}px`;

  const rect = tooltip.getBoundingClientRect();
  const left = Math.max(padding, Math.min(rect.left, window.innerWidth - rect.width - padding));
  const top = Math.max(padding, Math.min(rect.top, window.innerHeight - rect.height - padding));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip(): void {
  tooltipRequestState.clear();
  tooltip.hidden = true;
  delete tooltip.dataset.state;
  lastHoverKey = "";
}

function clearSelectionAndHideTooltip(): void {
  activeSelectionText = "";
  hideTooltip();
}

function handlePageClick(): void {
  if (hasActiveSelection()) {
    return;
  }

  clearSelectionAndHideTooltip();
}

function handleMouseLeave(): void {
  if (tooltipRequestState.activeContext === "selection") {
    return;
  }

  hideTooltip();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    clearSelectionAndHideTooltip();
  }
}

function hasActiveSelection(): boolean {
  const selectedText = window.getSelection()?.toString().trim() ?? "";

  if (!selectedText) {
    activeSelectionText = "";
    return false;
  }

  return selectedText === activeSelectionText || tooltipRequestState.activeContext === "selection";
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
  sourceLanguageHint?: string;
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

  const wordRange = document.createRange();
  wordRange.setStart(textNode, match.start);
  wordRange.setEnd(textNode, match.end);

  const rect = wordRange.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
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
  if (areaName !== "sync") {
    return;
  }

  currentSettings = {
    ...currentSettings,
    ...settingChangesToPartialSettings(changes),
  };

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

      resolve({
        isEnabled: getBooleanSetting(stored.isEnabled, defaultSettings.isEnabled),
        translateOnHover: getBooleanSetting(stored.translateOnHover, defaultSettings.translateOnHover),
        translateOnSelection: getBooleanSetting(
          stored.translateOnSelection,
          defaultSettings.translateOnSelection,
        ),
        hoverTranslationMode: getHoverTranslationModeSetting(
          stored.hoverTranslationMode,
          defaultSettings.hoverTranslationMode,
        ),
        hoverDelayMs: getNumberSetting(stored.hoverDelayMs, defaultSettings.hoverDelayMs),
        maxSelectionLength: getNumberSettingInRange(
          stored.maxSelectionLength,
          defaultSettings.maxSelectionLength,
          MIN_SELECTION_LENGTH,
          MAX_SELECTION_LENGTH,
        ),
        sourceLanguage: getSourceLanguageSetting(stored.sourceLanguage, defaultSettings.sourceLanguage),
        targetLanguage: getTargetLanguageSetting(stored.targetLanguage, defaultSettings.targetLanguage),
        translateToOtherMvpLanguages: getBooleanSetting(
          stored.translateToOtherMvpLanguages,
          defaultSettings.translateToOtherMvpLanguages,
        ),
        providerEndpoint: getStringSetting(stored.providerEndpoint, defaultSettings.providerEndpoint),
        providerApiKey: getStringSetting(stored.providerApiKey, defaultSettings.providerApiKey),
      });
    });
  });
}

function getHoverTranslationModeSetting(value: unknown, fallback: string): string {
  return value === "word" || value === "sentence" ? value : fallback;
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function getTargetLanguageSetting(value: unknown, fallback: string): string {
  return typeof value === "string" && supportedTargetLanguages.has(value) ? value : fallback;
}

function getSourceLanguageSetting(value: unknown, fallback: string): string {
  return typeof value === "string" && supportedSourceLanguages.has(value) ? value : fallback;
}

function getBooleanSetting(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getNumberSetting(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getNumberSettingInRange(value: unknown, fallback: number, min: number, max: number): number {
  const numberValue = getNumberSetting(value, fallback);
  return Math.min(Math.max(numberValue, min), max);
}

function getOptionalHoverTranslationModeSetting(value: unknown): string | undefined {
  return value === "word" || value === "sentence" ? value : undefined;
}

function getOptionalStringSetting(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getOptionalTargetLanguageSetting(value: unknown): string | undefined {
  return typeof value === "string" && supportedTargetLanguages.has(value) ? value : undefined;
}

function getOptionalSourceLanguageSetting(value: unknown): string | undefined {
  return typeof value === "string" && supportedSourceLanguages.has(value) ? value : undefined;
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

  return Math.min(Math.max(numberValue, MIN_SELECTION_LENGTH), MAX_SELECTION_LENGTH);
}

async function requestTranslation(
  text: string,
  context: TranslationContext,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<TranslateMessageResponse> {
  if (!extensionApi) {
    return {
      ok: false,
      error: "Extension runtime is unavailable.",
    };
  }

  return new Promise((resolve) => {
    extensionApi.runtime.sendMessage(
      {
        type: TRANSLATE_MESSAGE,
        payload: {
          text,
          sourceLanguage,
          targetLanguage,
          context,
        },
      },
      (response) => {
        if (extensionApi.runtime.lastError) {
          resolve({
            ok: false,
            error: extensionApi.runtime.lastError.message ?? "Translation request failed.",
          });
          return;
        }

        resolve(response ?? { ok: false, error: "No translation response received." });
      },
    );
  });
}

async function requestTranslationForCurrentSettings(
  text: string,
  context: TranslationContext,
  languageSample: string,
  sourceLanguageHint?: string,
): Promise<TranslateMessageResponse> {
  const sourceLanguage = getActiveSourceLanguage(languageSample, sourceLanguageHint);
  const targetLanguages = getActiveTargetLanguages(sourceLanguage);

  if (targetLanguages.length <= 1) {
    return requestTranslation(text, context, sourceLanguage, currentSettings.targetLanguage);
  }

  const responses = await Promise.all(
    targetLanguages.map(async (targetLanguage) => ({
      targetLanguage,
      response: await requestTranslation(text, context, sourceLanguage, targetLanguage),
    })),
  );
  const failedResponse = responses.find(({ response }) => !response.ok);

  if (failedResponse?.response.ok === false) {
    return failedResponse.response;
  }

  return {
    ok: true,
    result: {
      translatedText: responses
        .map(({ targetLanguage, response }) => {
          const label = getLanguageLabel(targetLanguage);
          return `${label}: ${response.ok ? response.result.translatedText : ""}`;
        })
        .join("\n"),
      providerName: "multi-target",
    },
  };
}

function getActiveTargetLanguages(sourceLanguage: string): string[] {
  if (!currentSettings.translateToOtherMvpLanguages) {
    return [currentSettings.targetLanguage];
  }

  return mvpLanguages
    .map((language) => language.code)
    .filter((languageCode) => languageCode !== sourceLanguage);
}

function getActiveSourceLanguage(text: string, sourceLanguageHint?: string): string {
  if (currentSettings.sourceLanguage !== "auto") {
    return currentSettings.sourceLanguage;
  }

  if (!currentSettings.translateToOtherMvpLanguages) {
    return "auto";
  }

  return detectMvpSourceLanguage(text, sourceLanguageHint);
}

function detectMvpSourceLanguage(text: string, sourceLanguageHint?: string): string {
  if (/[\u0C00-\u0C7F]/u.test(text)) {
    return "te";
  }

  if (sourceLanguageHint) {
    return sourceLanguageHint;
  }

  const words = text.toLowerCase().match(/[\p{Letter}]+/gu) ?? [];
  let dutchScore = 0;
  let englishScore = 0;

  for (const word of words) {
    if (dutchLanguageHints.has(word)) {
      dutchScore += 1;
    }

    if (englishLanguageHints.has(word)) {
      englishScore += 1;
    }

    if (
      word.includes("ij") ||
      word.includes("sch") ||
      word.includes("oe") ||
      word.includes("ui")
    ) {
      dutchScore += 1;
    }
  }

  if (dutchScore > englishScore) {
    return "nl";
  }

  if (englishScore > dutchScore || words.length > 0) {
    return "en";
  }

  return "nl";
}

function getLanguageLabel(languageCode: string): string {
  return mvpLanguages.find((language) => language.code === languageCode)?.label ?? languageCode;
}

function getLanguageHintForNode(node: Node | null): string | undefined {
  const element =
    node instanceof Element
      ? node
      : node?.parentElement;
  const language =
    normalizeLanguageCode(element?.closest("[lang]")?.getAttribute("lang")) ??
    normalizeLanguageCode(document.documentElement.lang);

  return language;
}

function normalizeLanguageCode(value: string | null | undefined): string | undefined {
  const languageCode = value?.trim().toLowerCase().split("-")[0];

  return languageCode && supportedTargetLanguages.has(languageCode) ? languageCode : undefined;
}
