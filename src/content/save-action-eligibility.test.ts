import { describe, expect, it } from "vitest";
import { getEligibleSaveCandidates } from "./save-action-eligibility";
import type { RuntimeSaveVocabularyRequest } from "./runtime-vocabulary-client";

const candidate: RuntimeSaveVocabularyRequest = {
  text: "huis",
  sourceLanguage: "auto",
  detectedSourceLanguage: "nl",
  targetLanguage: "en",
  translatedText: "house",
  providerName: "custom-endpoint",
};

describe("getEligibleSaveCandidates", () => {
  it("keeps save candidates for a successful selected single-word lookup", () => {
    expect(getEligibleSaveCandidates("huis", "selection", [candidate])).toEqual([
      candidate,
    ]);
  });

  it("does not keep save candidates for a hover lookup", () => {
    expect(getEligibleSaveCandidates("huis", "hover", [candidate])).toEqual([]);
  });

  it("does not keep save candidates for a selected phrase", () => {
    expect(getEligibleSaveCandidates("het huis", "selection", [candidate])).toEqual([]);
  });
});
