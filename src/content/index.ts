import { getHoverRequestKey } from "./hover-request-key";
import { isPointInsideVisibleBox } from "./pointer-hit-box";
import {
  requestRuntimeTranslation,
  type RuntimeTranslationExtensionApi,
  type TranslateMessageResponse,
} from "./runtime-translation-client";
import { requestContentTranslation } from "./content-translation-request";
import {
  requestDirectTranslation,
} from "./direct-translation-request";
import {
  requestRuntimeSavedVocabularyList,
  requestRuntimeSaveVocabularyBatch,
  type RuntimeSaveVocabularyRequest,
} from "./runtime-vocabulary-client";
import { applySavedVocabularyStorageChange } from "./saved-vocabulary-id-cache";
import {
  TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE,
  withTooltipTranslationTimeout,
} from "./tooltip-translation-timeout";
import { getSelectionTooLongMessage } from "./selection-limit-message";
import { isValidTextRangeBoundary } from "./text-range-boundary";
import type { TooltipContext } from "./tooltip-request-state";
import {
  WebpageLookupSession,
  type TranslationOutcome,
} from "./webpage-lookup-session";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import type { TranslationRequest, TranslationResult } from "../translation/provider";
import {
  PersistentTranslationCache,
  type PersistentTranslationCacheStorage,
} from "../translation/persistent-translation-cache";
import { shouldPersistTranslation } from "../translation/persistent-cache-policy";
import {
  getSavedVocabularyEntryId,
} from "../vocabulary/saved-vocabulary";

const MIN_TEXT_LENGTH = 1;
const DEFAULT_PROVIDER_ENDPOINT = "https://dutchmate-backend.onrender.com/translate";
const MAX_HOVER_WORD_LENGTH = 30;
const MAX_HOVER_CONTEXT_LENGTH = 180;
const MIN_SELECTION_LENGTH = 50;
const MAX_SELECTION_LENGTH = 150;
const MAX_TOOLTIP_TEXT_LENGTH = 1000;
const TOOLTIP_TRANSLATION_TIMEOUT_MS = 9000;
const CHROME_DIRECT_TRANSLATION_FALLBACK_MS = 1200;
const DIRECT_TRANSLATION_TIMEOUT_MS = 15000;
const defaultLanguageRoles = {
  learningLanguage: "nl" as const,
  nativeLanguage: "te" as const,
  bridgeLanguage: "en" as const,
};
const defaultSettings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  cacheHoveredWords: false,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: MAX_SELECTION_LENGTH,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: true,
  ...defaultLanguageRoles,
  providerEndpoint: DEFAULT_PROVIDER_ENDPOINT,
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
  cacheHoveredWords: boolean;
  hoverTranslationMode: string;
  hoverDelayMs: number;
  maxSelectionLength: number;
  sourceLanguage: string;
  targetLanguage: MvpLanguageCode;
  translateToOtherMvpLanguages: boolean;
  learningLanguage: MvpLanguageCode;
  nativeLanguage: MvpLanguageCode;
  bridgeLanguage: MvpLanguageCode;
  providerEndpoint: string;
  providerApiKey: string;
};

type StorageChange = {
  newValue?: unknown;
};

type TranslationContext = TooltipContext;

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
let directTranslationCache: PersistentTranslationCache | undefined;

let hoverTimer: number | undefined;
let lastHoverKey = "";
let activeSelectionText = "";
let currentSettings = defaultSettings;
let savedVocabularyIds: Set<string> | undefined;
let savedVocabularyIdsRequest: Promise<Set<string> | undefined> | undefined;
let tooltipTimeout: number | undefined;
const tooltipRequestState = new WebpageLookupSession();

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
    pointer-events: auto;
    white-space: pre-line;
  }

  #hover-translate-tooltip .hover-translate-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }

  #hover-translate-tooltip .hover-translate-save {
    appearance: none;
    border: 1px solid rgba(249, 250, 251, 0.42);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    line-height: 1.2;
    padding: 4px 8px;
  }

  #hover-translate-tooltip .hover-translate-save:disabled {
    cursor: default;
    opacity: 0.76;
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
void refreshSavedVocabularyIds();

