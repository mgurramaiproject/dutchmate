import type { GrammarExercise } from "./content";

export type GrammarProgressState = "introduced" | "practising" | "applied";
export type GrammarRecord = {
  patternId: "a0-zijn-present";
  contentVersion: 1;
  state: GrammarProgressState;
  introducedAt: number;
  lastPractisedAt: number | null;
  dueAt: number;
  intervalDays: number;
  successfulEvidenceCount: number;
  successfulExerciseIds: string[];
  primitives: string[];
  contextTags: string[];
  recentExerciseIds: string[];
  recentSuccessfulDays: number[];
  delayedEvidence: boolean;
  misconceptionCounts: Record<string, number>;
  evidenceRevision: number;
  updatedAt: number;
};

const intervals = [1, 3, 7, 14, 30, 60];
export function introduceGrammar(patternId: "a0-zijn-present", contentVersion: 1, now: number): GrammarRecord {
  return { patternId, contentVersion, state: "introduced", introducedAt: now, lastPractisedAt: null, dueAt: nextLocalDay(now), intervalDays: 0, successfulEvidenceCount: 0, successfulExerciseIds: [], primitives: [], contextTags: [], recentExerciseIds: [], recentSuccessfulDays: [], delayedEvidence: false, misconceptionCounts: {}, evidenceRevision: 0, updatedAt: now };
}

export function applyGrammarCheck(record: GrammarRecord, exercise: GrammarExercise, answer: string, now: number, firstCheck: boolean): GrammarRecord {
  return applyGrammarOutcome(record, exercise, { type: "check", answer }, now, firstCheck);
}

export function applyGrammarOutcome(record: GrammarRecord, exercise: GrammarExercise, outcome: { type: "check"; answer: string } | { type: "reveal" | "skip" }, now: number, firstCheck: boolean): GrammarRecord {
  if (!firstCheck) return record;
  const recentExerciseIds = [...record.recentExerciseIds.filter((id) => id !== exercise.id), exercise.id].slice(-8);
  const next: GrammarRecord = { ...record, evidenceRevision: record.evidenceRevision + 1, recentExerciseIds, updatedAt: now, dueAt: nextLocalDay(now) };
  if (outcome.type !== "check") return next;
  next.state = "practising";
  next.lastPractisedAt = now;
  const correct = exercise.accepted.includes(outcome.answer);
  if (!correct) {
    const key = exercise.distractors.find((distractor) => distractor.value === outcome.answer)?.misconception ?? "wrong-answer";
    next.misconceptionCounts = { ...record.misconceptionCounts, [key]: Math.min(9, (record.misconceptionCounts[key] ?? 0) + 1) };
    return next;
  }
  const successfulExerciseIds = record.successfulExerciseIds.includes(exercise.id) ? record.successfulExerciseIds : [...record.successfulExerciseIds, exercise.id].slice(-8);
  next.successfulExerciseIds = successfulExerciseIds;
  next.successfulEvidenceCount = Math.min(8, Math.max(record.successfulEvidenceCount, successfulExerciseIds.length));
  next.intervalDays = intervals[Math.min(next.successfulEvidenceCount - 1, intervals.length - 1)];
  next.dueAt = addLocalDays(now, next.intervalDays);
  next.primitives = [...new Set([...record.primitives, exercise.primitive])].slice(-8);
  next.contextTags = [...new Set([...record.contextTags, exercise.contextTag])].slice(-8);
  next.recentSuccessfulDays = [...new Set([...record.recentSuccessfulDays, localDay(now)])].slice(-8);
  next.delayedEvidence = record.delayedEvidence || (localDay(now) >= addLocalDays(localDay(record.introducedAt), 1) && !record.recentExerciseIds.includes(exercise.id));
  const relatedMisconceptions = new Set(exercise.distractors.map((distractor) => distractor.misconception));
  next.misconceptionCounts = Object.fromEntries(Object.entries(record.misconceptionCounts).map(([key, count]) => [key, relatedMisconceptions.has(key as never) ? Math.max(0, count - 1) : count]));
  if (next.successfulExerciseIds.length >= 4 && next.primitives.length >= 2 && next.contextTags.length >= 3 && next.recentSuccessfulDays.length >= 2 && next.delayedEvidence) next.state = "applied";
  return next;
}

export function grammarResultMessage(record: GrammarRecord, exercise: GrammarExercise, answer: string): { correct: boolean; feedback: string } {
  return exercise.accepted.includes(answer) ? { correct: true, feedback: exercise.feedback } : { correct: false, feedback: exercise.distractors.find((distractor) => distractor.value === answer)?.feedback ?? exercise.feedback };
}

function localDay(timestamp: number): number { const date = new Date(timestamp); date.setHours(0, 0, 0, 0); return date.getTime(); }
function addLocalDays(timestamp: number, days: number): number { const date = new Date(timestamp); date.setDate(date.getDate() + days); date.setHours(0, 0, 0, 0); return date.getTime(); }
function nextLocalDay(timestamp: number): number { return addLocalDays(timestamp, 1); }
