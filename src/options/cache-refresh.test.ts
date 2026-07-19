import { describe, expect, it } from "vitest";

import { shouldRefreshCacheCount } from "./cache-refresh";

describe("shouldRefreshCacheCount", () => {
  it("refreshes when the persistent translation cache changes in local storage", () => {
    expect(
      shouldRefreshCacheCount(
        {
          "dutchmate.translationCache.v1": {
            oldValue: { entries: {} },
            newValue: { entries: { test: {} } },
          },
        },
        "local",
      ),
    ).toBe(true);
  });

  it("ignores unrelated local storage changes", () => {
    expect(
      shouldRefreshCacheCount(
        {
          "dutchmate.savedVocabulary.v1": {
            oldValue: {},
            newValue: {},
          },
        },
        "local",
      ),
    ).toBe(false);
  });

  it("ignores cache changes outside local storage", () => {
    expect(
      shouldRefreshCacheCount(
        {
          "dutchmate.translationCache.v1": {
            oldValue: { entries: {} },
            newValue: { entries: { test: {} } },
          },
        },
        "sync",
      ),
    ).toBe(false);
  });
});
