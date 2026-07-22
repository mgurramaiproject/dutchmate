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
      onSaveClick: vi.fn(), onPractice, onAddFragment, onRemoveFragment: vi.fn(), onReset: vi.fn(), onCheck: vi.fn(), onReplay: vi.fn(), onClose,
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
});
