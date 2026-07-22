import { describe, expect, it } from "vitest";
import { getLearningRhythm } from "./learning-rhythm";
import { createNewMastery, type LearningItem, type LessonProgress } from "./learning-record";

const day = 24 * 60 * 60 * 1_000;

describe("learning rhythm", () => {
  it("keeps one local active day, shows one grace day, and resets gently after a longer gap", () => {
    const now = 10 * day + 12_000;
    const active = getLearningRhythm([], {}, { activeDays: { [8 * day]: { completedAt: 8 * day } } }, now, []);
    expect(active.week.at(-2)).toMatchObject({ status: "grace" });
    expect(active.resetCopy).toBeNull();

    const reset = getLearningRhythm([], {}, { activeDays: { [7 * day]: { completedAt: 7 * day } } }, now, []);
    expect(reset.week.at(-2)).toMatchObject({ status: "idle" });
    expect(reset.resetCopy).toBe("A fresh week starts whenever you return.");
  });

  it("surfaces only evidence-based chunk, balanced practice, and pathway milestones", () => {
    const item = learningItem("goedemorgen", "chunk");
    item.recognition = { ...item.recognition, attemptCount: 1 };
    item.recall = { ...item.recall, attemptCount: 1 };
    const progress: LessonProgress = { lessonId: "first", contentVersion: 1, stage: "keep", completedAt: 1_000, keptCandidateIds: [], updatedAt: 1_000 };

    expect(getLearningRhythm([item], { first: progress, second: { ...progress, lessonId: "second" } }, {}, 10 * day, [
      { id: "first", pathway: "first-conversations", contentVersion: 1 },
      { id: "second", pathway: "first-conversations", contentVersion: 1 },
    ])).toMatchObject({ milestones: [
      { id: "first-saved-chunk" },
      { id: "balanced-practice" },
      { id: "pathway:first-conversations" },
    ] });
  });

  it("keeps local review and saved-item counts while treating older activity as active without inventing a count", () => {
    const today = 10 * day;
    const rhythm = getLearningRhythm([], {}, {
      activeDays: { [8 * day]: { completedAt: 8 * day } },
      activityDays: {
        [today]: { reviews: 3, saved: 2, lessons: 1, updatedAt: today },
        [9 * day]: { reviews: 1, saved: 2, updatedAt: 9 * day },
      },
    }, today, []);

    expect(rhythm.activity).toEqual(expect.arrayContaining([
      { dayStartAt: today, reviews: 3, saved: 2, lessons: 1 },
      { dayStartAt: 9 * day, reviews: 1, saved: 2, lessons: null },
      { dayStartAt: 8 * day, reviews: null, saved: null, lessons: null },
    ]));
  });
});

function learningItem(dutch: string, kind: "word" | "chunk"): LearningItem {
  return { id: `nl\u001f${dutch}`, learningLanguage: "nl", normalizedDutch: dutch, dutch, kind, english: null, telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: createNewMastery(), recall: createNewMastery(), createdAt: 1, updatedAt: 1 };
}
