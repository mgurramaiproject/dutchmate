// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTooltipViewAdapter } from "./tooltip-view-adapter";

afterEach(() => {
  document.documentElement.innerHTML = "";
});

describe("TooltipViewAdapter", () => {
  it("renders an accessible Context Slip and routes keyboard-operable controls without changing the page", () => {
    const onPractice = vi.fn();
    const onAddFragment = vi.fn();
    const onClose = vi.fn();
    const view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice, onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment, onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose,
    });
    view.showResult({ ok: true, result: { translatedText: "take into account", providerName: "custom-endpoint" } }, 10, 10, { status: "hidden" }, undefined, true);
    const practise = document.querySelector<HTMLButtonElement>("button.context-slip-button");
    expect(practise?.textContent).toBe("Practise this");
    practise?.click();
    expect(onPractice).toHaveBeenCalledOnce();

    view.showMission({ selectedDutch: "houd rekening met", pageContext: "Bekijk en houd rekening met de tijd.", available: ["rekening", "met", "houd"], placed: [] });
    expect(document.querySelector(".context-slip-context")?.textContent).toContain("__________");
    expect(document.querySelector<HTMLButtonElement>(".context-slip-close")?.getAttribute("aria-label")).toBe("Close Context Mission");
    document.querySelector<HTMLButtonElement>("[aria-label='Available words'] button")?.click();
    expect(onAddFragment).toHaveBeenCalledWith(0);
    document.querySelector<HTMLButtonElement>(".context-slip-close")?.click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("keeps post-mission chunk capture explicit and confirmed", () => {
    const onSaveClick = vi.fn();
    const view = createTooltipViewAdapter({
      onSaveClick, onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });

    view.showMission({
      selectedDutch: "goede morgen",
      pageContext: "goede morgen, buur.",
      available: [],
      placed: ["goede", "morgen"],
      result: "got-it",
      capture: {
        saveAction: { status: "ready", label: "Review & save", disabled: false },
        chunkConfirmation: { dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం", context: "goede morgen, buur." },
      },
    });

    expect(document.querySelector(".context-slip-capture")?.textContent).toContain("Save: goede morgen");
    const save = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Review & save");
    save?.click();
    expect(onSaveClick).toHaveBeenCalledOnce();
  });

  it("keeps saved recall helpers hidden until the learner asks to reveal them", () => {
    const onTryFromMemory = vi.fn(); const onTranslateNow = vi.fn(); const onShowMeaning = vi.fn(); const onRecallResult = vi.fn();
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory, onTranslateNow, onShowMeaning, onRecallResult, onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    view.showRecallOffer("goede morgen", 10, 10);
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Try from memory")?.click();
    expect(onTryFromMemory).toHaveBeenCalledOnce();
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Translate now")?.click();
    expect(onTranslateNow).toHaveBeenCalledOnce();

    view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: false, evidenceRecorded: false, expectedRecognitionAttemptCount: 0, token: 1 });
    expect(document.querySelector("#hover-translate-tooltip")?.textContent).not.toContain("good morning");
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Show meaning")?.click();
    expect(onShowMeaning).toHaveBeenCalledOnce();
    view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: true, evidenceRecorded: false, expectedRecognitionAttemptCount: 0, token: 1 });
    expect(document.querySelector("#hover-translate-tooltip")?.textContent).toContain("English: good morning");
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Got it")?.click();
    expect(onRecallResult).toHaveBeenCalledWith("got-it");
  });
});
