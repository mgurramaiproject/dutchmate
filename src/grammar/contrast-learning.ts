import type { ContrastExercise, ContrastPackId } from "./contrast";

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
  evidenceRevision: number;
  updatedAt: number;
};

export function introduceContrast(packId: ContrastPackId, contentVersion: 1, now: number): ContrastRecord {
  return { packId, contentVersion, state: "introduced", introducedAt: now, lastPractisedAt: null, successfulExerciseIds: [], recentExerciseIds: [], evidenceRevision: 0, updatedAt: now };
}

export function applyContrastOutcome(record: ContrastRecord, exercise: ContrastExercise, outcome: ContrastOutcome, now: number, firstCheck: boolean, exerciseCount = 3): ContrastRecord {
  if (!firstCheck) return record;
  const recentExerciseIds = [...record.recentExerciseIds.filter((id) => id !== exercise.id), exercise.id].slice(-8);
  const next: ContrastRecord = { ...record, state: "practising", lastPractisedAt: now, recentExerciseIds, evidenceRevision: record.evidenceRevision + 1, updatedAt: now };
  if (outcome.type !== "check" || !exercise.accepted.includes(outcome.answer)) return next;
  next.successfulExerciseIds = [...new Set([...record.successfulExerciseIds, exercise.id])].slice(-8);
  if (next.successfulExerciseIds.length >= exerciseCount) next.state = "complete";
  return next;
}

export function contrastResultMessage(_record: ContrastRecord, exercise: ContrastExercise, answer: string): { correct: boolean; feedback: string } {
  return exercise.accepted.includes(answer) ? { correct: true, feedback: exercise.feedback } : { correct: false, feedback: exercise.distractors.find((distractor) => distractor.value === answer)?.feedback ?? exercise.feedback };
}
