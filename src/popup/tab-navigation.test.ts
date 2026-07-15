import { describe, expect, it } from "vitest";
import { getPopupTabForKey } from "./tab-navigation";

describe("getPopupTabForKey", () => {
  it.each([
    ["learn", "ArrowRight", "settings"],
    ["settings", "ArrowRight", "learn"],
    ["learn", "ArrowLeft", "settings"],
    ["settings", "ArrowLeft", "learn"],
    ["settings", "Home", "learn"],
    ["learn", "End", "settings"],
  ] as const)("moves from %s with %s to %s", (current, key, expected) => {
    expect(getPopupTabForKey(current, key)).toBe(expected);
  });

  it("ignores keys that do not navigate the tab list", () => {
    expect(getPopupTabForKey("learn", "Enter")).toBeNull();
  });
});
