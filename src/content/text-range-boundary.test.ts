import { describe, expect, it } from "vitest";
import { isValidTextRangeBoundary } from "./text-range-boundary";

const textNode = { nodeType: 3 };
const elementNode = { nodeType: 1 };

describe("isValidTextRangeBoundary", () => {
  it("accepts text-node ranges inside the text length", () => {
    expect(isValidTextRangeBoundary(textNode, "Nederland", 0, 9)).toBe(true);
    expect(isValidTextRangeBoundary(textNode, "Nederland", 2, 5)).toBe(true);
  });

  it("rejects element nodes because their offsets are child indexes, not text offsets", () => {
    expect(isValidTextRangeBoundary(elementNode, "Nederland", 0, 9)).toBe(false);
  });

  it("rejects text-node ranges outside the text length", () => {
    expect(isValidTextRangeBoundary(textNode, "huis", 0, 10)).toBe(false);
    expect(isValidTextRangeBoundary(textNode, "huis", -1, 2)).toBe(false);
    expect(isValidTextRangeBoundary(textNode, "huis", 3, 2)).toBe(false);
  });
});
