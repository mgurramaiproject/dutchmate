import { describe, expect, it } from "vitest";
import type { TranslationRequest } from "./provider";
import { normalizeCacheText, shouldPersistTranslation } from "./persistent-cache-policy";

const selectionRequest: TranslationRequest = {
  text: "huis",
  sourceLanguage: "nl",
  targetLanguage: "en",
  context: "selection",
};

describe("persistent cache policy", () => {
  it("persists a single selected word", () => {
    expect(shouldPersistTranslation(selectionRequest)).toBe(true);
  });

  it("persists a selected word after trimming whitespace", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        text: " huis ",
      }),
    ).toBe(true);
  });

  it("persists hovered words by default", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        context: "hover",
      }),
    ).toBe(true);
  });

  it("can disable selected-word caching independently", () => {
    expect(shouldPersistTranslation(selectionRequest, undefined, { cacheSelectedWords: false })).toBe(false);
  });

  it("can disable hovered-word caching independently", () => {
    expect(
      shouldPersistTranslation(
        { ...selectionRequest, context: "hover" },
        undefined,
        { cacheHoveredWords: false },
      ),
    ).toBe(false);
  });

  it("persists hovered single words when hover caching is enabled", () => {
    expect(
      shouldPersistTranslation(
        {
          ...selectionRequest,
          context: "hover",
        },
        undefined,
        { cacheHoveredWords: true },
      ),
    ).toBe(true);
  });

  it("does not persist hovered phrases when hover caching is enabled", () => {
    expect(
      shouldPersistTranslation(
        {
          ...selectionRequest,
          context: "hover",
          text: "het huis",
        },
        undefined,
        { cacheHoveredWords: true },
      ),
    ).toBe(false);
  });

  it("does not persist selected phrases", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        text: "het huis",
      }),
    ).toBe(false);
  });

  it("does not persist selected sentences", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        text: "Het huis is groot.",
      }),
    ).toBe(false);
  });

  it("does not persist empty text", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        text: "   ",
      }),
    ).toBe(false);
  });

  it("does not persist overlong words", () => {
    expect(
      shouldPersistTranslation({
        ...selectionRequest,
        text: "a".repeat(31),
      }),
    ).toBe(false);
  });

  it("normalizes repeated whitespace without removing word boundaries", () => {
    expect(normalizeCacheText(" het\nhuis ")).toBe("het huis");
  });
});
