import { describe, expect, it } from "vitest";
import { getHoverRequestKey } from "./hover-request-key";

describe("getHoverRequestKey", () => {
  it("keeps the same key for the same word even when tooltip coordinates change", () => {
    const firstKey = getHoverRequestKey({
      text: "huis",
      languageSample: "Het huis is groot.",
      sourceLanguageHint: "nl",
      start: 4,
      end: 8,
    });
    const secondKey = getHoverRequestKey({
      text: "huis",
      languageSample: "Het huis is groot.",
      sourceLanguageHint: "nl",
      start: 4,
      end: 8,
    });

    expect(secondKey).toBe(firstKey);
  });

  it("changes the key for the same word at a different text position", () => {
    const firstKey = getHoverRequestKey({
      text: "huis",
      languageSample: "huis naast huis",
      start: 0,
      end: 4,
    });
    const secondKey = getHoverRequestKey({
      text: "huis",
      languageSample: "huis naast huis",
      start: 11,
      end: 15,
    });

    expect(secondKey).not.toBe(firstKey);
  });
});
