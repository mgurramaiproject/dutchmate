import { describe, expect, it } from "vitest";
import { getPopupTabForKey } from "./tab-navigation";

describe("getPopupTabForKey", () => {
  it.each([
    ["today", "ArrowRight", "lessons"],
    ["lessons", "ArrowRight", "saved"],
    ["saved", "ArrowRight", "today"],
    ["today", "ArrowLeft", "saved"],
    ["saved", "Home", "today"],
    ["today", "End", "saved"],
  ] as const)("moves from %s with %s to %s", (current, key, expected) => {
    expect(getPopupTabForKey(current, key)).toBe(expected);
  });

  it("ignores keys that do not navigate the tab list", () => {
    expect(getPopupTabForKey("today", "Enter")).toBeNull();
  });
});
