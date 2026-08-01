import { describe, expect, it } from "vitest";
import { isLearningMessage, LEARNING_CONTRAST_RESULT_MESSAGE, LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE, LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE, LEARNING_VERB_JOURNEY_RESULT_MESSAGE } from "./messages";

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

  it("accepts a Verb Journey completion event with a journey identity", () => {
    expect(isLearningMessage({ type: LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE, payload: { journeyId: "journey.werken.vtt-completed" } })).toBe(true);
    expect(isLearningMessage({ type: LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE, payload: { journeyId: 123 } })).toBe(false);
  });

  it("accepts authored zijn results and rejects a cross-pack version", () => {
    const valid = { type: LEARNING_VERB_JOURNEY_RESULT_MESSAGE, payload: { verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", exerciseFamily: "meaning", exerciseId: "exercise.zijn.ott-identity.meaning", contentVersion: "016-1", result: "correct", expectedEvidenceRevision: 0 } };
    expect(isLearningMessage(valid)).toBe(true);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, contentVersion: "015-1" } })).toBe(false);
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

  it("accepts only the authored Verb Journey Daily Five task shape", () => {
    const valid = { type: LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE, payload: { task: { kind: "verb", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", contentVersion: "015-1", exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning" }, result: "correct", expectedEvidenceRevision: 0 } };
    expect(isLearningMessage(valid)).toBe(true);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, result: "maybe" } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, task: { ...valid.payload.task, kind: "grammar" } } })).toBe(false);
    expect(isLearningMessage({ ...valid, payload: { ...valid.payload, task: { kind: "verb", verbId: "verb.zijn", formOrSkillId: "skill.zijn.ott-identity", contentVersion: "016-1", exerciseFamily: "meaning", exerciseId: "exercise.zijn.ott-identity.meaning" } } })).toBe(true);
  });
});
