import { HEBBEN_VERB_JOURNEY_CONTENT_VERSION, HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION, VERB_JOURNEY_CONTENT_VERSION, VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION, ZIJN_VERB_JOURNEY_CONTENT_VERSION, ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION, type VerbJourneyContentVersion } from "./content";

export type VerbJourneySkillStatus = "needs-practice" | "practising" | "demonstrated";
export type VerbJourneyOutcome = "correct" | "incorrect";

export type VerbJourneyFamilyEvidence = {
  id: string;
  exerciseFamily: string;
  exerciseIds: string[];
  attemptCount: number;
  successfulAttemptCount: number;
  lastResult: VerbJourneyOutcome;
  lastAttemptAt: number;
};

export type VerbJourneySkillEvidence = {
  id: string;
  verbId: string;
  formOrSkillId: string;
  status: VerbJourneySkillStatus;
  exerciseFamilies: Record<string, VerbJourneyFamilyEvidence>;
  delayedOrRecombinedEvidence: boolean;
  dueAt: number;
  evidenceRevision: number;
  updatedAt: number;
};

export type VerbJourneyRecord = {
  contentVersion: VerbJourneyContentVersion;
  evidenceRevision: number;
  skills: Record<string, VerbJourneySkillEvidence>;
};

export type RecordVerbJourneyEvidenceInput = {
  verbId: string;
  formOrSkillId: string;
  exerciseFamily: string;
  exerciseId: string;
  contentVersion: VerbJourneyContentVersion;
  result: VerbJourneyOutcome;
  delayedOrRecombined?: boolean;
  expectedEvidenceRevision: number;
};

export function createVerbJourneyRecord(): VerbJourneyRecord {
  return { contentVersion: VERB_JOURNEY_CONTENT_VERSION, evidenceRevision: 0, skills: {} };
}

export function verbJourneySkillId(verbId: string, formOrSkillId: string): string {
  return `${verbId}\u001f${formOrSkillId}`;
}

export function verbJourneyEvidenceId(verbId: string, formOrSkillId: string, exerciseFamily: string): string {
  return `${verbJourneySkillId(verbId, formOrSkillId)}\u001f${exerciseFamily}`;
}

export function recordVerbJourneyEvidence(record: VerbJourneyRecord, input: RecordVerbJourneyEvidenceInput, now: number): VerbJourneyRecord {
  const skillId = verbJourneySkillId(input.verbId, input.formOrSkillId);
  const existingSkill = record.skills[skillId];
  const existingFamily = existingSkill?.exerciseFamilies[input.exerciseFamily];
  const family: VerbJourneyFamilyEvidence = {
    id: verbJourneyEvidenceId(input.verbId, input.formOrSkillId, input.exerciseFamily),
    exerciseFamily: input.exerciseFamily,
    exerciseIds: [...new Set([...(existingFamily?.exerciseIds ?? []), input.exerciseId])].slice(-8),
    attemptCount: (existingFamily?.attemptCount ?? 0) + 1,
    successfulAttemptCount: (existingFamily?.successfulAttemptCount ?? 0) + (input.result === "correct" ? 1 : 0),
    lastResult: input.result,
    lastAttemptAt: now,
  };
  const families = { ...(existingSkill?.exerciseFamilies ?? {}), [input.exerciseFamily]: family };
  const successfulFamilies = Object.values(families).filter((candidate) => candidate.successfulAttemptCount > 0);
  const status: VerbJourneySkillStatus = input.result === "incorrect"
    ? "needs-practice"
    : successfulFamilies.length >= 2 && (existingSkill?.delayedOrRecombinedEvidence === true || input.delayedOrRecombined === true)
      ? "demonstrated"
      : "practising";
  const skill: VerbJourneySkillEvidence = {
    id: skillId,
    verbId: input.verbId,
    formOrSkillId: input.formOrSkillId,
    status,
    exerciseFamilies: families,
    delayedOrRecombinedEvidence: existingSkill?.delayedOrRecombinedEvidence === true || input.delayedOrRecombined === true,
    dueAt: input.result === "incorrect" ? now : now + 86_400_000,
    evidenceRevision: (existingSkill?.evidenceRevision ?? 0) + 1,
    updatedAt: now,
  };
  return { ...record, contentVersion: input.contentVersion, evidenceRevision: record.evidenceRevision + 1, skills: { ...record.skills, [skillId]: skill } };
}

export function parseVerbJourneyRecord(value: unknown): VerbJourneyRecord | null {
  if (!isRecord(value) || ![VERB_JOURNEY_CONTENT_VERSION, VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION, ZIJN_VERB_JOURNEY_CONTENT_VERSION, ZIJN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION, HEBBEN_VERB_JOURNEY_CONTENT_VERSION, HEBBEN_VERB_JOURNEY_MULTILINGUAL_CONTENT_VERSION].includes(value.contentVersion as VerbJourneyContentVersion) || !nonNegativeInteger(value.evidenceRevision) || !isRecord(value.skills)) return null;
  const skills: Record<string, VerbJourneySkillEvidence> = {};
  for (const [key, candidate] of Object.entries(value.skills)) {
    const parsed = parseSkill(candidate);
    if (parsed && parsed.id === key) skills[key] = parsed;
  }
  return { contentVersion: value.contentVersion as VerbJourneyContentVersion, evidenceRevision: value.evidenceRevision, skills };
}

function parseSkill(value: unknown): VerbJourneySkillEvidence | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.verbId !== "string" || typeof value.formOrSkillId !== "string" || value.id !== verbJourneySkillId(value.verbId, value.formOrSkillId) || !["needs-practice", "practising", "demonstrated"].includes(value.status as string) || typeof value.delayedOrRecombinedEvidence !== "boolean" || !nonNegativeInteger(value.evidenceRevision) || !finite(value.updatedAt) || !isRecord(value.exerciseFamilies)) return null;
  const exerciseFamilies: Record<string, VerbJourneyFamilyEvidence> = {};
  for (const [key, candidate] of Object.entries(value.exerciseFamilies)) {
    if (!isRecord(candidate) || candidate.id !== verbJourneyEvidenceId(value.verbId, value.formOrSkillId, key) || candidate.exerciseFamily !== key || !Array.isArray(candidate.exerciseIds) || !candidate.exerciseIds.every((id) => typeof id === "string") || !nonNegativeInteger(candidate.attemptCount) || !nonNegativeInteger(candidate.successfulAttemptCount) || (candidate.lastResult !== "correct" && candidate.lastResult !== "incorrect") || !finite(candidate.lastAttemptAt)) continue;
    exerciseFamilies[key] = { id: candidate.id, exerciseFamily: key, exerciseIds: [...new Set(candidate.exerciseIds)].slice(-8), attemptCount: candidate.attemptCount, successfulAttemptCount: Math.min(candidate.attemptCount, candidate.successfulAttemptCount), lastResult: candidate.lastResult, lastAttemptAt: candidate.lastAttemptAt };
  }
  return { id: value.id, verbId: value.verbId, formOrSkillId: value.formOrSkillId, status: value.status as VerbJourneySkillStatus, exerciseFamilies, delayedOrRecombinedEvidence: value.delayedOrRecombinedEvidence, dueAt: finite(value.dueAt) ? value.dueAt : value.updatedAt, evidenceRevision: value.evidenceRevision, updatedAt: value.updatedAt };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function nonNegativeInteger(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 0; }
