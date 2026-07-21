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
    expect(styles).toContain(".lesson-action { grid-column: 3; grid-row: span 2; min-width: 54px; min-height: 44px;");
  });
});
