const MIN_TEXT_LENGTH = 1;
const MAX_HOVER_WORD_LENGTH = 48;
const MAX_TOOLTIP_TEXT_LENGTH = 1000;
const TRANSLATE_MESSAGE = "hoverTranslate.translate";
const defaultSettings: ExtensionSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  hoverDelayMs: 450,
  maxSelectionLength: 600,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: false,
  providerEndpoint: "",
  providerApiKey: "",
};
const supportedTargetLanguages = new Set(["en", "nl", "te"]);
const supportedSourceLanguages = new Set(["auto", "en", "nl", "te"]);

type ExtensionSettings = {
  isEnabled: boolean;
  translateOnHover: boolean;
  translateOnSelection: boolean;
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

type TranslationContext = "hover" | "selection";

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
let activeRequestId = 0;
let activeTooltipContext: TranslationContext | null = null;
let activeSelectionText = "";
let currentSettings = defaultSettings;

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
  }

  #hover-translate-tooltip[data-state="loading"] {
    color: #dbeafe;
  }

  #hover-translate-tooltip[data-state="error"] {
    border-color: rgba(248, 113, 113, 0.65);
    background: #7f1d1d;
    color: #fee2e2;
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

    const hoverKey = `${hit.word}:${hit.x}:${hit.y}`;
    if (hoverKey === lastHoverKey) {
      return;
    }

    lastHoverKey = hoverKey;
    showTranslation(hit.word, "hover", hit.x, hit.y);
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
    selectedText.length > currentSettings.maxSelectionLength ||
    selection.rangeCount === 0
  ) {
    return;
  }

  activeSelectionText = selectedText;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  showTranslation(selectedText, "selection", rect.left, rect.bottom);
}

async function showTranslation(
  text: string,
  context: TranslationContext,
  x: number,
  y: number,
): Promise<void> {
  const requestId = beginTooltipRequest("Translating...", context, x, y);

  const response = await requestTranslation(text, context);

  if (requestId !== activeRequestId) {
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
  activeRequestId += 1;
  activeTooltipContext = context;
  tooltip.dataset.state = "loading";
  tooltip.textContent = message;
  positionTooltip(x, y);
  tooltip.hidden = false;
  return activeRequestId;
}

function showTooltipResult(response: TranslateMessageResponse, x: number, y: number): void {
  tooltip.dataset.state = response.ok ? "success" : "error";
  tooltip.textContent = truncateTooltipText(response.ok ? response.result.translatedText : response.error);
  positionTooltip(x, y);
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
  activeRequestId += 1;
  tooltip.hidden = true;
  activeTooltipContext = null;
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
  if (activeTooltipContext === "selection") {
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

  return selectedText === activeSelectionText || activeTooltipContext === "selection";
}

function getWordAtPoint(clientX: number, clientY: number): { word: string; x: number; y: number } | null {
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
    x: rect.left,
    y: rect.bottom,
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
    hoverDelayMs: getOptionalNumberSetting(changes.hoverDelayMs?.newValue),
    maxSelectionLength: getOptionalNumberSetting(changes.maxSelectionLength?.newValue),
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
        hoverDelayMs: getNumberSetting(stored.hoverDelayMs, defaultSettings.hoverDelayMs),
        maxSelectionLength: getNumberSetting(
          stored.maxSelectionLength,
          defaultSettings.maxSelectionLength,
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

async function requestTranslation(
  text: string,
  context: TranslationContext,
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
          sourceLanguage: currentSettings.sourceLanguage,
          targetLanguage: currentSettings.targetLanguage,
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
