import { describe, expect, it } from "vitest";
import {
  normalizeTranslationRequest,
  validateTranslationRequest,
} from "./translation-request.mjs";

describe("validateTranslationRequest", () => {
  it("accepts a valid hover translation request", () => {
    expect(
      validateTranslationRequest({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).toBeNull();
  });

  it("rejects missing text", () => {
    expect(
      validateTranslationRequest({
        text: "",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "hover",
      }),
    ).toBe("text is required");
  });

  it("rejects unsupported contexts", () => {
    expect(
      validateTranslationRequest({
        text: "bonjour",
        sourceLanguage: "auto",
        targetLanguage: "en",
        context: "popup",
      }),
    ).toBe("context must be hover or selection");
  });
});

describe("normalizeTranslationRequest", () => {
  it("trims text and normalizes target language", () => {
    expect(
      normalizeTranslationRequest({
        text: " bonjour ",
        sourceLanguage: "auto",
        targetLanguage: " EN ",
        context: "selection",
      }),
    ).toEqual({
      text: "bonjour",
      sourceLanguage: "auto",
      targetLanguage: "en",
      context: "selection",
    });
  });
});
