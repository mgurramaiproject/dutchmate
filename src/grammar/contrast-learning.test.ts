import { describe, expect, it } from "vitest";
import { contrastPack } from "./contrast";
import { applyContrastOutcome, applyContrastRepairOutcome, contrastResultMessage, getContrastRepairExercise, getImmediateContrastRepairOffer, introduceContrast, markContrastRepairOffered } from "./contrast-learning";

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
    expect(contrastResultMessage(checked, exercise, wrong)).toEqual({ correct: false, feedback: exercise.distractors[0].feedback, misconception: "MAIN_CLAUSE_NO_INVERSION" });
    expect(getImmediateContrastRepairOffer(record, exercise, wrong)).toMatchObject({ code: "MAIN_CLAUSE_NO_INVERSION", label: "Practise this contrast (1 min)" });
    expect(getImmediateContrastRepairOffer(checked, exercise, wrong)).toBeNull();
  });

  it("triggers only after two supported matches in the bounded window and respects cooldown/diversity", () => {
    let record = introduceContrast(contrastPack.id, 1, 100);
    const source = contrastPack.exercises[0];
    record = applyContrastOutcome(record, source, { type: "check", answer: source.distractors[0].value }, 200, true);
    expect(record.repair.pending).toBe(false);
    record = applyContrastOutcome(record, source, { type: "check", answer: source.distractors[0].value }, 300, true);
    expect(record.repair).toMatchObject({ pending: true, recentRelevantCodes: ["MAIN_CLAUSE_NO_INVERSION", "MAIN_CLAUSE_NO_INVERSION"] });
    expect(getContrastRepairExercise(record, 300)).toMatchObject({ id: "contrast-rebuild-appointment" });
    record = markContrastRepairOffered(record, "contrast-rebuild-appointment", 300);
    expect(getContrastRepairExercise(record, 300)).toBeNull();
    expect(getContrastRepairExercise(record, 300 + 3 * 24 * 60 * 60 * 1_000)).toBeNull();
    const repaired = applyContrastRepairOutcome(record, contrastPack.exercises[2], { type: "check", answer: contrastPack.exercises[2].accepted[0] }, 300 + 3 * 24 * 60 * 60 * 1_000);
    expect(repaired.repair).toMatchObject({ pending: false, recentRelevantCodes: [] });
  });
});
