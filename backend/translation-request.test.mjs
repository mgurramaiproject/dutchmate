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

  it("accepts explicit MVP source languages", () => {
    expect(
      validateTranslationRequest({
        text: "hallo",
        sourceLanguage: "nl",
        targetLanguage: "te",
        context: "hover",
      }),
    ).toBeNull();
  });

  it("rejects unsupported source languages", () => {
    expect(
      validateTranslationRequest({
        text: "bonjour",
        sourceLanguage: "fr",
        targetLanguage: "en",
        context: "hover",
      }),
    ).toBe("sourceLanguage must be auto, en, nl, or te");
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
  it("trims text and normalizes language codes", () => {
    expect(
      normalizeTranslationRequest({
        text: " bonjour ",
        sourceLanguage: " NL ",
        targetLanguage: " EN ",
        context: "selection",
      }),
    ).toEqual({
      text: "bonjour",
      sourceLanguage: "nl",
      targetLanguage: "en",
      context: "selection",
    });
  });
});
