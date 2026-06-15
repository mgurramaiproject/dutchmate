import { describe, expect, it } from "vitest";
import { getTranslationErrorMessage } from "./translation-error-message";

describe("getTranslationErrorMessage", () => {
  it("maps provider rate limits to a friendly user message", () => {
    expect(getTranslationErrorMessage(new Error("Provider returned 429"))).toBe(
      "Translation is temporarily busy. Try again soon.",
    );
  });

  it("keeps other provider errors debuggable", () => {
    expect(getTranslationErrorMessage(new Error("Provider returned 503"))).toBe(
      "Translation failed: Provider returned 503",
    );
  });

  it("handles unknown failures", () => {
    expect(getTranslationErrorMessage("boom")).toBe("Translation failed: Unknown error");
  });
});
