import { describe, expect, it } from "vitest";
import { applyDailyFiveResult, createDailyFiveSnapshot, getOverallMastery, getWeakerMasteryDimension, selectGrammarDailyFiveTasks, selectVerbJourneyDailyFiveTasks } from "./daily-five";
import { createNewMastery, type LearningItem } from "./learning-record";

const day = 24 * 60 * 60 * 1_000;

describe("Daily Five scheduling", () => {
  it("chooses the weaker mastery dimension, then the earlier due dimension with a stable tie", () => {
    const current = item("huis", 1);
    current.recognition = { ...createNewMastery(), state: "learning", attemptCount: 1, dueAt: 20 };
    current.recall = { ...createNewMastery(), state: "learning", attemptCount: 1, dueAt: 10 };
    expect(getWeakerMasteryDimension(current)).toBe("recall");
    current.recall = { ...current.recall, dueAt: 20 };
    expect(getWeakerMasteryDimension(current)).toBe("recognition");
  });

  it("starts a new item with recognition and keeps its five-task snapshot stable", () => {
    const first = item("huis", 1);
    const second = item("boom", 2);
    const snapshot = createDailyFiveSnapshot([first, second], 10 * day);

    expect(snapshot.tasks).toEqual([
      { itemId: first.id, dimension: "recognition" },
      { itemId: second.id, dimension: "recognition" },
    ]);
    expect(applyDailyFiveResult(first, "recognition", "got-it", 10 * day).item.recognition).toMatchObject({ state: "learning", dueAt: 11 * day, intervalDays: 1 });
    expect(snapshot.tasks).toHaveLength(2);
  });

  it("uses due attempted work before new work, with one weaker dimension per item", () => {
    const due = item("huis", 2);
    due.recognition = { ...createNewMastery(), state: "familiar", attemptCount: 2, dueAt: 5 * day, intervalDays: 3 };
    due.recall = { ...createNewMastery(), state: "learning", attemptCount: 1, dueAt: 6 * day, intervalDays: 1 };
    const snapshot = createDailyFiveSnapshot([item("boom", 1), due], 10 * day);

    expect(snapshot.tasks[0]).toEqual({ itemId: due.id, dimension: "recall" });
    expect(snapshot.tasks[1]).toEqual({ itemId: "nl\u001fboom", dimension: "recognition" });
  });

  it("alternates an otherwise identical due-direction tie from the last result", () => {
    const current = item("huis", 1);
    current.recognition = { ...createNewMastery(), state: "learning", attemptCount: 1, dueAt: 5 * day };
    current.recall = { ...createNewMastery(), state: "learning", attemptCount: 1, dueAt: 5 * day };
    expect(createDailyFiveSnapshot([current], 10 * day, "recognition").tasks[0]).toEqual({ itemId: current.id, dimension: "recall" });
  });

  it("waits for a later session before offering recall after first recognition", () => {
    const current = item("huis", 1);
    current.recognition = { ...createNewMastery(), state: "learning", attemptCount: 1, lastPractisedAt: 10 * day, dueAt: 12 * day };
    expect(createDailyFiveSnapshot([current], 10 * day).tasks).toEqual([]);
    expect(createDailyFiveSnapshot([current], 11 * day).tasks).toEqual([{ itemId: current.id, dimension: "recall" }]);
  });

  it("applies every approved success and failure transition to only the tested dimension", () => {
    let current = item("huis", 1);
    for (const expected of [["learning", 1], ["familiar", 3], ["strong", 7], ["strong", 14]] as const) {
      current = applyDailyFiveResult(current, "recognition", "got-it", 10 * day).item;
      expect(current.recognition).toMatchObject({ state: expected[0], intervalDays: expected[1], dueAt: 10 * day + expected[1] * day });
      expect(current.recall).toEqual(createNewMastery());
    }
    current.recognition = { ...current.recognition, intervalDays: 60 };
    expect(applyDailyFiveResult(current, "recognition", "got-it", 10 * day).item.recognition.intervalDays).toBe(60);
    expect(applyDailyFiveResult(current, "recognition", "again", 10 * day).item.recognition).toMatchObject({ state: "familiar", successfulStreak: 0, intervalDays: 1 });
    current.recognition = { ...current.recognition, state: "familiar" };
    expect(applyDailyFiveResult(current, "recognition", "again", 10 * day).item.recognition.state).toBe("learning");
  });

  it("limits overall mastery to the weaker dimension", () => {
    const current = item("huis", 1);
    current.recognition = { ...createNewMastery(), state: "strong" };
    current.recall = { ...createNewMastery(), state: "learning" };
    expect(getOverallMastery(current)).toBe("learning");
  });

  it("keeps at least three vocabulary positions when grammar is eligible", () => {
    const vocabulary = ["one", "two", "three", "four"].map((id, index) => item(id, index + 1));
    const snapshot = createDailyFiveSnapshot(vocabulary, 10 * day, undefined, [{ kind: "grammar", patternId: "a0-zijn-present", contentVersion: 1, exerciseId: "zijn-choose-ik" }, { kind: "grammar", patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik" }]);
    expect(snapshot.tasks).toHaveLength(5);
    expect(snapshot.tasks.filter((task) => "kind" in task)).toHaveLength(2);
    expect(snapshot.tasks.filter((task) => !("kind" in task))).toHaveLength(3);
  });

  it("keeps one delayed contrast repair bounded while protecting vocabulary", () => {
    const vocabulary = ["one", "two", "three", "four"].map((id, index) => item(id, index + 1));
    const snapshot = createDailyFiveSnapshot(vocabulary, 10 * day, undefined, [
      { kind: "grammar", patternId: "a0-zijn-present", contentVersion: 1, exerciseId: "zijn-choose-ik" },
      { kind: "contrast", packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment" },
      { kind: "contrast", packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment" },
    ]);
    expect(snapshot.tasks.filter((task) => "kind" in task && task.kind === "contrast")).toHaveLength(1);
    expect(snapshot.tasks.filter((task) => !("kind" in task))).toHaveLength(3);
  });

  it("accepts due hebben practice as a second grammar position", () => {
    const snapshot = createDailyFiveSnapshot([], 10 * day, undefined, [{ kind: "grammar", patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik" }]);
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik" }]);
  });

  it("accepts due regular-present practice as a grammar position", () => {
    const snapshot = createDailyFiveSnapshot([], 10 * day, undefined, [{ kind: "grammar", patternId: "a0-regular-present", contentVersion: 1, exerciseId: "regular-choose-ik" }]);
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-regular-present", contentVersion: 1, exerciseId: "regular-choose-ik" }]);
  });

  it("accepts due inversion practice as a grammar position", () => {
    const snapshot = createDailyFiveSnapshot([], 10 * day, undefined, [{ kind: "grammar", patternId: "a0-yes-no-inversion", contentVersion: 1, exerciseId: "inversion-order-je" }]);
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-yes-no-inversion", contentVersion: 1, exerciseId: "inversion-order-je" }]);
  });

  it("prioritizes seriously overdue grammar and rotates stable ties instead of starving later patterns", () => {
    const candidates = [
      grammarCandidate("a0-zijn-present", "zijn-choose-ik", 1 * day, 0),
      grammarCandidate("a0-hebben-present", "hebben-choose-ik", 1 * day, 1),
      grammarCandidate("a0-regular-present", "regular-choose-ik", 1 * day, 2),
      grammarCandidate("a0-yes-no-inversion", "inversion-order-je", 10 * day, 3),
    ];
    expect(selectGrammarDailyFiveTasks(candidates, 10 * day, 2).map((task) => task.patternId)).toEqual(["a0-zijn-present", "a0-hebben-present"]);
    expect(selectGrammarDailyFiveTasks(candidates.slice(2), 10 * day, 2).map((task) => task.patternId)).toEqual(["a0-regular-present", "a0-yes-no-inversion"]);
  });

  it("selects one due or weak Verb Journey task deterministically", () => {
    const task = (exerciseId: string, formOrSkillId: string) => ({ kind: "verb" as const, verbId: "verb.werken" as const, formOrSkillId, contentVersion: "015-1" as const, exerciseFamily: "meaning", exerciseId });
    const skill = (id: string, status: "needs-practice" | "practising", dueAt: number) => ({ id, verbId: "verb.werken", formOrSkillId: id.split("\u001f")[1], status, exerciseFamilies: {}, delayedOrRecombinedEvidence: false, dueAt, evidenceRevision: 1, updatedAt: 1 });
    expect(selectVerbJourneyDailyFiveTasks([
      { task: task("later", "skill.werken.vtt-completed"), skill: skill("verb.werken\u001fskill.werken.vtt-completed", "practising", 12 * day), dueAt: 12 * day, skillOrder: 1 },
      { task: task("weak", "skill.werken.vtt-completed"), skill: skill("verb.werken\u001fskill.werken.vtt-completed", "needs-practice", 20 * day), dueAt: 20 * day, skillOrder: 0 },
    ], 10 * day)).toEqual([task("weak", "skill.werken.vtt-completed")]);
  });
});

function grammarCandidate(patternId: "a0-zijn-present" | "a0-hebben-present" | "a0-regular-present" | "a0-yes-no-inversion", exerciseId: string, dueAt: number, order: number) {
  return { task: { kind: "grammar" as const, patternId, contentVersion: 1 as const, exerciseId }, dueAt, patternOrder: order };
}

function item(dutch: string, createdAt: number): LearningItem {
  return { id: `nl\u001f${dutch}`, learningLanguage: "nl", normalizedDutch: dutch, dutch, kind: "word", english: null, telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: createNewMastery(), recall: createNewMastery(), createdAt, updatedAt: createdAt };
}
