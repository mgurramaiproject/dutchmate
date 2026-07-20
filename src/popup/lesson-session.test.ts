import { describe, expect, it } from "vitest";
import { advanceLessonStage, createLessonSession, getLessonCandidateChoices, getLessonsAvailabilityView, resumeLessonSession, toggleLessonCandidate } from "./lesson-session";
import { appointmentLesson, lessonCatalog } from "../lessons/catalog";

describe("lesson session", () => {
  it("moves through Read, Notice, Practise, Replay, and Keep while retaining candidate choice", () => {
    const session = createLessonSession(appointmentLesson);
    const withoutFirst = toggleLessonCandidate(session, appointmentLesson.candidates[0].id);
    const progressed = [1, 2, 3, 4].reduce((state) => advanceLessonStage(state), withoutFirst);

    expect(progressed.stage).toBe("keep");
    expect(progressed.selectedCandidateIds).not.toContain(appointmentLesson.candidates[0].id);
  });

  it.each(["read", "notice", "practise", "replay", "keep"] as const)("restores %s at its safe stage", (stage) => {
    expect(createLessonSession(appointmentLesson, stage)).toMatchObject({ stage, practiceIndex: 0, practiceRevealed: false });
  });

  it("restores incomplete work, replays completed lessons, labels canonical saves, and exposes a retryable lesson error", () => {
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "replay", completedAt: null, keptCandidateIds: [], updatedAt: 1 })).toMatchObject({ stage: "replay" });
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "keep", completedAt: 2, keptCandidateIds: [], updatedAt: 2 })).toMatchObject({ stage: "read" });
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "keep", completedAt: 0, keptCandidateIds: [], updatedAt: 0 })).toMatchObject({ stage: "read" });
    expect(getLessonCandidateChoices(createLessonSession(appointmentLesson), [{ id: "nl\u001feen afspraak maken" } as never])).toEqual(expect.arrayContaining([expect.objectContaining({ id: "afspraak-maken", alreadySaved: true })]));
    expect(getLessonsAvailabilityView("Lessons are unavailable.")).toEqual({ unavailable: true, message: "Lessons are unavailable.", retryLabel: "Try lessons again" });
  });

  it.each(lessonCatalog.lessons.filter((lesson) => lesson.order <= 4))("opens $title with helper text, candidates, and replay", (lesson) => {
    const read = createLessonSession(lesson);
    const replay = createLessonSession(lesson, "replay");

    expect(read).toMatchObject({ lesson, stage: "read" });
    expect(read.lesson.lines.every((line) => line.dutch.length > 0 && line.english.length > 0 && line.telugu.length > 0)).toBe(true);
    expect(getLessonCandidateChoices(read, []).map((candidate) => candidate.id)).toEqual(lesson.candidates.map((candidate) => candidate.id));
    expect(replay).toMatchObject({ lesson, stage: "replay" });
  });
});
