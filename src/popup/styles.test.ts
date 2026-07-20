import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(path.join(import.meta.dirname, "styles.css"), "utf8");

describe("popup layout", () => {
  it("uses the actual remaining popup height for scrollable content", () => {
    expect(styles).toContain(".popup-shell { display: flex; flex-direction: column;");
    expect(styles).toContain(".popup-content { display: grid; flex: 1 1 auto; min-height: 0;");
  });
});
