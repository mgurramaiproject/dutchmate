import { describe, expect, it } from "vitest";
import { advanceSavedQuiz, createSavedQuizSession, getSavedQuizTask, revealSavedQuiz } from "./saved-quiz";
import type { LearningItem } from "../vocabulary/learning-record";

const item = (id: string, recognitionAttempts = 0, recallAttempts = 0): LearningItem => ({
  id,
  learningLanguage: "nl",
  normalizedDutch: id,
  dutch: id,
  kind: "word",
  english: `${id} English`,
  telugu: null,
  sources: [],
  contexts: [],
  encounters: { count: 0, lastEncounterAt: null },
  recognition: { state: recognitionAttempts ? "learning" : "new", dueAt: null, intervalDays: 0, attemptCount: recognitionAttempts, successfulStreak: 0, lastPractisedAt: null },
  recall: { state: recallAttempts ? "learning" : "new", dueAt: null, intervalDays: 0, attemptCount: recallAttempts, successfulStreak: 0, lastPractisedAt: null },
  createdAt: 1,
  updatedAt: 1,
});

describe("saved quiz session", () => {
  it("shuffles every saved item once and captures the weaker practice dimension", () => {
    const session = createSavedQuizSession([item("huis", 2, 0), item("fiets", 0, 3), item("boek", 1, 1)], () => 0);

    expect(session.tasks).toEqual([
      { itemId: "fiets", dimension: "recognition", expectedAttemptCount: 0 },
      { itemId: "boek", dimension: "recognition", expectedAttemptCount: 1 },
      { itemId: "huis", dimension: "recall", expectedAttemptCount: 0 },
    ]);
    expect(new Set(session.tasks.map((task) => task.itemId)).size).toBe(3);
  });

  it("reveals and advances without creating hidden resume state", () => {
    const session = createSavedQuizSession([item("huis")], () => 0);
    expect(getSavedQuizTask(session)?.itemId).toBe("huis");
    expect(revealSavedQuiz(session).revealed).toBe(true);
    expect(advanceSavedQuiz(revealSavedQuiz(session))).toMatchObject({ taskIndex: 1, revealed: false });
    expect(getSavedQuizTask(advanceSavedQuiz(session))).toBeNull();
  });
});
