import { describe, expect, it } from "vitest";
import { applyGrammarCheck, introduceGrammar } from "./learning";
import { zijnPattern } from "./content";

describe("zijn grammar evidence", () => {
  it("introduces, records only first checks, schedules, and reaches applied evidence", () => {
    const start = Date.UTC(2026, 0, 1, 9);
    let record = introduceGrammar("a0-zijn-present", 1, start);
    for (const [index, exercise] of zijnPattern.exercises.entries()) record = applyGrammarCheck(record, exercise, exercise.accepted[0], start + (index ? 2 : 0) * 86_400_000, true);
    expect(record.state).toBe("applied");
    expect(record.successfulEvidenceCount).toBe(4);
    expect(record.primitives.length).toBe(4);
    expect(record.contextTags.length).toBe(4);
    expect(applyGrammarCheck(record, zijnPattern.exercises[0], "ben", start, false)).toEqual(record);
  });

  it("records bounded misconception evidence without raw answers", () => {
    const record = applyGrammarCheck(introduceGrammar("a0-zijn-present", 1, 1), zijnPattern.exercises[0], "bent", 1, true);
    expect(record.misconceptionCounts).toEqual({ "wrong-person": 1 });
    expect(JSON.stringify(record)).not.toContain("bent");
  });
});
