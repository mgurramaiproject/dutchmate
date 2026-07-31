import { describe, expect, it } from "vitest";
import { createVerbPracticeSession, getCurrentVerbPracticeQuestion, getVerbPracticeQuestions, checkVerbPracticeAnswer, advanceVerbPractice } from "./practice";

describe("werken VTT practice", () => {
  it("provides the five required authored question families", () => {
    expect(getVerbPracticeQuestions().map((question) => question.kind)).toEqual([
      "choice",
      "token-slots",
      "choice",
      "map-placement",
      "token-order",
    ]);
    expect(getVerbPracticeQuestions()).toHaveLength(5);
  });

  it("completes deterministically after five correct decisions", () => {
    let session = createVerbPracticeSession();
    for (const question of getVerbPracticeQuestions()) {
      session = checkVerbPracticeAnswer(session, question.accepted[0]).session;
      session = advanceVerbPractice(session);
    }
    expect(session.completed).toBe(true);
    expect(session.attempts.filter((attempt) => attempt.phase === "core")).toHaveLength(5);
    expect(session.attempts.every((attempt) => attempt.correct)).toBe(true);
  });

  it("routes a supported error through no more than two authored repairs", () => {
    let session = createVerbPracticeSession();
    const firstQuestion = getCurrentVerbPracticeQuestion(session)!;
    session = checkVerbPracticeAnswer(session, firstQuestion.choices?.[0] ?? "wrong").session;
    expect(session.repairQueue.length).toBeLessThanOrEqual(2);
    session = advanceVerbPractice(session);
    expect(getCurrentVerbPracticeQuestion(session)?.phase).toBe("repair");
    for (let index = 0; index < 2 && !session.completed; index += 1) {
      const question = getCurrentVerbPracticeQuestion(session)!;
      session = checkVerbPracticeAnswer(session, question.accepted[0]).session;
      session = advanceVerbPractice(session);
    }
    expect(session.attempts.filter((attempt) => attempt.phase === "repair").length).toBeLessThanOrEqual(2);
  });

  it("keeps the two-repair cap across later incorrect core answers", () => {
    let session = createVerbPracticeSession();
    const first = getCurrentVerbPracticeQuestion(session)!;
    session = advanceVerbPractice(checkVerbPracticeAnswer(session, first.choices?.[0] ?? "wrong").session);
    for (let index = 0; index < 2; index += 1) {
      const repair = getCurrentVerbPracticeQuestion(session)!;
      session = advanceVerbPractice(checkVerbPracticeAnswer(session, repair.accepted[0]).session);
    }
    const secondCore = getCurrentVerbPracticeQuestion(session)!;
    const afterSecondError = checkVerbPracticeAnswer(session, secondCore.choices?.[0] ?? "wrong").session;
    expect(afterSecondError.repairQueue).toEqual([]);
    expect(afterSecondError.repairCount).toBe(2);
  });

  it("keeps incorrect feedback authored and repeatable", () => {
    const session = createVerbPracticeSession();
    const question = getCurrentVerbPracticeQuestion(session)!;
    const first = checkVerbPracticeAnswer(session, question.choices![0]);
    const second = checkVerbPracticeAnswer(session, question.choices![0]);
    expect(first.result).toEqual(second.result);
    expect(first.result.correct).toBe(false);
    expect(first.result.feedback).toContain("completed");
  });
});
