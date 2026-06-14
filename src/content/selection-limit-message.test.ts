import { describe, expect, it } from "vitest";
import { getSelectionTooLongMessage } from "./selection-limit-message";

describe("getSelectionTooLongMessage", () => {
  it("includes the configured selection length limit", () => {
    expect(getSelectionTooLongMessage(600)).toBe(
      "Selection is too long. Try 600 characters or fewer.",
    );
  });
});
