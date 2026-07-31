import { describe, expect, it } from "vitest";
import { createVerbJourneyRecord, parseVerbJourneyRecord, recordVerbJourneyEvidence } from "./learning";

describe("verb journey evidence", () => {
  it("requires varied successful families and later recombined evidence", () => {
    let record = createVerbJourneyRecord();
    const base = { verbId: "verb.werken" as const, formOrSkillId: "skill.werken.vtt-completed" as const, contentVersion: "015-1" as const };
    record = recordVerbJourneyEvidence(record, { ...base, exerciseFamily: "meaning", exerciseId: "meaning", result: "correct", expectedEvidenceRevision: 0 }, 1);
    record = recordVerbJourneyEvidence(record, { ...base, exerciseFamily: "construction", exerciseId: "construction", result: "correct", expectedEvidenceRevision: 1 }, 2);
    expect(record.skills["verb.werken\u001fskill.werken.vtt-completed"].status).toBe("practising");
    record = recordVerbJourneyEvidence(record, { ...base, exerciseFamily: "word-order", exerciseId: "word-order", result: "correct", delayedOrRecombined: true, expectedEvidenceRevision: 2 }, 3);
    expect(record.skills["verb.werken\u001fskill.werken.vtt-completed"].status).toBe("demonstrated");
    record = recordVerbJourneyEvidence(record, { ...base, exerciseFamily: "meaning", exerciseId: "meaning-later", result: "incorrect", expectedEvidenceRevision: 3 }, 4);
    expect(record.skills["verb.werken\u001fskill.werken.vtt-completed"].status).toBe("needs-practice");
  });

  it("parses malformed or unknown family entries without breaking history reads", () => {
    const parsed = parseVerbJourneyRecord({ contentVersion: "015-1", evidenceRevision: 2, skills: { unknown: { nope: true } } });
    expect(parsed).toEqual({ contentVersion: "015-1", evidenceRevision: 2, skills: {} });
  });
});
