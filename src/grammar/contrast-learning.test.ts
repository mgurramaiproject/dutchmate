import { describe, expect, it } from "vitest";
import { contrastPack } from "./contrast";
import { applyContrastOutcome, contrastResultMessage, introduceContrast } from "./contrast-learning";

describe("contrast repair learning", () => {
  it("records one first result per reviewed exercise and keeps retry transient", () => {
    const record = introduceContrast(contrastPack.id, 1, 100);
    const exercise = contrastPack.exercises[0];
    const checked = applyContrastOutcome(record, exercise, { type: "check", answer: exercise.accepted[0] }, 200, true);

    expect(checked.evidenceRevision).toBe(1);
    expect(checked.successfulExerciseIds).toEqual([exercise.id]);
    expect(applyContrastOutcome(checked, exercise, { type: "check", answer: exercise.accepted[0] }, 300, false)).toEqual(checked);
    expect(contrastResultMessage(checked, exercise, exercise.accepted[0])).toEqual({ correct: true, feedback: exercise.feedback });
  });

  it("keeps an incorrect controlled choice as feedback without awarding success", () => {
    const record = introduceContrast(contrastPack.id, 1, 100);
    const exercise = contrastPack.exercises[1];
    const wrong = exercise.distractors[0].value;
    const checked = applyContrastOutcome(record, exercise, { type: "check", answer: wrong }, 200, true);

    expect(checked.evidenceRevision).toBe(1);
    expect(checked.successfulExerciseIds).toEqual([]);
    expect(contrastResultMessage(checked, exercise, wrong)).toEqual({ correct: false, feedback: exercise.distractors[0].feedback });
  });
});
