import type { VerbJourneyPack } from "./content";
import type { VerbJourneyRecord } from "./learning";

export function countVerbJourneyFormSlots(pack: VerbJourneyPack, record: VerbJourneyRecord | null): number {
  const completed = pack.journeys.reduce((total, journey) => {
    const hasEvidence = journey.targetSkills.some((skillId) => Object.values(record?.skills ?? {}).some((skill) => skill.verbId === journey.verbId && skill.formOrSkillId === skillId));
    return total + (hasEvidence ? journey.targetForms.length : 0);
  }, 0);
  return Math.min(completed, pack.dutchForms.length);
}
