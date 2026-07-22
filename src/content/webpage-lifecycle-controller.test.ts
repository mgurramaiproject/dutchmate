// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createWebpageLifecycleController } from "./webpage-lifecycle-controller";

const settings = { isEnabled: true, translateOnHover: true, translateOnSelection: true, cacheHoveredWords: true, cacheSelectedWords: true, hoverTranslationMode: "word", hoverDelayMs: 450, maxSelectionLength: 150, sourceLanguage: "auto", targetLanguage: "en", translateToOtherMvpLanguages: true, learningLanguage: "nl", nativeLanguage: "te", bridgeLanguage: "en", autoSaveSelectedWords: false, showExampleSentence: true, dailyReviewBadge: true, providerEndpoint: "https://example.test/translate", providerApiKey: "" } as const;

describe("WebpageLifecycleController", () => {
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
});
