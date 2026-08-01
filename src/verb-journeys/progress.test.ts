import { describe, expect, it } from "vitest";
import { verbJourneyPack, verbJourneyPacks } from "./content";
import { createVerbJourneyRecord, recordVerbJourneyEvidence, type VerbJourneyRecord } from "./learning";
import { countVerbJourneyFormSlots } from "./progress";

function recordSkills(pack: typeof verbJourneyPack, skillIds: string[]): VerbJourneyRecord {
  return skillIds.reduce((record, formOrSkillId, index) => recordVerbJourneyEvidence(record, {
    verbId: pack.verb.id,
    formOrSkillId,
    exerciseFamily: "meaning",
    exerciseId: `exercise.${index}`,
    contentVersion: pack.contentVersion,
    result: "correct",
    expectedEvidenceRevision: record.evidenceRevision,
  }, index + 1), createVerbJourneyRecord());
}

describe("Verb Journey progress", () => {
  it("counts repeated map forms as separate journey slots", () => {
    const zijn = verbJourneyPacks.find((pack) => pack.verb.id === "verb.zijn")!;
    const record = recordSkills(zijn, ["skill.zijn.ott-identity", "skill.zijn.ott-questions"]);
    expect(countVerbJourneyFormSlots(zijn, record)).toBe(2);
  });

  it("counts every target form when a multi-form journey has evidence", () => {
    const record = recordSkills(verbJourneyPack, verbJourneyPack.journeys.map((journey) => journey.targetSkills[0]));
    expect(countVerbJourneyFormSlots(verbJourneyPack, record)).toBe(8);
  });
});