function handleMouseMove(event: MouseEvent): void {
  if (isTooltipEvent(event)) {
    return;
  }

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
  sourceLanguageHint?: MvpLanguageCode,
  languageSample = text,
): Promise<void> {
  const requestId = beginTooltipRequest("Translating...", context, x, y);

  let outcome: TranslationOutcome;

  try {
    outcome = await withTooltipTranslationTimeout(
      requestTranslationForCurrentSettings(text, context, languageSample, sourceLanguageHint),
      TOOLTIP_TRANSLATION_TIMEOUT_MS,
    );
  } catch (error) {
    const failedLookup = tooltipRequestState.acceptFailure(
      requestId,
      error instanceof Error ? error.message : "Translation request failed.",
    );

    if (failedLookup.status === "current") {
      showTooltipMessage(failedLookup.error, "error", failedLookup.context, x, y);
    }
    return;
  }

  const completedLookup = tooltipRequestState.acceptSuccess(requestId, text, outcome);

  if (completedLookup.status === "stale") {
    return;
  }

  try {
    showTooltipResult(
      completedLookup.response,
      x,
      y,
      completedLookup.saveCandidates,
    );
  } catch {
    showTooltipMessage(
      completedLookup.response.ok
        ? completedLookup.response.result.translatedText
        : completedLookup.response.error,
      completedLookup.response.ok ? "success" : "error",
      completedLookup.context,
      x,
      y,
    );
  }
}

function beginTooltipRequest(
  message: string,
  context: TranslationContext,
  x: number,
  y: number,
): number {
  const requestId = tooltipRequestState.begin(context);
  window.clearTimeout(tooltipTimeout);
  tooltipTimeout = window.setTimeout(() => {
    if (tooltipRequestState.isCurrent(requestId) && tooltip.dataset.state === "loading") {
      showTooltipMessage(
        TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE,
        "error",
        context,
        x,
        y,
      );
    }
  }, TOOLTIP_TRANSLATION_TIMEOUT_MS);
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
  window.clearTimeout(tooltipTimeout);
  tooltipRequestState.begin(context);
  tooltip.dataset.state = state;
  tooltip.textContent = message;
  positionTooltip(x, y);
  tooltip.hidden = false;
}

function showTooltipResult(
  response: TranslateMessageResponse,
  x: number,
  y: number,
  saveCandidates: RuntimeSaveVocabularyRequest[] = [],
): void {
  window.clearTimeout(tooltipTimeout);
  tooltip.dataset.state = response.ok ? "success" : "error";

  if (response.ok && response.result.providerName === "multi-target") {
    renderMultiTargetTooltip(truncateTooltipText(response.result.translatedText));
  } else {
    tooltip.textContent = truncateTooltipText(response.ok ? response.result.translatedText : response.error);
  }

  renderSaveAction(saveCandidates);
  positionTooltip(x, y);
}

function renderSaveAction(saveCandidates: RuntimeSaveVocabularyRequest[]): void {
  if (saveCandidates.length === 0) {
    return;
  }

  const actions = document.createElement("div");
  actions.className = "hover-translate-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "hover-translate-save";
  const saveCandidateIds = getSaveCandidateIds(saveCandidates);
  const isAlreadySaved =
    savedVocabularyIds !== undefined &&
    saveCandidateIds.every((id) => savedVocabularyIds?.has(id));

  saveButton.disabled = isAlreadySaved || savedVocabularyIds === undefined;
  saveButton.textContent = isAlreadySaved
    ? "Already saved"
    : savedVocabularyIds === undefined
      ? "Checking..."
      : "Save";
  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    void saveVocabularyFromTooltip(saveButton, saveCandidates);
  });

  actions.append(saveButton);
  tooltip.appendChild(actions);

  if (savedVocabularyIds === undefined) {
    void refreshSaveButtonState(saveButton, saveCandidates);
  }
}

