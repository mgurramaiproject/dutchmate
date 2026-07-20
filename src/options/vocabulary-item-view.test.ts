import { describe, expect, it } from "vitest";
import { getVocabularyItemView } from "./vocabulary-item-view";

describe("getVocabularyItemView", () => {
  it("renders a meaningful chunk without word-only assumptions", () => {
    expect(getVocabularyItemView({ dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం", sources: [{ type: "webpage", addedAt: 1 }] } as never)).toEqual({ dutch: "goede morgen", english: "good morning", telugu: "శుభోదయం", source: "webpage" });
  });
});
