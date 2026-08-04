// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createWebpageLifecycleController } from "./webpage-lifecycle-controller";

const settings = { isEnabled: true, translateOnHover: true, translateOnSelection: true, cacheHoveredWords: true, cacheSelectedWords: true, hoverTranslationMode: "word", hoverDelayMs: 450, maxSelectionLength: 150, sourceLanguage: "auto", targetLanguage: "en", translateToOtherMvpLanguages: true, learningLanguage: "nl", nativeLanguage: "te", bridgeLanguage: "en", autoSaveSelectedWords: false, showExampleSentence: true, dailyReviewBadge: true, providerEndpoint: "https://example.test/translate", providerApiKey: "" } as const;

describe("WebpageLifecycleController", () => {
  it("keeps the selected translation visible when hover translation is disabled", () => {
    let selectionActive = false;
    const clear = vi.fn(() => {
      selectionActive = false;
    });
    document.body.textContent = "huis";
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(document.body.firstChild!);
    selection.removeAllRanges();
    selection.addRange(range);
    const controller = createWebpageLifecycleController({
      getSettings: () => ({ ...settings, translateOnHover: false }),
      lookupModule: {
        beginLookup: vi.fn(async () => {
          selectionActive = true;
        }),
        clear,
        hasActiveMission: vi.fn(() => false),
        hasActiveSelectionControl: vi.fn(() => selectionActive),
        shouldKeepVisibleOnMouseLeave: vi.fn(() => selectionActive),
      },
      tooltipView: { isTooltipEvent: vi.fn(() => false), showError: vi.fn(), hide: vi.fn() },
    });

    controller.handleSelection(new MouseEvent("mouseup"));
    controller.handleMouseMove(new MouseEvent("mousemove"));

    expect(clear).not.toHaveBeenCalled();
  });

  it("does not clear the page lookup just because hover translation is disabled", () => {
    const clear = vi.fn();
    const controller = createWebpageLifecycleController({
      getSettings: () => ({ ...settings, translateOnHover: false }),
      lookupModule: {
        beginLookup: vi.fn(),
        clear,
        hasActiveMission: vi.fn(() => false),
        hasActiveSelectionControl: vi.fn(() => false),
        shouldKeepVisibleOnMouseLeave: vi.fn(() => false),
      },
      tooltipView: { isTooltipEvent: vi.fn(() => false), showError: vi.fn(), hide: vi.fn() },
    });

    controller.handleMouseMove(new MouseEvent("mousemove"));

    expect(clear).not.toHaveBeenCalled();
  });

  it("does not clear a hover tooltip while the pointer enters the tooltip", () => {
    const clear = vi.fn();
    const isTooltipEvent = vi.fn((event: Event) => event.type === "mouseleave");
    const controller = createWebpageLifecycleController({
      getSettings: () => settings,
      lookupModule: { beginLookup: vi.fn(), clear, hasActiveMission: vi.fn(() => false), hasActiveSelectionControl: vi.fn(() => false), shouldKeepVisibleOnMouseLeave: vi.fn(() => false) },
      tooltipView: { isTooltipEvent, showError: vi.fn(), hide: vi.fn() },
    });

    controller.handleMouseLeave(new MouseEvent("mouseleave"));

    expect(isTooltipEvent).toHaveBeenCalledOnce();
    expect(clear).not.toHaveBeenCalled();
  });

  it("invalidates Context Missions on Escape and page navigation", () => {
    const clear = vi.fn();
    const controller = createWebpageLifecycleController({
      getSettings: () => settings,
      lookupModule: { beginLookup: vi.fn(), clear, hasActiveMission: vi.fn(() => true), hasActiveSelectionControl: vi.fn(() => false), shouldKeepVisibleOnMouseLeave: vi.fn(() => true) },
      tooltipView: { isTooltipEvent: vi.fn(() => false), showError: vi.fn(), hide: vi.fn() },
    });

    controller.handleKeyDown(new KeyboardEvent("keydown", { key: "Escape" }));
    controller.handlePageHide();

    expect(clear).toHaveBeenCalledTimes(2);
  });

  it("dismisses an open selection tooltip on the next outside click", () => {
    const clear = vi.fn();
    const beginLookup = vi.fn();
    document.body.textContent = "goede morgen";
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(document.body.firstChild!);
    selection.removeAllRanges();
    selection.addRange(range);
    const controller = createWebpageLifecycleController({
      getSettings: () => settings,
      lookupModule: { beginLookup, clear, hasActiveMission: vi.fn(() => true), hasActiveSelectionControl: vi.fn(() => false), shouldKeepVisibleOnMouseLeave: vi.fn(() => true) },
      tooltipView: { isTooltipEvent: vi.fn(() => false), showError: vi.fn(), hide: vi.fn() },
    });

    controller.handleSelection(new MouseEvent("mouseup"));
    controller.handlePageClick(new MouseEvent("click"));
    expect(clear).not.toHaveBeenCalled();

    controller.handlePageClick(new MouseEvent("click"));
    expect(clear).toHaveBeenCalledOnce();
    expect(beginLookup).toHaveBeenCalledOnce();
  });
});
