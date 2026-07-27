import { describe, expect, it } from "vitest";
import { grammarPatterns } from "./content";
import { getGrammarProgressLabel, getNextFoundationPattern } from "./progression";
import type { GrammarRecord } from "./learning";

describe("A0 foundation progression", () => {
  it("recommends the earliest pattern that is not Applied", () => {
    const records: Partial<Record<GrammarRecord["patternId"], GrammarRecord>> = {
      "a0-zijn-present": record("a0-zijn-present", "applied"),
      "a0-hebben-present": record("a0-hebben-present", "practising"),
    };

    expect(getNextFoundationPattern(grammarPatterns, records)?.id).toBe("a0-hebben-present");
    records["a0-hebben-present"] = record("a0-hebben-present", "applied");
    expect(getNextFoundationPattern(grammarPatterns, records)?.id).toBe("a0-regular-present");
    records["a0-regular-present"] = record("a0-regular-present", "applied");
    records["a0-yes-no-inversion"] = record("a0-yes-no-inversion", "applied");
    expect(getNextFoundationPattern(grammarPatterns, records)).toBeNull();
  });

  it("keeps pattern progress separate and honest", () => {
    expect(getGrammarProgressLabel(undefined)).toBe("Not started");
    expect(getGrammarProgressLabel(record("a0-zijn-present", "introduced"))).toBe("Introduced");
    expect(getGrammarProgressLabel(record("a0-zijn-present", "practising"))).toBe("Practising");
    expect(getGrammarProgressLabel(record("a0-zijn-present", "applied"))).toBe("Applied");
  });
});

function record(patternId: GrammarRecord["patternId"], state: GrammarRecord["state"]): GrammarRecord {
  return { patternId, contentVersion: 1, state, introducedAt: 1, lastPractisedAt: state === "introduced" ? null : 2, dueAt: 3, intervalDays: 1, successfulEvidenceCount: state === "applied" ? 4 : state === "practising" ? 1 : 0, successfulExerciseIds: [], primitives: [], contextTags: [], recentExerciseIds: [], recentSuccessfulDays: [], delayedEvidence: state === "applied", misconceptionCounts: {}, evidenceRevision: 0, updatedAt: 2 };
}
