import { describe, expect, it } from "vitest";
import { isLearningMessage, LEARNING_CONTRAST_RESULT_MESSAGE } from "./messages";

describe("contrast learning messages", () => {
  it("accepts a typed controlled result with its reviewed misconception code", () => {
    expect(isLearningMessage({
      type: LEARNING_CONTRAST_RESULT_MESSAGE,
      payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "ik werk", expectedEvidenceRevision: 0, misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" },
    })).toBe(true);
  });

  it("accepts a Daily Five contrast result only with a checked or explicit non-success outcome", () => {
    expect(isLearningMessage({ type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", answer: "Morgen maak ik een afspraak.", expectedEvidenceRevision: 2, dailyFive: true } })).toBe(true);
    expect(isLearningMessage({ type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", outcome: "skip", expectedEvidenceRevision: 2, dailyFive: true } })).toBe(true);
    expect(isLearningMessage({ type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", outcome: "skip", expectedEvidenceRevision: 2 } })).toBe(false);
  });

  it("rejects unknown codes, packs, exercises, versions, outcomes, and revisions", () => {
    const valid = { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "ik werk", expectedEvidenceRevision: 0 } };
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, misconceptionCode: "UNKNOWN_CODE" } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, packId: "other.pack" } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, exerciseId: "arbitrary-exercise" } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, contentVersion: 2 } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, outcome: "maybe" } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, expectedEvidenceRevision: -1 } })).toBe(false);
  });
});
