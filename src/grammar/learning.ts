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
  primitives: string[];
  contextTags: string[];
  recentExerciseIds: string[];
  recentSuccessfulDays: number[];
  delayedEvidence: boolean;
  misconceptionCounts: Record<string, number>;
  evidenceRevision: number;
};

const intervals = [1, 3, 7, 14, 30, 60];
const day = 86_400_000;

export function introduceGrammar(patternId: "a0-zijn-present", contentVersion: 1, now: number): GrammarRecord {
  return { patternId, contentVersion, state: "introduced", introducedAt: now, lastPractisedAt: null, dueAt: now + day, intervalDays: 0, successfulEvidenceCount: 0, primitives: [], contextTags: [], recentExerciseIds: [], recentSuccessfulDays: [], delayedEvidence: false, misconceptionCounts: {}, evidenceRevision: 0 };
}

export function applyGrammarCheck(record: GrammarRecord, exercise: GrammarExercise, answer: string, now: number, firstCheck: boolean): GrammarRecord {
  if (!firstCheck) return record;
  const correct = exercise.accepted.includes(answer);
  const localDay = new Date(now).setHours(0, 0, 0, 0);
  const next = { ...record, state: "practising" as GrammarProgressState, lastPractisedAt: now, dueAt: now + day, evidenceRevision: record.evidenceRevision + 1, recentExerciseIds: [...record.recentExerciseIds.filter((id) => id !== exercise.id), exercise.id].slice(-8) };
  if (!correct) {
    const key = exercise.distractors.find((distractor) => distractor.value === answer)?.misconception ?? "wrong-answer";
    next.misconceptionCounts = { ...record.misconceptionCounts, [key]: Math.min(9, (record.misconceptionCounts[key] ?? 0) + 1) };
    return next;
  }
  next.successfulEvidenceCount = Math.min(8, record.successfulEvidenceCount + 1);
  next.intervalDays = intervals[Math.min(record.successfulEvidenceCount, intervals.length - 1)];
  next.dueAt = now + next.intervalDays * day;
  next.primitives = [...new Set([...record.primitives, exercise.primitive])];
  next.contextTags = [...new Set([...record.contextTags, exercise.contextTag])];
  next.recentSuccessfulDays = [...new Set([...record.recentSuccessfulDays, localDay])].slice(-8);
  next.delayedEvidence = next.delayedEvidence || now - record.introducedAt >= day;
  if (next.successfulEvidenceCount >= 4 && next.primitives.length >= 2 && next.contextTags.length >= 3 && next.recentSuccessfulDays.length >= 2 && next.delayedEvidence) next.state = "applied";
  return next;
}

export function grammarResultMessage(record: GrammarRecord, exercise: GrammarExercise, answer: string): { correct: boolean; feedback: string } {
  return exercise.accepted.includes(answer) ? { correct: true, feedback: exercise.feedback } : { correct: false, feedback: exercise.distractors.find((distractor) => distractor.value === answer)?.feedback ?? exercise.feedback };
}
