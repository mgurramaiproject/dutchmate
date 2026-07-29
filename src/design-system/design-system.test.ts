import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const designSystemDirectory = import.meta.dirname;

describe("DutchMate design system foundation", () => {
  it("keeps semantic tokens, shared primitives, focus, and reduced motion available", () => {
    const tokens = readFileSync(path.join(designSystemDirectory, "dutchmate-tokens.css"), "utf8");
    const primitives = readFileSync(path.join(designSystemDirectory, "primitives.css"), "utf8");

    expect(tokens).toContain("--dm-brand-orange: #ff6b00");
    expect(tokens).toContain("--dm-font-ui:");
    expect(tokens).toContain("--dm-target-min: 2.75rem");
    expect(tokens).toContain(":focus-visible");
    expect(tokens).toContain("prefers-reduced-motion: reduce");
    expect(primitives).toContain(".dm-button");
    expect(primitives).toContain(".dm-card");
    expect(primitives).toContain(".dm-field");
  });
});
