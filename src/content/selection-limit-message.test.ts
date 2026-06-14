import { describe, expect, it } from "vitest";
import { getSelectionTooLongMessage } from "./selection-limit-message";

describe("getSelectionTooLongMessage", () => {
  it("includes the configured selection length limit", () => {
    expect(getSelectionTooLongMessage(150)).toBe(
      "Selection is too long. Try 150 characters or fewer.",
    );
  });
});
