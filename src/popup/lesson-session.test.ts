import { describe, expect, it } from "vitest";
import { advanceLessonPractice, advanceLessonPracticeExercise, advanceLessonStage, advanceLessonTransfer, checkLessonPracticeExercise, checkLessonTransfer, createLessonSession, filterLessons, getLessonAvailability, getLessonCandidateChoices, getLessonsAvailabilityView, revealLessonLine, revealLessonPractice, resumeLessonSession, selectLessonPracticeExerciseAnswer, selectLessonTransferAnswer, toggleLessonCandidate, toggleLessonPracticeExerciseToken } from "./lesson-session";
import { appointmentLesson, hebbenLesson, introductionLesson, inversionLesson, lessonCatalog, practicalDutchLessons, regularLesson } from "../lessons/catalog";

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
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "replay", completedAt: null, keptCandidateIds: [], updatedAt: 1 })).toMatchObject({ stage: "practise", authoredExerciseIndex: 0 });
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "keep", completedAt: 2, keptCandidateIds: [], updatedAt: 2 })).toMatchObject({ stage: "read" });
    expect(resumeLessonSession(appointmentLesson, { lessonId: appointmentLesson.id, contentVersion: 1, stage: "keep", completedAt: 0, keptCandidateIds: [], updatedAt: 0 })).toMatchObject({ stage: "read" });
    expect(getLessonCandidateChoices(createLessonSession(appointmentLesson), [{ id: "nl\u001feen afspraak maken" } as never])).toEqual(expect.arrayContaining([expect.objectContaining({ id: "afspraak-maken", alreadySaved: true })]));
    expect(getLessonsAvailabilityView("Lessons are unavailable.")).toEqual({ unavailable: true, message: "Lessons are unavailable.", retryLabel: "Try lessons again" });
  });

  it("grades all six Practical Dutch core exercises with retry and completes only after the final answer", () => {
    let session = createLessonSession(practicalDutchLessons[0], "practise");
    for (const exercise of practicalDutchLessons[0].practicalDutch!.coreExercises) {
      if (exercise.kind === "order") for (const token of exercise.tokens!) session = toggleLessonPracticeExerciseToken(session, token);
      else session = selectLessonPracticeExerciseAnswer(session, exercise.choices[0]);
      session = checkLessonPracticeExercise(session);
      expect(session.authoredResult).toBe("correct");
      session = advanceLessonPracticeExercise(session);
    }
    expect(session.stage).toBe("replay");
    expect(session.authoredExerciseIndex).toBe(6);
    let retry = createLessonSession(practicalDutchLessons[0], "practise");
    retry = selectLessonPracticeExerciseAnswer(retry, practicalDutchLessons[0].practicalDutch!.coreExercises[0].choices[1]);
    expect(checkLessonPracticeExercise(retry).authoredResult).toBe("incorrect");
    retry = { ...retry, authoredAnswer: null, authoredChecked: false, authoredResult: null };
    retry = selectLessonPracticeExerciseAnswer(retry, practicalDutchLessons[0].practicalDutch!.coreExercises[0].choices[0]);
    expect(checkLessonPracticeExercise(retry).authoredResult).toBe("correct");
  });

  it("filters lessons by readiness and CEFR level without treating completion as Continue", () => {
    const progress = { [appointmentLesson.id]: { lessonId: appointmentLesson.id, contentVersion: 1, stage: "notice" as const, completedAt: null, keptCandidateIds: [], updatedAt: 1 } };
    expect(getLessonAvailability(progress[appointmentLesson.id])).toBe("continue");
    expect(getLessonAvailability({ ...progress[appointmentLesson.id], completedAt: 2 })).toBe("completed");
    expect(getLessonAvailability(null)).toBe("ready");
    expect(filterLessons(lessonCatalog.lessons, progress, "continue", "all")).toEqual([appointmentLesson]);
    expect(filterLessons(lessonCatalog.lessons, progress, "ready", "A0").every((lesson) => lesson.cefr === "A0")).toBe(true);
    expect(filterLessons(lessonCatalog.lessons, { [appointmentLesson.id]: { ...progress[appointmentLesson.id], completedAt: 2 } }, "completed", "A1")).toEqual([appointmentLesson]);
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
    const practiceComplete = advanceLessonPractice(revealLessonPractice(thirdPractice), "got-it");
    const replay = advanceLessonStage(practiceComplete);
    const keep = advanceLessonStage(replay);

    expect(read.revealedLineIndexes).toEqual([0]);
    expect(notice.stage).toBe("notice");
    expect(practise).toMatchObject({ stage: "practise", practiceRevealed: false });
    expect(revealedFirstPractice.practiceRevealed).toBe(true);
    expect(practiceComplete).toMatchObject({ stage: "practise", practiceIndex: appointmentLesson.practice.length, practiceEvidence: [
      { candidateId: "ik-wil-graag", dimension: "recognition", result: "got-it" },
      { candidateId: "afspraak-maken", dimension: "recall", result: "again" },
      { candidateId: "als-het-kan", dimension: "recognition", result: "got-it" },
    ] });
    expect(getLessonCandidateChoices(keep, []).map((candidate) => candidate.checked)).toEqual([true, true, true, true]);
  });

  it("requires the tracer transfer check before moving from Replay to Keep", () => {
    const replay = createLessonSession(introductionLesson, "replay");
    const selected = selectLessonTransferAnswer(replay, "ik ben");
    const checked = checkLessonTransfer(selected);

    expect(checked.transferResult).toBe("correct");
    expect(advanceLessonTransfer(checked).stage).toBe("keep");
    expect(advanceLessonTransfer(replay)).toEqual(replay);
  });

  it("requires transfer checks for every remaining A0 lesson before Keep", () => {
    for (const lesson of [hebbenLesson, regularLesson, inversionLesson]) {
      const replay = createLessonSession(lesson, "replay");
      const transfer = lesson.practiceEnvelope!.transfer;
      const checked = checkLessonTransfer(selectLessonTransferAnswer(replay, transfer.accepted[0]));

      expect(checked.transferResult).toBe("correct");
      expect(advanceLessonTransfer(checked).stage).toBe("keep");
    }
  });

  it("runs the three additional authored exercise types before the existing transfer", () => {
    let session = createLessonSession(appointmentLesson, "practise");
    for (const result of ["got-it", "again", "got-it"] as const) {
      session = advanceLessonPractice({ ...session, practiceRevealed: true }, result);
    }
    expect(session.stage).toBe("practise");
    expect(session.practiceIndex).toBe(appointmentLesson.practice.length);
    expect(session.authoredExerciseIndex).toBe(0);

    const first = session.lesson.practiceExercises[0];
    session = checkLessonPracticeExercise(selectLessonPracticeExerciseAnswer(session, first.accepted[0]));
    expect(session.authoredResult).toBe("correct");
    session = advanceLessonPracticeExercise(session);

    const second = session.lesson.practiceExercises[1];
    session = checkLessonPracticeExercise(selectLessonPracticeExerciseAnswer(session, second.accepted[0]));
    session = advanceLessonPracticeExercise(session);

    const third = session.lesson.practiceExercises[2];
    for (const token of third.tokens!) session = toggleLessonPracticeExerciseToken(session, token);
    session = checkLessonPracticeExercise(session);
    expect(session.authoredResult).toBe("correct");
    session = advanceLessonPracticeExercise(session);
    expect(session).toMatchObject({ stage: "replay", authoredExerciseIndex: 3, practiceEvidence: expect.arrayContaining([
      { candidateId: "ik-wil-graag", dimension: "recognition", result: "got-it" },
    ]) });
    const transfer = appointmentLesson.practiceEnvelope!.transfer;
    const checkedTransfer = checkLessonTransfer(selectLessonTransferAnswer(session, transfer.accepted[0]));
    expect(advanceLessonTransfer(checkedTransfer).stage).toBe("keep");
  });
});
