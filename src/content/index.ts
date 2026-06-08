import { PlaceholderTranslationProvider } from "../translation/provider";

const HOVER_DELAY_MS = 450;
const MIN_TEXT_LENGTH = 1;
const MAX_HOVER_WORD_LENGTH = 48;
const MAX_SELECTION_LENGTH = 600;
const defaultSettings: ExtensionSettings = {
  targetLanguage: "en",
  providerEndpoint: "",
  providerApiKey: "",
};

type ExtensionSettings = {
  targetLanguage: string;
  providerEndpoint: string;
  providerApiKey: string;
};

type StorageChange = {
  newValue?: unknown;
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
  };
};

const extensionGlobal = globalThis as typeof globalThis & {
  browser?: ExtensionStorageApi;
  chrome?: ExtensionStorageApi;
};
const extensionApi = extensionGlobal.chrome ?? extensionGlobal.browser;

const provider = new PlaceholderTranslationProvider();

let hoverTimer: number | undefined;
let lastHoverKey = "";
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
`;

document.documentElement.append(style, tooltip);

document.addEventListener("mousemove", handleMouseMove, { passive: true });
document.addEventListener("mouseleave", hideTooltip, { passive: true });
document.addEventListener("mouseup", handleSelection, { passive: true });
document.addEventListener("scroll", hideTooltip, { passive: true });
extensionApi?.storage.onChanged.addListener(handleStorageChanged);

void refreshSettings();

function handleMouseMove(event: MouseEvent): void {
  window.clearTimeout(hoverTimer);

  hoverTimer = window.setTimeout(() => {
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
    showPlaceholderTranslation(hit.word, "hover", hit.x, hit.y);
  }, HOVER_DELAY_MS);
}

function handleSelection(): void {
  window.clearTimeout(hoverTimer);

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() ?? "";

  if (
    !selection ||
    selectedText.length < MIN_TEXT_LENGTH ||
    selectedText.length > MAX_SELECTION_LENGTH ||
    selection.rangeCount === 0
  ) {
    return;
  }

  const rect = selection.getRangeAt(0).getBoundingClientRect();
  showPlaceholderTranslation(selectedText, "selection", rect.left, rect.bottom);
}

async function showPlaceholderTranslation(
  text: string,
  context: "hover" | "selection",
  x: number,
  y: number,
): Promise<void> {
  const result = await provider.translate({
    text,
    sourceLanguage: "auto",
    targetLanguage: currentSettings.targetLanguage,
    context,
  });

  tooltip.textContent = result.translatedText;
  positionTooltip(x, y);
  tooltip.hidden = false;
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
  tooltip.hidden = true;
  lastHoverKey = "";
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
}

function settingChangesToPartialSettings(
  changes: Record<string, StorageChange>,
): Partial<ExtensionSettings> {
  const updatedSettings: Partial<ExtensionSettings> = {};

  for (const key of Object.keys(defaultSettings) as Array<keyof ExtensionSettings>) {
    const newValue = changes[key]?.newValue;

    if (typeof newValue === "string") {
      updatedSettings[key] = newValue;
    }
  }

  return updatedSettings;
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
        targetLanguage: getStringSetting(stored.targetLanguage, defaultSettings.targetLanguage),
        providerEndpoint: getStringSetting(stored.providerEndpoint, defaultSettings.providerEndpoint),
        providerApiKey: getStringSetting(stored.providerApiKey, defaultSettings.providerApiKey),
      });
    });
  });
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
