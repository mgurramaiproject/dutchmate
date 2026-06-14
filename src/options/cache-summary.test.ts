import { describe, expect, it } from "vitest";
import { getCachedWordCount } from "./cache-summary";

describe("getCachedWordCount", () => {
  it("counts unique cached source words", () => {
    expect(
      getCachedWordCount({
        entries: {
          "huis:nl:en": {
            request: {
              text: "huis",
            },
          },
          "boom:nl:en": {
            request: {
              text: "boom",
            },
          },
        },
      }),
    ).toBe(2);
  });

  it("counts dual-target translations for one selected source word once", () => {
    expect(
      getCachedWordCount({
        entries: {
          "huis:nl:en": {
            request: {
              text: "huis",
            },
          },
          "huis:nl:te": {
            request: {
              text: "huis",
            },
          },
        },
      }),
    ).toBe(1);
  });

  it("normalizes source words before counting them", () => {
    expect(
      getCachedWordCount({
        entries: {
          "huis:nl:en": {
            request: {
              text: " Huis ",
            },
          },
          "huis:nl:te": {
            request: {
              text: "huis",
            },
          },
        },
      }),
    ).toBe(1);
  });

  it("returns zero for missing or invalid cache data", () => {
    expect(getCachedWordCount(undefined)).toBe(0);
    expect(getCachedWordCount({})).toBe(0);
    expect(getCachedWordCount({ entries: null })).toBe(0);
    expect(getCachedWordCount({ entries: { invalid: {} } })).toBe(0);
  });
});
