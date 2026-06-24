import { describe, expect, it } from "vitest";

import { shouldRefreshSavedVocabulary } from "./saved-vocabulary-refresh";

describe("shouldRefreshSavedVocabulary", () => {
  it("refreshes when saved vocabulary changes in local storage", () => {
    expect(
      shouldRefreshSavedVocabulary(
        {
          "dutchmate.savedVocabulary.v1": {
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
      shouldRefreshSavedVocabulary(
        {
          "dutchmate.translationCache.v1": {
            oldValue: {},
            newValue: {},
          },
        },
        "local",
      ),
    ).toBe(false);
  });

  it("ignores saved vocabulary changes outside local storage", () => {
    expect(
      shouldRefreshSavedVocabulary(
        {
          "dutchmate.savedVocabulary.v1": {
            oldValue: { entries: {} },
            newValue: { entries: { test: {} } },
          },
        },
        "sync",
      ),
    ).toBe(false);
  });
});
