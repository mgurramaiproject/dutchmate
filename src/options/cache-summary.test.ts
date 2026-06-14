import { describe, expect, it } from "vitest";
import { getCachedWordCount } from "./cache-summary";

describe("getCachedWordCount", () => {
  it("counts cached entries", () => {
    expect(
      getCachedWordCount({
        entries: {
          huis: {},
          boom: {},
        },
      }),
    ).toBe(2);
  });

  it("returns zero for missing or invalid cache data", () => {
    expect(getCachedWordCount(undefined)).toBe(0);
    expect(getCachedWordCount({})).toBe(0);
    expect(getCachedWordCount({ entries: null })).toBe(0);
  });
});
