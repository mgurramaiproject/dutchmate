import { describe, expect, it } from "vitest";
import { applySavedVocabularyStorageChange } from "./saved-vocabulary-id-cache";

describe("applySavedVocabularyStorageChange", () => {
  it("invalidates cached saved vocabulary ids when local saved vocabulary changes", () => {
    const cachedIds = new Set(["nl\u001fhuis\u001fen"]);

    expect(
      applySavedVocabularyStorageChange(
        cachedIds,
        {
          "dutchmate.savedVocabulary.v1": {
            newValue: {
              entries: {},
            },
          },
        },
        "local",
      ),
    ).toBeUndefined();
  });

  it("keeps cached saved vocabulary ids for sync setting changes", () => {
    const cachedIds = new Set(["nl\u001fhuis\u001fen"]);

    expect(
      applySavedVocabularyStorageChange(
        cachedIds,
        {
          isEnabled: {
            newValue: false,
          },
        },
        "sync",
      ),
    ).toBe(cachedIds);
  });
});