async function saveVocabularyFromTooltip(
  saveButton: HTMLButtonElement,
  saveCandidates: RuntimeSaveVocabularyRequest[],
): Promise<void> {
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  const response = await requestRuntimeSaveVocabularyBatch(extensionApi, saveCandidates);

  if (!response.ok) {
    saveButton.disabled = false;
    saveButton.textContent = "Try again";
    saveButton.title = response.error;
    return;
  }

  const saveResults = response.result.results;
  const maxEntriesResult = saveResults.find((result) => result.status === "max-entries-reached");

  if (maxEntriesResult?.status === "max-entries-reached") {
    saveButton.textContent = "Vocabulary full";
    return;
  }

  if (saveResults.every((result) => result.status === "already-saved")) {
    saveButton.textContent = "Already saved";
    return;
  }

  const savedEntries = saveResults.flatMap((result) =>
    "entry" in result && result.entry ? [result.entry] : [],
  );
  const savedIds = savedEntries.map((entry) => entry.id);
  savedVocabularyIds = new Set([...(savedVocabularyIds ?? []), ...savedIds]);
  saveButton.textContent = "Saved";
}

async function refreshSaveButtonState(
  saveButton: HTMLButtonElement,
  saveCandidates: RuntimeSaveVocabularyRequest[],
): Promise<void> {
  const latestSavedVocabularyIds = await refreshSavedVocabularyIds();

  if (!latestSavedVocabularyIds) {
    saveButton.disabled = false;
    saveButton.textContent = "Save";
    return;
  }

  if (getSaveCandidateIds(saveCandidates).every((id) => latestSavedVocabularyIds.has(id))) {
    saveButton.textContent = "Already saved";
    saveButton.disabled = true;
    return;
  }

  saveButton.textContent = "Save";
  saveButton.disabled = false;
}

async function refreshSavedVocabularyIds(): Promise<Set<string> | undefined> {
  if (savedVocabularyIdsRequest) {
    return savedVocabularyIdsRequest;
  }

  savedVocabularyIdsRequest = requestRuntimeSavedVocabularyList(extensionApi)
    .then((response) => {
      if (!response.ok) {
        return undefined;
      }

      savedVocabularyIds = new Set(response.result.entries.map((entry) => entry.id));
      return savedVocabularyIds;
    })
    .finally(() => {
      savedVocabularyIdsRequest = undefined;
    });

  return savedVocabularyIdsRequest;
}

function getSaveCandidateIds(saveCandidates: RuntimeSaveVocabularyRequest[]): string[] {
  return saveCandidates.map((candidate) => getSavedVocabularyEntryId(candidate));
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

  tooltip.textContent = "";
  for (const row of rows) {
    tooltip.appendChild(row);
  }
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
  window.clearTimeout(tooltipTimeout);
  tooltipRequestState.clear();
  tooltip.hidden = true;
  delete tooltip.dataset.state;
  lastHoverKey = "";
}

function clearSelectionAndHideTooltip(): void {
  activeSelectionText = "";
  hideTooltip();
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
  if (tooltipRequestState.shouldKeepVisibleOnMouseLeave()) {
    return;
  }

  hideTooltip();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    clearSelectionAndHideTooltip();
  }
}

function isTooltipEvent(event: Event): boolean {
  return event.target instanceof Node && tooltip.contains(event.target);
}

function hasActiveSelection(): boolean {
  const selectedText = window.getSelection()?.toString().trim() ?? "";

  if (!selectedText) {
    activeSelectionText = "";
    return false;
  }

  return selectedText === activeSelectionText || tooltipRequestState.hasActiveSelectionControl();
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
  const nextSavedVocabularyIds = applySavedVocabularyStorageChange(
    savedVocabularyIds,
    changes,
    areaName,
  );

  if (nextSavedVocabularyIds !== savedVocabularyIds) {
    savedVocabularyIds = nextSavedVocabularyIds;
    savedVocabularyIdsRequest = undefined;
  }

  if (areaName !== "sync") {
    return;
  }

  currentSettings = normalizeCurrentLanguageRoles({
    ...currentSettings,
    ...settingChangesToPartialSettings(changes),
  });

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

      resolve(normalizeCurrentLanguageRoles({
        isEnabled: getBooleanSetting(stored.isEnabled, defaultSettings.isEnabled),
        translateOnHover: getBooleanSetting(stored.translateOnHover, defaultSettings.translateOnHover),
        translateOnSelection: getBooleanSetting(
          stored.translateOnSelection,
          defaultSettings.translateOnSelection,
        ),
        cacheHoveredWords: getBooleanSetting(
          stored.cacheHoveredWords,
          defaultSettings.cacheHoveredWords,
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
        learningLanguage: getTargetLanguageSetting(
          stored.learningLanguage,
          defaultSettings.learningLanguage,
        ),
        nativeLanguage: getTargetLanguageSetting(
          stored.nativeLanguage,
          defaultSettings.nativeLanguage,
        ),
        bridgeLanguage: getTargetLanguageSetting(
          stored.bridgeLanguage,
          defaultSettings.bridgeLanguage,
        ),
      }));
    });
  });
}

