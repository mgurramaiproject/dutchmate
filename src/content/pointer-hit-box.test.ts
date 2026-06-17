import { describe, expect, it } from "vitest";
import { isPointInsideVisibleBox, type PointerHitBox } from "./pointer-hit-box";

const box: PointerHitBox = {
  left: 10,
  right: 30,
  top: 20,
  bottom: 40,
  width: 20,
  height: 20,
};

describe("isPointInsideVisibleBox", () => {
  it("accepts points inside the visible box", () => {
    expect(isPointInsideVisibleBox(20, 30, box)).toBe(true);
  });

  it("accepts points on the visible box edge", () => {
    expect(isPointInsideVisibleBox(10, 20, box)).toBe(true);
    expect(isPointInsideVisibleBox(30, 40, box)).toBe(true);
  });

  it("rejects points outside the visible box", () => {
    expect(isPointInsideVisibleBox(9, 30, box)).toBe(false);
    expect(isPointInsideVisibleBox(31, 30, box)).toBe(false);
    expect(isPointInsideVisibleBox(20, 19, box)).toBe(false);
    expect(isPointInsideVisibleBox(20, 41, box)).toBe(false);
  });

  it("rejects invisible boxes", () => {
    expect(isPointInsideVisibleBox(20, 30, { ...box, width: 0 })).toBe(false);
    expect(isPointInsideVisibleBox(20, 30, { ...box, height: 0 })).toBe(false);
  });
});
