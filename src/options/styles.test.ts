import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(path.join(import.meta.dirname, "styles.css"), "utf8");

describe("Options visual system", () => {
  it("keeps table body labels on the paper surface instead of applying header styling", () => {
    expect(styles).toContain(".settings-matrix thead th, .vocabulary-list thead th { background: var(--dm-ink-strong); color: var(--dm-paper-raised); }");
    expect(styles).not.toContain(".settings-matrix th, .vocabulary-list th { background: var(--dm-ink-strong); color: var(--dm-paper-raised); }");
  });
});
