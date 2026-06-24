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
import {
  applyContentSettingChanges,
  readContentSettings,
  type ContentSettingsExtensionApi,
} from "./content-settings-adapter";
import { createRuntimeLookupAdapter } from "./runtime-lookup-adapter";
import { createTooltipViewAdapter } from "./tooltip-view-adapter";
import {
  getHoverLookupInput,
  getSelectionLookupInput,
} from "./webpage-input-adapter";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import {
  defaultSettings,
  type ExtensionSettings,
} from "../shared/settings";

const TOOLTIP_TRANSLATION_TIMEOUT_MS = 9000;
const CHROME_DIRECT_TRANSLATION_FALLBACK_MS = 1200;
const DIRECT_TRANSLATION_TIMEOUT_MS = 15000;

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
const settingsExtensionApi = extensionApi as ContentSettingsExtensionApi | undefined;

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

    const hit = getHoverLookupInput(
      event.clientX,
      event.clientY,
      currentSettings.hoverTranslationMode,
    );

    if (!hit) {
      lookupModule.clear();
      return;
    }

    const hoverKey = getHoverRequestKey({
      text: hit.text,
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
      hit.text,
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

  const selection = getSelectionLookupInput(currentSettings.maxSelectionLength);
  if (selection.status === "none") {
    return;
  }

  if (selection.status === "too-long") {
    activeSelectionText = selection.text;
    tooltipView.showError(
      getSelectionTooLongMessage(currentSettings.maxSelectionLength),
      selection.x,
      selection.y,
    );
    return;
  }

  activeSelectionText = selection.text;
  showTranslation(
    selection.text,
    "selection",
    selection.x,
    selection.y,
    selection.sourceLanguageHint,
    selection.languageSample,
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

async function refreshSettings(): Promise<void> {
  currentSettings = await readContentSettings(settingsExtensionApi);
}

function handleStorageChanged(changes: Record<string, StorageChange>, areaName: string): void {
  lookupModule.handleStorageChanged(changes, areaName);

  if (areaName !== "sync") {
    return;
  }

  currentSettings = applyContentSettingChanges(currentSettings, changes);
  lookupModule.applySettings();

  if (!currentSettings.isEnabled) {
    hideTooltip();
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}
