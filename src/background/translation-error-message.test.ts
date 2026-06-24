import { describe, expect, it } from "vitest";
import { getTranslationErrorMessage } from "./translation-error-message";

describe("getTranslationErrorMessage", () => {
  it("maps provider rate limits to a friendly user message", () => {
    expect(getTranslationErrorMessage(new Error("Provider returned 429"))).toBe(
      "Translation is temporarily busy. Try again soon.",
    );
  });

  it("maps provider timeouts to a clear backend timeout message", () => {
    expect(getTranslationErrorMessage(new Error("Provider request timed out"))).toBe(
      "Translation request timed out before the backend responded.",
    );
  });

  it("maps backend guardrails to a friendly busy message", () => {
    expect(getTranslationErrorMessage(new Error("Too many translation requests. Try again soon."))).toBe(
      "Translation is temporarily busy. Try again soon.",
    );
    expect(
      getTranslationErrorMessage(new Error("Translation backend is busy. Try again soon.")),
    ).toBe("Translation is temporarily busy. Try again soon.");
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
