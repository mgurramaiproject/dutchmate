import { describe, expect, it } from "vitest";
import { applyDailyFiveResult, createDailyFiveSnapshot, getOverallMastery } from "./daily-five";
import { createNewMastery, type LearningItem } from "./learning-record";

const day = 24 * 60 * 60 * 1_000;

describe("Daily Five scheduling", () => {
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
});

function item(dutch: string, createdAt: number): LearningItem {
  return { id: `nl\u001f${dutch}`, learningLanguage: "nl", normalizedDutch: dutch, dutch, kind: "word", english: null, telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: createNewMastery(), recall: createNewMastery(), createdAt, updatedAt: createdAt };
}
