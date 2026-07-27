import { describe, expect, it } from "vitest";
import { createGrammarContentReport, matchIntroducedZijnEncounter, matchZijnEncounter, validateGrammarPattern, validateLearningContent, zijnPattern } from "./content";

describe("zijn grammar content", () => {
  it("has finite reviewed answers, coded distractors, and exact feedback", () => {
    expect(validateGrammarPattern(zijnPattern)).toEqual([]);
    expect(zijnPattern.exercises).toHaveLength(4);
    expect(new Set(zijnPattern.exercises.map((exercise) => exercise.primitive)).size).toBeGreaterThan(1);
  });

  it("matches only exact reviewed subject-form pairs", () => {
    expect(matchZijnEncounter("IK BEN.")).toEqual({ subject: "ik", form: "ben" });
    expect(matchZijnEncounter("jij bent")).toEqual({ subject: "jij", form: "bent" });
    expect(matchZijnEncounter("ben")).toBeNull();
    expect(matchZijnEncounter("ik ben hier")).toBeNull();
    expect(matchZijnEncounter("ik bent")).toBeNull();
    expect(matchIntroducedZijnEncounter("ik ben", false)).toBeNull();
    expect(matchIntroducedZijnEncounter("ik ben", true)).toEqual({ subject: "ik", form: "ben" });
  });

  it("generates a deterministic review report with every released exercise", () => {
    const report = createGrammarContentReport();
    expect(report).toContain("Author: DutchMate team");
    expect(report).toContain("zijn-choose-ik");
    expect(report).toContain("Distractor: bent [wrong-person]");
    expect(createGrammarContentReport()).toBe(report);
  });

  it("rejects unsupported primitives and missing review provenance", () => {
    const invalid = structuredClone(zijnPattern);
    invalid.review.sources = [];
    invalid.exercises[0].primitive = "unsupported" as never;
    expect(validateGrammarPattern(invalid)).toEqual(expect.arrayContaining(["a0-zijn-present.review: incomplete review metadata or provenance", "zijn-choose-ik: unsupported primitive"]));
  });

  it("extends the lesson validator with the companion link", () => {
    const invalidCatalog = { version: 1 as const, lessons: [] };
    expect(validateLearningContent(zijnPattern, invalidCatalog)).toContain("a0-zijn-present.companionLessonId: lesson is missing from the bundled catalog");
  });
});
