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
    expect(styles).toContain(".popup-content.today-panel { overflow-y: hidden; padding: 12px; }");
    expect(styles).toContain(".heatmap-month { grid-auto-rows: 36px; }");
    expect(styles).toContain(".year-month-labels span { min-width: 0; white-space: nowrap; }");
  });
});
