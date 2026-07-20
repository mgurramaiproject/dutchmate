import { describe, expect, it } from "vitest";
import { advanceLessonStage, createLessonSession, toggleLessonCandidate } from "./lesson-session";
import { appointmentLesson } from "../lessons/catalog";

describe("lesson session", () => {
  it("moves through Read, Notice, Practise, Replay, and Keep while retaining candidate choice", () => {
    const session = createLessonSession(appointmentLesson);
    const withoutFirst = toggleLessonCandidate(session, appointmentLesson.candidates[0].id);
    const progressed = [1, 2, 3, 4].reduce((state) => advanceLessonStage(state), withoutFirst);

    expect(progressed.stage).toBe("keep");
    expect(progressed.selectedCandidateIds).not.toContain(appointmentLesson.candidates[0].id);
  });
});