function normalizeCurrentLanguageRoles(settings: ExtensionSettings): ExtensionSettings {
  const learningLanguage = getTargetLanguageSetting(
    settings.learningLanguage,
    defaultSettings.learningLanguage,
  );
  const nativeLanguage = getTargetLanguageSetting(settings.nativeLanguage, defaultSettings.nativeLanguage);
  const bridgeLanguage = getTargetLanguageSetting(
    settings.bridgeLanguage,
    defaultSettings.bridgeLanguage,
  );

  if (learningLanguage === nativeLanguage) {
    return {
      ...settings,
      learningLanguage,
      nativeLanguage: bridgeLanguage,
      bridgeLanguage: nativeLanguage,
    };
  }

  if (learningLanguage === bridgeLanguage) {
    return {
      ...settings,
      learningLanguage,
      bridgeLanguage: nativeLanguage,
      nativeLanguage,
    };
  }

  if (nativeLanguage === bridgeLanguage) {
    return {
      ...settings,
      learningLanguage,
      nativeLanguage,
      bridgeLanguage:
        learningLanguage === defaultLanguageRoles.learningLanguage
          ? defaultLanguageRoles.bridgeLanguage
          : defaultLanguageRoles.learningLanguage,
    };
  }

  return {
    ...settings,
    learningLanguage,
    nativeLanguage,
    bridgeLanguage,
  };
}

