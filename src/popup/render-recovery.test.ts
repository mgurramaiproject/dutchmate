// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { renderWithRecovery } from "./render-recovery";

describe("popup render recovery", () => {
  it("leaves a visible recovery action when a screen renderer throws", () => {
    const content = document.createElement("main");
    const recovery = document.createElement("button");
    recovery.type = "button";
    recovery.textContent = "Return to Today";

    renderWithRecovery(content, () => {
      throw new Error("render failed");
    }, () => recovery);

    expect(content.textContent).toBe("Return to Today");
    expect(content.querySelector("button")?.textContent).toBe("Return to Today");
  });
});
