// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTooltipViewAdapter } from "./tooltip-view-adapter";

afterEach(() => {
  document.documentElement.innerHTML = "";
});

describe("TooltipViewAdapter", () => {
  it("makes the initial translating state explicit and readable", () => {
    const view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });

    view.showLoading("Translating...", 10, 10);

    const tooltip = document.querySelector<HTMLDivElement>("#hover-translate-tooltip");
    const styles = document.querySelector("style")?.textContent;
    expect(tooltip?.hidden).toBe(false);
    expect(tooltip?.dataset.state).toBe("loading");
    expect(tooltip?.textContent).toBe("Translating...");
    expect(styles).toContain('border-left: 4px solid #ff6f00');
    expect(styles).toContain('background: #fff');
    expect(styles).toContain('color: #000');
    expect(styles).not.toContain('#172554');
    expect(styles).not.toContain('#7f1d1d');
  });

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
    expect(document.querySelector("#hover-translate-tooltip")?.getAttribute("role")).toBeNull();
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

    expect(document.querySelector(".context-slip-capture")?.textContent).toContain("Keep this phrase");
    expect(document.querySelector(".context-slip-detail[data-label='English']")?.textContent).toContain("good morning");
    expect(document.querySelector(".context-slip-detail[data-label='Telugu']")?.textContent).toContain("శుభోదయం");
    const save = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Review & save");
    save?.click();
    expect(onSaveClick).toHaveBeenCalledOnce();
  });

  it("uses the structured phrase capture in the initial translation tooltip", () => {
    const view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });

    view.showResult(
      { ok: true, result: { translatedText: "good morning", providerName: "custom-endpoint" } },
      10,
      10,
      { status: "hidden" },
      { dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం", context: "Goede morgen, buur." },
    );

    expect(document.querySelector(".context-slip-capture")?.textContent).toContain("Keep this phrase");
    expect(document.querySelector(".context-slip-detail[data-label='Dutch']")?.textContent).toContain("goede morgen");
    expect(document.querySelector(".context-slip-detail[data-label='Context']")?.textContent).toContain("Goede morgen, buur.");
    expect(document.querySelector("#hover-translate-tooltip")?.textContent).not.toContain("Save:");
  });

  it("gives multi-target translations a clear hierarchy and Telugu phonetic helper", () => {
    const view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });

    view.showResult(
      { ok: true, result: { translatedText: "English: amended\nTelugu: సవరించబడింది", providerName: "multi-target" } },
      10,
      10,
      { status: "ready", label: "Save", disabled: false },
    );

    expect(document.querySelectorAll(".hover-translate-row")).toHaveLength(2);
    expect(document.querySelector(".hover-translate-label")?.textContent).toBe("English:");
    expect(document.querySelector(".hover-translate-phonetics")?.textContent).toContain("Say it:");
    expect(document.querySelector<HTMLButtonElement>(".hover-translate-save")?.textContent).toBe("Save");
  });

  it("does not offer Save when the translation response failed", () => {
    const view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });

    view.showResult(
      { ok: false, error: "Translation request timed out before the extension backend worker responded." },
      10,
      10,
      { status: "ready", label: "Save", disabled: false },
    );

    expect(document.querySelector("#hover-translate-tooltip")?.textContent).toContain("Translation request timed out");
    expect(document.querySelector(".hover-translate-save")).toBeNull();
  });

  it("disables reconstruction mutations while recall evidence is saving", () => {
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    view.showMission({ selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", available: ["morgen"], placed: ["goede"], evidence: { itemId: "nl\u001fgoede morgen", dimension: "recall", expectedAttemptCount: 0, token: 1, result: "got-it", submitting: true } });
    expect(Array.from(document.querySelectorAll<HTMLButtonElement>("button")).filter((button) => button.textContent !== "×").every((button) => button.disabled)).toBe(true);
  });

  it("keeps saved recall helpers hidden until the learner asks to reveal them", () => {
    const onTryFromMemory = vi.fn(); const onTranslateNow = vi.fn(); const onShowMeaning = vi.fn(); const onRecallResult = vi.fn();
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory, onTranslateNow, onShowMeaning, onRecallResult, onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    view.showRecallOffer("goede morgen", "Goede morgen, buur.", 10, 10);
    expect(document.querySelector(".context-slip-context")?.textContent).toBe("Goede morgen, buur.");
    expect(document.querySelector(".context-slip-copy")?.textContent).toContain("Try its meaning");
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Try from memory")?.click();
    expect(onTryFromMemory).toHaveBeenCalledOnce();
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Translate now")?.click();
    expect(onTranslateNow).toHaveBeenCalledOnce();

    view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: false, evidenceRecorded: false, dimension: "recognition", expectedAttemptCount: 0, token: 1 });
    expect(document.querySelector(".context-slip-title")?.textContent).toBe("goede morgen");
    expect(document.querySelector(".context-slip-prompt")?.textContent).toBe("What does this mean here?");
    expect(document.querySelector(".context-slip-hidden-answer")?.textContent).toContain("before you reveal it");
    expect(document.querySelector("#hover-translate-tooltip")?.textContent).not.toContain("good morning");
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Show meaning")?.click();
    expect(onShowMeaning).toHaveBeenCalledOnce();
    view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: true, evidenceRecorded: false, dimension: "recognition", expectedAttemptCount: 0, token: 1 });
    expect(document.querySelector("#hover-translate-tooltip")?.textContent).toContain("English: good morning");
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Got it")?.click();
    expect(onRecallResult).toHaveBeenCalledWith("got-it");
    view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: true, result: "got-it", evidenceRecorded: true, dimension: "recognition", expectedAttemptCount: 0, token: 1 });
    expect(Array.from(document.querySelectorAll("[role='status']")).some((element) => element.textContent === "Got it")).toBe(true);
  });

  it("returns focus to the initiating repeat action when a mission closes", () => {
    const pageControl = document.createElement("button"); pageControl.textContent = "Read more"; document.body.append(pageControl); pageControl.focus();
    let view: ReturnType<typeof createTooltipViewAdapter>;
    view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: () => view.showRecallMission({ itemId: "nl\u001fgoede morgen", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", english: "good morning", telugu: "శుభోదయం", revealed: false, evidenceRecorded: false, dimension: "recognition", expectedAttemptCount: 0, token: 1 }), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    view.showRecallOffer("goede morgen", "Goede morgen, buur.", 10, 10);
    const tryFromMemory = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Try from memory")!;
    tryFromMemory.click();
    view.hide();
    expect(document.activeElement).toBe(pageControl);
  });

  it("keeps focus inside the card when mission feedback rerenders", () => {
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    const mission = { selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", available: ["morgen"], placed: ["goede"] };
    view.showMission(mission);
    const reset = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Reset")!;
    reset.focus();
    view.showMission(mission);
    expect(document.activeElement).toHaveProperty("textContent", "Reset");
  });

  it("keeps focus on the moved fragment after reconstruction rerenders", () => {
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });
    view.showMission({ selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", available: ["goede", "morgen"], placed: [] });
    document.querySelector<HTMLButtonElement>("[aria-label='Available words'] button")!.focus();
    view.showMission({ selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", available: ["morgen"], placed: ["goede"] });
    expect(document.activeElement).toBe(document.querySelector("[aria-label='Your answer'] button"));
  });

  it("keeps a Reset click inside the Context Slip when it rerenders", () => {
    let pageClickCount = 0;
    let view: ReturnType<typeof createTooltipViewAdapter>;
    const mission = { selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", available: ["morgen"], placed: ["goede"] };
    view = createTooltipViewAdapter({
      onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: () => view.showMission({ ...mission, available: ["goede", "morgen"], placed: [] }), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn(),
    });
    document.addEventListener("click", (event) => {
      if (!view.isTooltipEvent(event)) pageClickCount += 1;
    }, { once: true });

    view.showMission(mission);
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Reset")?.click();

    expect(pageClickCount).toBe(0);
    expect(document.querySelector(".context-slip-status")?.textContent).toBe("0 of 2 words placed");
  });

  it("states why a completed reconstruction is correct", () => {
    const view = createTooltipViewAdapter({ onSaveClick: vi.fn(), onPractice: vi.fn(), onTryFromMemory: vi.fn(), onTranslateNow: vi.fn(), onShowMeaning: vi.fn(), onRecallResult: vi.fn(), onReplayRecall: vi.fn(), onAddFragment: vi.fn(), onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose: vi.fn() });

    view.showMission({ selectedDutch: "houd rekening met", pageContext: "Houd rekening met de tijd.", available: [], placed: ["houd", "rekening", "met"], result: "got-it" });

    expect(document.querySelector(".context-slip-title")?.textContent).toBe("Correct");
    expect(document.querySelector(".context-slip-result-title")?.textContent).toBe("Correct");
    expect(document.querySelector(".context-slip-result-copy")?.textContent).toBe("Your word order matches the original sentence.");

    view.showMission({ selectedDutch: "houd rekening met", pageContext: "Houd rekening met de tijd.", available: [], placed: ["rekening", "houd", "met"], result: "again" });
    expect(document.querySelector(".context-slip-title")?.textContent).toBe("Try again");
    expect(document.querySelector(".context-slip-result-copy")?.textContent).toBe("The right order is: houd rekening met");
  });
});
