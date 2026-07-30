import { describe, expect, it } from "vitest";
import { contrastPack, createContrastContentReport, isContrastContentAvailable, validateContrastPack } from "./contrast";

describe("contrast repair content", () => {
  it("ships the reviewed main-clause inversion pilot", () => {
    expect(contrastPack.id).toBe("contrast.main_clause_inversion");
    expect(contrastPack.level).toBe("A1");
    expect(contrastPack.comparison.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ sentenceNl: "Ik werk morgen thuis.", valid: true }),
      expect.objectContaining({ sentenceNl: "Morgen werk ik thuis.", valid: true }),
      expect.objectContaining({ sentenceNl: "Morgen ik werk thuis.", valid: false }),
    ]));
    expect(contrastPack.exercises).toHaveLength(3);
    expect(validateContrastPack(contrastPack)).toEqual([]);
    expect(isContrastContentAvailable()).toBe(true);
  });

  it("keeps the controlled diagnosis and review material in the report", () => {
    const repair = contrastPack.exercises.find((exercise) => exercise.id === "contrast-repair-time-first")!;
    expect(repair.distractors).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "Morgen ik werk thuis.", misconception: "MAIN_CLAUSE_NO_INVERSION" }),
    ]));
    expect(createContrastContentReport()).toContain("Morgen werk ik thuis.");
    expect(createContrastContentReport()).toContain("MAIN_CLAUSE_NO_INVERSION");
  });

  it("rejects a draft pack before runtime release", () => {
    const draft = structuredClone(contrastPack);
    draft.review.reviewState = "self-reviewed";
    expect(validateContrastPack(draft)).toContain("contrast.main_clause_inversion.review: requires second review before runtime release");
    expect(isContrastContentAvailable(draft)).toBe(false);
  });

  it("rejects duplicate, pooled, and unknown-diagnosis content", () => {
    const malformed = structuredClone(contrastPack);
    malformed.exercises[0].choices.push("werk");
    malformed.exercises[0].distractors[0].misconception = "UNSUPPORTED" as never;
    expect(validateContrastPack(malformed)).toEqual(expect.arrayContaining([
      "contrast-choose-time-first: duplicate choices",
      "contrast-choose-time-first: unknown misconception code",
    ]));
  });
});
