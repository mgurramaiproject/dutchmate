import type { Lesson } from "../lessons/catalog";

export type LessonStage = "read" | "notice" | "practise" | "replay" | "keep";
export type LessonPracticeEvidence = { candidateId: string; dimension: "recognition" | "recall"; result: "again" | "got-it" };
export type LessonSession = { lesson: Lesson; stage: LessonStage; revealedLineIndexes: number[]; selectedCandidateIds: string[]; practiceIndex: number; practiceRevealed: boolean; practiceEvidence: LessonPracticeEvidence[] };
const stages: LessonStage[] = ["read", "notice", "practise", "replay", "keep"];

export function createLessonSession(lesson: Lesson): LessonSession { return { lesson, stage: "read", revealedLineIndexes: [], selectedCandidateIds: lesson.candidates.map((candidate) => candidate.id), practiceIndex: 0, practiceRevealed: false, practiceEvidence: [] }; }
export function advanceLessonStage(session: LessonSession): LessonSession { const index = stages.indexOf(session.stage); return { ...session, stage: stages[Math.min(index + 1, stages.length - 1)], practiceRevealed: false }; }
export function revealLessonLine(session: LessonSession, index: number): LessonSession { return session.revealedLineIndexes.includes(index) ? session : { ...session, revealedLineIndexes: [...session.revealedLineIndexes, index] }; }
export function toggleLessonCandidate(session: LessonSession, id: string): LessonSession { return { ...session, selectedCandidateIds: session.selectedCandidateIds.includes(id) ? session.selectedCandidateIds.filter((candidateId) => candidateId !== id) : [...session.selectedCandidateIds, id] }; }
export function revealLessonPractice(session: LessonSession): LessonSession { return { ...session, practiceRevealed: true }; }
export function advanceLessonPractice(session: LessonSession, result: "again" | "got-it"): LessonSession { const prompt = session.lesson.practice[session.practiceIndex]; const practiceEvidence = [...session.practiceEvidence, { candidateId: prompt.candidateId, dimension: prompt.dimension, result }]; return session.practiceIndex + 1 >= session.lesson.practice.length ? { ...advanceLessonStage(session), practiceEvidence } : { ...session, practiceIndex: session.practiceIndex + 1, practiceRevealed: false, practiceEvidence }; }
