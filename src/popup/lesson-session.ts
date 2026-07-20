import type { Lesson } from "../lessons/catalog";
import { getLearningItemId, type LearningItem, type LessonProgress, type LessonProgressStage } from "../vocabulary/learning-record";

export type LessonStage = "read" | "notice" | "practise" | "replay" | "keep";
export type LessonPracticeEvidence = { candidateId: string; dimension: "recognition" | "recall"; result: "again" | "got-it" };
export type LessonSession = { lesson: Lesson; stage: LessonStage; revealedLineIndexes: number[]; selectedCandidateIds: string[]; practiceIndex: number; practiceRevealed: boolean; practiceEvidence: LessonPracticeEvidence[] };
const stages: LessonStage[] = ["read", "notice", "practise", "replay", "keep"];

export function createLessonSession(lesson: Lesson, stage: LessonProgressStage = "read"): LessonSession { return { lesson, stage, revealedLineIndexes: [], selectedCandidateIds: lesson.candidates.map((candidate) => candidate.id), practiceIndex: 0, practiceRevealed: false, practiceEvidence: [] }; }
export function resumeLessonSession(lesson: Lesson, progress: LessonProgress | null): LessonSession { return createLessonSession(lesson, progress && progress.completedAt !== null ? "read" : progress?.stage); }
export function getLessonCandidateChoices(session: LessonSession, items: LearningItem[]): Array<{ id: string; dutch: string; checked: boolean; alreadySaved: boolean }> { return session.lesson.candidates.map((candidate) => ({ id: candidate.id, dutch: candidate.dutch, checked: session.selectedCandidateIds.includes(candidate.id), alreadySaved: items.some((item) => item.id === getLearningItemId(candidate.dutch)) })); }
export function getLessonsAvailabilityView(error: string | null): { unavailable: boolean; message: string | null; retryLabel: string | null } { return error ? { unavailable: true, message: error, retryLabel: "Try lessons again" } : { unavailable: false, message: null, retryLabel: null }; }
export function advanceLessonStage(session: LessonSession): LessonSession { const index = stages.indexOf(session.stage); return { ...session, stage: stages[Math.min(index + 1, stages.length - 1)], practiceRevealed: false }; }
export function revealLessonLine(session: LessonSession, index: number): LessonSession { return session.revealedLineIndexes.includes(index) ? session : { ...session, revealedLineIndexes: [...session.revealedLineIndexes, index] }; }
export function toggleLessonCandidate(session: LessonSession, id: string): LessonSession { return { ...session, selectedCandidateIds: session.selectedCandidateIds.includes(id) ? session.selectedCandidateIds.filter((candidateId) => candidateId !== id) : [...session.selectedCandidateIds, id] }; }
export function revealLessonPractice(session: LessonSession): LessonSession { return { ...session, practiceRevealed: true }; }
export function advanceLessonPractice(session: LessonSession, result: "again" | "got-it"): LessonSession { const prompt = session.lesson.practice[session.practiceIndex]; const practiceEvidence = [...session.practiceEvidence, { candidateId: prompt.candidateId, dimension: prompt.dimension, result }]; return session.practiceIndex + 1 >= session.lesson.practice.length ? { ...advanceLessonStage(session), practiceEvidence } : { ...session, practiceIndex: session.practiceIndex + 1, practiceRevealed: false, practiceEvidence }; }
