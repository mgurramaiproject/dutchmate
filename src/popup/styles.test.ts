import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(path.join(import.meta.dirname, "styles.css"), "utf8");

describe("popup layout", () => {
  it("uses the actual remaining popup height for scrollable content", () => {
    expect(styles).toContain(".popup-shell { display: flex; flex-direction: column;");
    expect(styles).toContain(".popup-content { display: grid; flex: 1 1 auto; min-height: 0;");
    expect(styles).toContain("overflow-x: hidden");
    expect(styles).toContain(".rhythm-day { min-height: 44px;");
    expect(styles).toContain(".lesson-row { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto;");
    expect(styles).toContain("padding: 6px 8px;");
    expect(styles).toContain(".saved-row { display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; gap: 9px; width: 100%; min-width: 0; min-height: 70px; padding: 10px 8px;");
    expect(styles).toContain("transform: translateX(2px)");
    expect(styles).toContain("transition-duration: 0.01ms !important");
    expect(styles).toContain(".month-weekdays { display: grid; grid-template-columns: repeat(7, 1fr);");
    expect(styles).toContain(".heatmap-month .rhythm-day { position: relative; display: grid; min-height: 36px; aspect-ratio: auto; place-items: center;");
    expect(styles).not.toContain(".heatmap .rhythm-day.high { background: var(--black); }");
    expect(styles).toContain(".activity-total { font-family: var(--serif);");
    expect(styles).toContain(".popup-content.today-panel { display: flex; align-items: stretch; overflow-y: auto; padding: 12px; }");
    expect(styles).toContain(".brief-today.today-week { display: flex; flex: 1 1 auto; flex-direction: column; justify-content: space-between; min-height: 100%; }");
    expect(styles).toContain(".calendar-focus { display: flex; flex: 0 0 100%; flex-direction: column; justify-content: space-between; width: 100%; min-height: 100%; }");
    expect(styles).toContain(".today-week .learning-rhythm { min-width: 0; }");
    expect(styles).toContain(".completion-copy { white-space: normal; font-size: .64rem; letter-spacing: -.01em; }");
    expect(styles).toContain(".rhythm-day.is-today { box-shadow: inset 0 0 0 2px var(--black); }");
    expect(styles).toContain(".secondary-actions .secondary-button:hover:not(:disabled), .secondary-actions .secondary-button:focus-visible { border-color: var(--orange);");
    expect(styles).toContain(".heatmap-month { width: 100%; grid-auto-rows: 36px; }");
    expect(styles).toContain(".secondary-actions { display: grid; width: 100%; grid-template-columns: 1fr; gap: 8px; }");
    expect(styles).toContain(".secondary-actions .button { min-height: 48px; font-size: .875rem; }");
    expect(styles).toContain(".button { min-height: 48px; padding: 8px 10px; border: 1px solid var(--black); border-radius: 8px; background: var(--white); color: var(--black); font-size: .875rem;");
    expect(styles).toContain(".year-month-labels span { min-width: 0; white-space: nowrap; }");
  });
});
