import type { ContrastExercise, ContrastMisconceptionCode, ContrastPackId } from "./contrast";
import { isRegisteredMisconceptionSource } from "./misconceptions";

export type ContrastProgressState = "introduced" | "practising" | "complete";
export type ContrastOutcome = { type: "check"; answer: string } | { type: "reveal" | "skip" };
export type ContrastRecord = {
  packId: ContrastPackId;
  contentVersion: 1;
  state: ContrastProgressState;
  introducedAt: number;
  lastPractisedAt: number | null;
  successfulExerciseIds: string[];
  recentExerciseIds: string[];
  misconceptionCounts: Partial<Record<ContrastMisconceptionCode, number>>;
  evidenceRevision: number;
  updatedAt: number;
};

export type ImmediateContrastRepairOffer = {
  code: ContrastMisconceptionCode;
  packId: ContrastPackId;
  contentVersion: 1;
  label: "Practise this contrast (1 min)";
};

export function introduceContrast(packId: ContrastPackId, contentVersion: 1, now: number): ContrastRecord {
  return { packId, contentVersion, state: "introduced", introducedAt: now, lastPractisedAt: null, successfulExerciseIds: [], recentExerciseIds: [], misconceptionCounts: {}, evidenceRevision: 0, updatedAt: now };
}

export function applyContrastOutcome(record: ContrastRecord, exercise: ContrastExercise, outcome: ContrastOutcome, now: number, firstCheck: boolean, exerciseCount = 3): ContrastRecord {
  if (!firstCheck) return record;
  const recentExerciseIds = [...record.recentExerciseIds.filter((id) => id !== exercise.id), exercise.id].slice(-8);
  const next: ContrastRecord = { ...record, state: "practising", lastPractisedAt: now, recentExerciseIds, evidenceRevision: record.evidenceRevision + 1, updatedAt: now };
  if (outcome.type !== "check") return next;
  const distractor = exercise.distractors.find((candidate) => candidate.value === outcome.answer);
  if (!exercise.accepted.includes(outcome.answer)) {
    const code = distractor?.misconception;
    if (code && isRegisteredMisconceptionSource(code, record.packId, exercise.id)) next.misconceptionCounts = { ...record.misconceptionCounts, [code]: Math.min(9, (record.misconceptionCounts[code] ?? 0) + 1) };
    return next;
  }
  next.successfulExerciseIds = [...new Set([...record.successfulExerciseIds, exercise.id])].slice(-8);
  if (next.successfulExerciseIds.length >= exerciseCount) next.state = "complete";
  return next;
}

export function getImmediateContrastRepairOffer(record: ContrastRecord, exercise: ContrastExercise, answer: string): ImmediateContrastRepairOffer | null {
  const code = exercise.distractors.find((distractor) => distractor.value === answer)?.misconception;
  if (!code || !isRegisteredMisconceptionSource(code, record.packId, exercise.id) || (record.misconceptionCounts[code] ?? 0) > 0) return null;
  return { code, packId: record.packId, contentVersion: record.contentVersion, label: "Practise this contrast (1 min)" };
}

export function contrastResultMessage(_record: ContrastRecord, exercise: ContrastExercise, answer: string): { correct: boolean; feedback: string; misconception?: ContrastMisconceptionCode } {
  const distractor = exercise.distractors.find((candidate) => candidate.value === answer);
  return exercise.accepted.includes(answer) ? { correct: true, feedback: exercise.feedback } : { correct: false, feedback: distractor?.feedback ?? exercise.feedback, ...(distractor?.misconception ? { misconception: distractor.misconception } : {}) };
}
