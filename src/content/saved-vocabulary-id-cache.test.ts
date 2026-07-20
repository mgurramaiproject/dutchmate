import { describe, expect, it } from "vitest";
import { applySavedVocabularyStorageChange } from "./saved-vocabulary-id-cache";

describe("applySavedVocabularyStorageChange", () => {
  it("invalidates cached learning item ids when the canonical learning record changes", () => {
    const cachedIds = new Set(["nl\u001fhuis"]);

    expect(
      applySavedVocabularyStorageChange(
        cachedIds,
        {
          "dutchmate.learningRecord.v2": {
            newValue: {
              items: {},
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
