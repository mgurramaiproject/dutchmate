import { describe, expect, it } from "vitest";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  MVP_LANGUAGES,
  getMvpLanguageCode,
  getSourceLanguageCode,
} from "./languages";

describe("MVP languages", () => {
  it("supports only English, Dutch, and Telugu", () => {
    expect(MVP_LANGUAGES).toEqual([
      {
        code: "en",
        label: "English",
      },
      {
        code: "nl",
        label: "Dutch",
      },
      {
        code: "te",
        label: "Telugu",
      },
    ]);
  });

  it("falls back for non-MVP language codes", () => {
    expect(getMvpLanguageCode("fr")).toBe(DEFAULT_TARGET_LANGUAGE);
    expect(getMvpLanguageCode("te")).toBe("te");
  });

  it("allows auto source language plus MVP language codes", () => {
    expect(getSourceLanguageCode("auto")).toBe("auto");
    expect(getSourceLanguageCode("nl")).toBe("nl");
    expect(getSourceLanguageCode("fr")).toBe(DEFAULT_SOURCE_LANGUAGE);
  });
});
