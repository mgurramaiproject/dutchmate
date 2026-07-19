import { type RuntimeTranslationExtensionApi } from "./runtime-translation-client";
import { withTooltipTranslationTimeout } from "./tooltip-translation-timeout";
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
import type { SourceLanguageCode } from "../shared/languages";
import {
  defaultSettings,
  type ExtensionSettings,
} from "../shared/settings";
import { createWebpageLifecycleController } from "./webpage-lifecycle-controller";

const TOOLTIP_TRANSLATION_TIMEOUT_MS = 9000;
const CHROME_DIRECT_TRANSLATION_FALLBACK_MS = 1200;
const DIRECT_TRANSLATION_TIMEOUT_MS = 15000;

type StorageChange = {
  newValue?: unknown;
};

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
const lifecycleController = createWebpageLifecycleController({
  getSettings: () => currentSettings,
  lookupModule,
  tooltipView,
});

document.addEventListener("mousemove", lifecycleController.handleMouseMove, { passive: true });
document.addEventListener("mouseleave", lifecycleController.handleMouseLeave, { passive: true });
document.addEventListener("mouseup", lifecycleController.handleSelection, { passive: true });
document.addEventListener("scroll", lifecycleController.clearSelectionAndHideTooltip, { passive: true });
document.addEventListener("click", lifecycleController.handlePageClick, { passive: true });
document.addEventListener("keydown", lifecycleController.handleKeyDown);
extensionApi?.storage.onChanged.addListener(handleStorageChanged);
lookupModule.subscribe(handleLookupModuleEvent);

void refreshSettings();

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
  lifecycleController.hideTooltip();
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