function getHoverTranslationModeSetting(value: unknown, fallback: string): string {
  return value === "word" || value === "sentence" ? value : fallback;
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function getTargetLanguageSetting(value: unknown, fallback: MvpLanguageCode): MvpLanguageCode {
  return typeof value === "string" && supportedTargetLanguages.has(value)
    ? (value as MvpLanguageCode)
    : fallback;
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

function getOptionalTargetLanguageSetting(value: unknown): MvpLanguageCode | undefined {
  return typeof value === "string" && supportedTargetLanguages.has(value)
    ? (value as MvpLanguageCode)
    : undefined;
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
  sourceLanguage: SourceLanguageCode,
  targetLanguage: MvpLanguageCode,
): Promise<TranslateMessageResponse> {
  const request: TranslationRequest = {
    text,
    context,
    sourceLanguage,
    targetLanguage,
  };
  return requestContentTranslation(request, {
    browserTarget: __BROWSER_TARGET__,
    cache: getDirectTranslationCache(),
    extensionApi,
    requestDirectTranslation: (directRequest) =>
      requestDirectTranslation(directRequest, {
        providerEndpoint: currentSettings.providerEndpoint,
        providerApiKey: currentSettings.providerApiKey,
        timeoutMs: DIRECT_TRANSLATION_TIMEOUT_MS,
      }),
    requestRuntimeTranslation,
    chromeDirectTranslationFallbackMs: CHROME_DIRECT_TRANSLATION_FALLBACK_MS,
    delay,
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function getDirectTranslationCache(): PersistentTranslationCache {
  directTranslationCache ??= new PersistentTranslationCache(
    new ContentLocalCacheStorage(extensionApi),
    {
      shouldPersist: (request) =>
        shouldPersistTranslation(request, undefined, {
          cacheHoveredWords: currentSettings.cacheHoveredWords,
        }),
    },
  );

  return directTranslationCache;
}

class ContentLocalCacheStorage implements PersistentTranslationCacheStorage {
  constructor(private readonly api: ExtensionStorageApi | undefined) {}

  async get(key: string): Promise<unknown> {
    if (!this.api) {
      return undefined;
    }

    return new Promise((resolve) => {
      this.api?.storage.local.get(key, (items) => {
        if (this.api?.runtime.lastError) {
          resolve(undefined);
          return;
        }

        resolve(items[key]);
      });
    });
  }

  async set(key: string, value: unknown): Promise<void> {
    if (!this.api) {
      return;
    }

    return new Promise((resolve) => {
      this.api?.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }
}

async function requestTranslationForCurrentSettings(
  text: string,
  context: TranslationContext,
  languageSample: string,
  sourceLanguageHint?: MvpLanguageCode,
): Promise<TranslationOutcome> {
  const sourceLanguage = getActiveSourceLanguage(languageSample, sourceLanguageHint);
  const targetLanguages = getActiveTargetLanguages(sourceLanguage);

  if (targetLanguages.length <= 1) {
    const response = await requestTranslation(text, context, sourceLanguage, currentSettings.targetLanguage);
    return {
      response,
      saveCandidates: getSaveCandidatesFromResponses(text, sourceLanguage, [
        {
          targetLanguage: currentSettings.targetLanguage,
          response,
        },
      ]),
    };
  }

  const responses = await Promise.all(
    targetLanguages.map(async (targetLanguage) => ({
      targetLanguage,
      response: await requestTranslation(text, context, sourceLanguage, targetLanguage),
    })),
  );
  const failedResponse = responses.find(({ response }) => !response.ok);

  if (failedResponse?.response.ok === false) {
    return {
      response: failedResponse.response,
      saveCandidates: [],
    };
  }

  return {
    response: {
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
    },
    saveCandidates: getSaveCandidatesFromResponses(text, sourceLanguage, responses),
  };
}

function getSaveCandidatesFromResponses(
  text: string,
  activeSourceLanguage: SourceLanguageCode,
  responses: Array<{
    targetLanguage: MvpLanguageCode;
    response: TranslateMessageResponse;
  }>,
): RuntimeSaveVocabularyRequest[] {
  const sourceLanguage = getRequestedSourceLanguage();
  const detectedSourceLanguage = getDetectedSourceLanguage(sourceLanguage, activeSourceLanguage);

  return responses.flatMap(({ targetLanguage, response }) => {
    if (!response.ok) {
      return [];
    }

    return [
      {
        text,
        sourceLanguage,
        detectedSourceLanguage,
        targetLanguage,
        translatedText: response.result.translatedText,
        providerName: response.result.providerName,
      },
    ];
  });
}

function getRequestedSourceLanguage(): SourceLanguageCode {
  return currentSettings.sourceLanguage === "auto" ||
    supportedTargetLanguages.has(currentSettings.sourceLanguage)
    ? (currentSettings.sourceLanguage as SourceLanguageCode)
    : "auto";
}

function getDetectedSourceLanguage(
  requestedSourceLanguage: SourceLanguageCode,
  activeSourceLanguage: SourceLanguageCode,
): MvpLanguageCode | undefined {
  return requestedSourceLanguage === "auto" && supportedTargetLanguages.has(activeSourceLanguage)
    ? (activeSourceLanguage as MvpLanguageCode)
    : undefined;
}

function getActiveTargetLanguages(sourceLanguage: SourceLanguageCode): MvpLanguageCode[] {
  if (!currentSettings.translateToOtherMvpLanguages) {
    return [currentSettings.targetLanguage];
  }

  const orderedLanguages =
    sourceLanguage === currentSettings.learningLanguage
      ? [
          currentSettings.bridgeLanguage,
          currentSettings.nativeLanguage,
          currentSettings.learningLanguage,
        ]
      : [
          currentSettings.learningLanguage,
          currentSettings.bridgeLanguage,
          currentSettings.nativeLanguage,
        ];

  return Array.from(new Set(orderedLanguages)).filter(
    (languageCode): languageCode is MvpLanguageCode => languageCode !== sourceLanguage,
  );
}

function getActiveSourceLanguage(
  text: string,
  sourceLanguageHint?: MvpLanguageCode,
): SourceLanguageCode {
  if (currentSettings.sourceLanguage !== "auto") {
    return getRequestedSourceLanguage();
  }

  if (!currentSettings.translateToOtherMvpLanguages) {
    return "auto";
  }

  return detectMvpSourceLanguage(text, sourceLanguageHint);
}

function detectMvpSourceLanguage(
  text: string,
  sourceLanguageHint?: MvpLanguageCode,
): MvpLanguageCode {
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
