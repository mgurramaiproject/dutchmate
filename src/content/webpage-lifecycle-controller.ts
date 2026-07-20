import { getHoverRequestKey } from "./hover-request-key";
import { getSelectionTooLongMessage } from "./selection-limit-message";
import type { MvpLanguageCode } from "../shared/languages";
import type { ExtensionSettings } from "../shared/settings";
import type { WebpageLookupModule } from "./webpage-lookup-module";
import type { TooltipViewAdapter } from "./tooltip-view-adapter";
import {
  getHoverLookupInput,
  getSelectionLookupInput,
} from "./webpage-input-adapter";

type TranslationContext = "hover" | "selection";

type ControllerDependencies = {
  getSettings(): ExtensionSettings;
  lookupModule: Pick<
    WebpageLookupModule,
    "beginLookup" | "clear" | "hasActiveSelectionControl" | "shouldKeepVisibleOnMouseLeave"
  >;
  tooltipView: Pick<TooltipViewAdapter, "isTooltipEvent" | "showError" | "hide">;
};

export function createWebpageLifecycleController(dependencies: ControllerDependencies): {
  handleMouseMove(event: MouseEvent): void;
  handleSelection(event: MouseEvent): void;
  handlePageClick(event: MouseEvent): void;
  handleMouseLeave(): void;
  handleKeyDown(event: KeyboardEvent): void;
  clearSelectionAndHideTooltip(): void;
  hideTooltip(): void;
} {
  let hoverTimer: number | undefined;
  let lastHoverKey = "";
  let activeSelectionText = "";

  function hideTooltip(): void {
    dependencies.tooltipView.hide();
    lastHoverKey = "";
  }

  function clearSelectionAndHideTooltip(): void {
    activeSelectionText = "";
    dependencies.lookupModule.clear();
  }

  function hasActiveSelection(): boolean {
    const selectedText = window.getSelection()?.toString().trim() ?? "";

    if (!selectedText) {
      activeSelectionText = "";
      return false;
    }

    return selectedText === activeSelectionText || dependencies.lookupModule.hasActiveSelectionControl();
  }

  async function showTranslation(
    text: string,
    context: TranslationContext,
    x: number,
    y: number,
    sourceLanguageHint?: MvpLanguageCode,
    languageSample = text,
    pageContext?: string | null,
  ): Promise<void> {
    await dependencies.lookupModule.beginLookup({
      text,
      context,
      x,
      y,
      sourceLanguageHint,
      languageSample,
      pageContext,
    });
  }

  return {
    handleMouseMove(event: MouseEvent): void {
      if (dependencies.tooltipView.isTooltipEvent(event)) {
        return;
      }

      window.clearTimeout(hoverTimer);
      const settings = dependencies.getSettings();

      if (!settings.isEnabled || !settings.translateOnHover) {
        dependencies.lookupModule.clear();
        return;
      }

      hoverTimer = window.setTimeout(() => {
        if (hasActiveSelection()) {
          return;
        }

        const hit = getHoverLookupInput(
          event.clientX,
          event.clientY,
          settings.hoverTranslationMode,
        );

        if (!hit) {
          dependencies.lookupModule.clear();
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
        void showTranslation(
          hit.text,
          "hover",
          hit.x,
          hit.y,
          hit.sourceLanguageHint,
          hit.languageSample,
          hit.pageContext,
        );
      }, settings.hoverDelayMs);
    },

    handleSelection(event: MouseEvent): void {
      if (dependencies.tooltipView.isTooltipEvent(event)) {
        return;
      }

      window.clearTimeout(hoverTimer);
      const settings = dependencies.getSettings();

      if (!settings.isEnabled || !settings.translateOnSelection) {
        return;
      }

      const selection = getSelectionLookupInput(settings.maxSelectionLength);
      if (selection.status === "none") {
        return;
      }

      if (selection.status === "too-long") {
        activeSelectionText = selection.text;
        dependencies.tooltipView.showError(
          getSelectionTooLongMessage(settings.maxSelectionLength),
          selection.x,
          selection.y,
        );
        return;
      }

      activeSelectionText = selection.text;
      void showTranslation(
        selection.text,
        "selection",
        selection.x,
        selection.y,
        selection.sourceLanguageHint,
        selection.languageSample,
        selection.pageContext,
      );
    },

    handlePageClick(event: MouseEvent): void {
      if (dependencies.tooltipView.isTooltipEvent(event)) {
        return;
      }

      if (hasActiveSelection()) {
        return;
      }

      clearSelectionAndHideTooltip();
    },

    handleMouseLeave(): void {
      if (dependencies.lookupModule.shouldKeepVisibleOnMouseLeave()) {
        return;
      }

      dependencies.lookupModule.clear();
    },

    handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        clearSelectionAndHideTooltip();
      }
    },

    clearSelectionAndHideTooltip,
    hideTooltip,
  };
}
