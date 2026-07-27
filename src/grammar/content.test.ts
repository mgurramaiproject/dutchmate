import { describe, expect, it } from "vitest";
import { matchIntroducedZijnEncounter, matchZijnEncounter, validateGrammarPattern, zijnPattern } from "./content";

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
});
