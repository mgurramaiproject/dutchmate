import type { ContrastExercise, ContrastMisconceptionCode, ContrastPackId } from "./contrast";
import { contrastPack } from "./contrast";
import { isRegisteredMisconceptionSource } from "./misconceptions";

const MAX_RELEVANT_RESULTS = 6;
const MAX_REPAIR_EXERCISES = 8;
export const CONTRAST_REPAIR_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1_000;

export type ContrastProgressState = "introduced" | "practising" | "complete";
export type ContrastOutcome = { type: "check"; answer: string } | { type: "reveal" | "skip" };
export type ContrastRepairProgress = {
  recentRelevantCodes: Array<ContrastMisconceptionCode | null>;
  pending: boolean;
  lastOfferedAt: number | null;
  recentRepairExerciseIds: string[];
};
export type ContrastRecord = {
  packId: ContrastPackId;
  contentVersion: 1;
  state: ContrastProgressState;
  introducedAt: number;
  lastPractisedAt: number | null;
  successfulExerciseIds: string[];
  recentExerciseIds: string[];
  misconceptionCounts: Partial<Record<ContrastMisconceptionCode, number>>;
  repair: ContrastRepairProgress;
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
  return { packId, contentVersion, state: "introduced", introducedAt: now, lastPractisedAt: null, successfulExerciseIds: [], recentExerciseIds: [], misconceptionCounts: {}, repair: emptyRepairProgress(), evidenceRevision: 0, updatedAt: now };
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
    next.repair = updateRepairProgress(record.repair, record.packId, exercise.id, code, now);
    return next;
  }
  next.repair = updateRepairProgress(record.repair, record.packId, exercise.id, undefined, now);
  next.successfulExerciseIds = [...new Set([...record.successfulExerciseIds, exercise.id])].slice(-8);
  if (next.successfulExerciseIds.length >= exerciseCount) next.state = "complete";
  return next;
}

export function emptyRepairProgress(): ContrastRepairProgress { return { recentRelevantCodes: [], pending: false, lastOfferedAt: null, recentRepairExerciseIds: [] }; }

export function normalizeRepairProgress(value: Partial<ContrastRepairProgress> | undefined): ContrastRepairProgress {
  return {
    recentRelevantCodes: (value?.recentRelevantCodes ?? []).filter((code): code is ContrastMisconceptionCode | null => code === null || typeof code === "string").slice(-MAX_RELEVANT_RESULTS),
    pending: value?.pending === true,
    lastOfferedAt: value?.lastOfferedAt === null || typeof value?.lastOfferedAt === "number" ? value.lastOfferedAt : null,
    recentRepairExerciseIds: (value?.recentRepairExerciseIds ?? []).filter((id): id is string => typeof id === "string").slice(-MAX_REPAIR_EXERCISES),
  };
}

export function isContrastRepairCooldownOver(progress: ContrastRepairProgress, now: number): boolean {
  return progress.lastOfferedAt === null || now - progress.lastOfferedAt >= CONTRAST_REPAIR_COOLDOWN_MS;
}

export function getContrastRepairExercise(record: ContrastRecord, now: number): ContrastExercise | null {
  if (!record.repair.pending || !isContrastRepairCooldownOver(record.repair, now)) return null;
  return contrastPack.exercises.find((exercise) => !record.repair.recentRepairExerciseIds.includes(exercise.id) && !exercise.distractors.some((distractor) => distractor.misconception && isRegisteredMisconceptionSource(distractor.misconception, record.packId, exercise.id))) ?? null;
}

export function markContrastRepairOffered(record: ContrastRecord, exerciseId: string, now: number): ContrastRecord {
  return { ...record, repair: { ...record.repair, lastOfferedAt: now, recentRepairExerciseIds: [...record.repair.recentRepairExerciseIds.filter((id) => id !== exerciseId), exerciseId].slice(-MAX_REPAIR_EXERCISES) }, updatedAt: now };
}

export function applyContrastRepairOutcome(record: ContrastRecord, exercise: ContrastExercise, outcome: ContrastOutcome, now: number, exerciseCount = 3): ContrastRecord {
  const updated = applyContrastOutcome(record, exercise, outcome, now, true, exerciseCount);
  if (outcome.type === "check" && exercise.accepted.includes(outcome.answer)) return { ...updated, repair: { ...updated.repair, pending: false, recentRelevantCodes: [] } };
  return updated;
}

function updateRepairProgress(progress: ContrastRepairProgress, packId: ContrastPackId, exerciseId: string, code: ContrastMisconceptionCode | undefined, _now: number): ContrastRepairProgress {
  if (!isRegisteredMisconceptionSource(code ?? "MAIN_CLAUSE_NO_INVERSION", packId, exerciseId)) return progress;
  const recentRelevantCodes = [...progress.recentRelevantCodes, code ?? null].slice(-MAX_RELEVANT_RESULTS);
  const matches = recentRelevantCodes.filter((candidate) => candidate === "MAIN_CLAUSE_NO_INVERSION").length;
  return { ...progress, recentRelevantCodes, pending: progress.pending || matches >= 2 };
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
