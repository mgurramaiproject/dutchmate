import { describe, expect, it } from "vitest";
import { addSavedContextToken, checkSavedContextMission, createSavedContextMission, getSavedContext, getSavedContextReconstruction, getSavedContextTokenOrder, removeSavedContextToken, revealSavedContextMission } from "./saved-context-mission";
import type { LearningItem } from "../vocabulary/learning-record";

const item = (values: Partial<LearningItem> = {}): LearningItem => ({
  id: "nl\u001fzebra",
  learningLanguage: "nl",
  normalizedDutch: "zebra",
  dutch: "zebra",
  kind: "word",
  english: "zebra",
  telugu: null,
  sources: [],
  contexts: [],
  encounters: { count: 0, lastEncounterAt: null },
  recognition: { state: "strong", dueAt: null, intervalDays: 7, attemptCount: 3, successfulStreak: 3, lastPractisedAt: 1 },
  recall: { state: "familiar", dueAt: null, intervalDays: 3, attemptCount: 2, successfulStreak: 2, lastPractisedAt: 1 },
  createdAt: 1,
  updatedAt: 1,
  ...values,
});

describe("Saved Context Mission", () => {
  it("selects the newest explicitly Dutch context and records the weaker canonical dimension", () => {
    const saved = item({ contexts: [
      { text: "De zebra loopt buiten.", addedAt: 10, sourceLanguage: "nl" },
      { text: "A zebra walks outside.", addedAt: 40, sourceLanguage: "en" },
      { text: "De zebra staat bij de ingang.", addedAt: 30, sourceLanguage: "nl" },
    ] });

    const mission = createSavedContextMission(saved);

    expect(mission).toMatchObject({ itemId: saved.id, dimension: "recall", expectedAttemptCount: 2, revealed: false, context: { text: "De zebra staat bij de ingang.", sourceLanguage: "nl" } });
    expect(getSavedContext(saved)).toEqual(mission?.context);
    expect(revealSavedContextMission(mission!)).toMatchObject({ revealed: true, context: mission!.context });
  });

  it("uses normalized context text as the deterministic tie-breaker and excludes unsafe items", () => {
    const tied = item({ contexts: [
      { text: "  De zebra loopt. ", addedAt: 20, sourceLanguage: "nl" },
      { text: "De zebra staat.", addedAt: 20, sourceLanguage: "nl" },
    ] });
    expect(getSavedContext(tied)?.text).toBe("De zebra staat.");
    expect(createSavedContextMission(item({ kind: "chunk", contexts: [{ text: "De zebra loopt.", addedAt: 1, sourceLanguage: "nl" }] }))).toBeNull();
    expect(createSavedContextMission(item({ contexts: [{ text: "A zebra walks.", addedAt: 1, sourceLanguage: "en" }, { text: "Legacy zebra context", addedAt: 2 }] }))).toBeNull();
  });

  it("offers only conservative reconstruction and accepts only the stored token order", () => {
    const saved = item({ contexts: [{ text: "De zebra loopt.", addedAt: 10, sourceLanguage: "nl" }] });
    const reconstruction = getSavedContextReconstruction(saved);
    const mission = createSavedContextMission(saved)!;

    expect(reconstruction).toEqual({ tokens: ["De", "zebra", "loopt."], targetTokenIndex: 1 });
    expect(mission.reconstruction).toEqual(reconstruction);
    expect(getSavedContextTokenOrder(reconstruction!)).toEqual([1, 2, 0]);
    expect(checkSavedContextMission(mission)).toBeNull();

    const correct = [0, 1, 2].reduce((current, index) => addSavedContextToken(current, index), mission);
    expect(checkSavedContextMission(correct)).toBe("got-it");
    expect(addSavedContextToken(correct, 1)).toEqual(correct);
    const wrong = removeSavedContextToken(correct, 0);
    const reordered = addSavedContextToken(addSavedContextToken(addSavedContextToken(mission, 1), 0), 2);
    expect(wrong.placedTokenIndexes).toEqual([1, 2]);
    expect(checkSavedContextMission(reordered)).toBe("again");
  });

  it("falls back from duplicate, malformed, over-limit, and unsafe Unicode punctuation", () => {
    const unsafe = (text: string) => expect(getSavedContextReconstruction(item({ contexts: [{ text, addedAt: 1, sourceLanguage: "nl" }] }))).toBeNull();
    unsafe("De zebra staat bij de zebra.");
    unsafe("De de zebra loopt.");
    unsafe("De, zebra loopt.");
    unsafe(`De zebra ${"x".repeat(153)}.`);
    unsafe(Array.from({ length: 13 }, (_, index) => index === 1 ? "zebra" : "woord").join(" "));
    expect(getSavedContextReconstruction(item({ dutch: "straat", normalizedDutch: "straat", contexts: [{ text: "De straat is héél rustig.", addedAt: 1, sourceLanguage: "nl" }] }))).toMatchObject({ tokens: ["De", "straat", "is", "héél", "rustig."] });
  });
});
