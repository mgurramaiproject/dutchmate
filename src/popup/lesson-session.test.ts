import { describe, expect, it } from "vitest";
import { advanceLessonPractice, advanceLessonStage, createLessonSession, filterLessons, getLessonAvailability, getLessonCandidateChoices, getLessonsAvailabilityView, revealLessonLine, revealLessonPractice, resumeLessonSession, toggleLessonCandidate } from "./lesson-session";
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

  it("filters lessons by readiness and pathway without treating completion as Continue", () => {
    const progress = { [appointmentLesson.id]: { lessonId: appointmentLesson.id, contentVersion: 1, stage: "notice" as const, completedAt: null, keptCandidateIds: [], updatedAt: 1 } };
    expect(getLessonAvailability(progress[appointmentLesson.id])).toBe("continue");
    expect(getLessonAvailability({ ...progress[appointmentLesson.id], completedAt: 2 })).toBe("completed");
    expect(getLessonAvailability(null)).toBe("ready");
    expect(filterLessons(lessonCatalog.lessons, progress, "continue", "all")).toEqual([appointmentLesson]);
    expect(filterLessons(lessonCatalog.lessons, progress, "ready", "transport").every((lesson) => lesson.pathway === "transport")).toBe(true);
  });

  it.each(lessonCatalog.lessons.filter((lesson) => lesson.order <= 4))("opens $title with helper text, candidates, and replay", (lesson) => {
    const read = createLessonSession(lesson);
    const replay = createLessonSession(lesson, "replay");

    expect(read).toMatchObject({ lesson, stage: "read" });
    expect(read.lesson.lines.every((line) => line.dutch.length > 0 && line.english.length > 0 && line.telugu.length > 0)).toBe(true);
    expect(getLessonCandidateChoices(read, []).map((candidate) => candidate.id)).toEqual(lesson.candidates.map((candidate) => candidate.id));
    expect(replay).toMatchObject({ lesson, stage: "replay" });
  });

  it("supports the complete representative lesson flow without typing", () => {
    const read = revealLessonLine(createLessonSession(appointmentLesson), 0);
    const notice = advanceLessonStage(read);
    const practise = advanceLessonStage(notice);
    const revealedFirstPractice = revealLessonPractice(practise);
    const secondPractice = advanceLessonPractice(revealedFirstPractice, "got-it");
    const thirdPractice = advanceLessonPractice(revealLessonPractice(secondPractice), "again");
    const replay = advanceLessonPractice(revealLessonPractice(thirdPractice), "got-it");
    const keep = advanceLessonStage(replay);

    expect(read.revealedLineIndexes).toEqual([0]);
    expect(notice.stage).toBe("notice");
    expect(practise).toMatchObject({ stage: "practise", practiceRevealed: false });
    expect(revealedFirstPractice.practiceRevealed).toBe(true);
    expect(replay).toMatchObject({ stage: "replay", practiceEvidence: [
      { candidateId: "ik-wil-graag", dimension: "recognition", result: "got-it" },
      { candidateId: "afspraak-maken", dimension: "recall", result: "again" },
      { candidateId: "als-het-kan", dimension: "recognition", result: "got-it" },
    ] });
    expect(getLessonCandidateChoices(keep, []).map((candidate) => candidate.checked)).toEqual([true, true, true, true]);
  });
});
