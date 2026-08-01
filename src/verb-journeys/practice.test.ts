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

  it("keeps each core journey on its own authored exercise pack", () => {
    const packs = [
      ["journey.werken.ott-routine", "OTT", "Ik werk meestal thuis."],
      ["journey.werken.vtt-completed", "VTT", "Ik heb gisteren thuis gewerkt."],
      ["journey.werken.ovt-background", "OVT", "Vroeger werkte ik vaak in een café."],
      ["journey.werken.vvt-earlier-past", "VVT", "Ik had al thuis gewerkt voordat de vergadering begon."],
      ["journey.werken.future-possibility", "OVTT", "Als het regent, zou ik thuis werken."],
      ["journey.werken.reference-completed-future", "VTTT", "Voor het einde van de dag zal ik acht uur gewerkt hebben."],
    ] as const;

    for (const [journeyId, tense, context] of packs) {
      const questions = getVerbPracticeQuestions(journeyId);
      expect(questions).toHaveLength(5);
      expect(questions.every((question) => question.journeyId === journeyId)).toBe(true);
      expect(questions[0].context).toBe(context);
      expect(questions[3].accepted[0]).toContain(`${tense} ·`);
    }
  });

  it("completes each authored journey after five correct decisions", () => {
    const journeyIds = [
      "journey.werken.ott-routine",
      "journey.werken.vtt-completed",
      "journey.werken.ovt-background",
      "journey.werken.vvt-earlier-past",
      "journey.werken.future-possibility",
      "journey.werken.reference-completed-future",
    ] as const;
    for (const journeyId of journeyIds) {
      let session = createVerbPracticeSession(journeyId);
      for (const question of getVerbPracticeQuestions(journeyId)) {
        session = advanceVerbPractice(checkVerbPracticeAnswer(session, question.accepted[0]).session);
      }
      expect(session.completed, journeyId).toBe(true);
    }
  });
});

describe("zijn identity practice", () => {
  it("provides its own five-family question set", () => {
    const questions = getVerbPracticeQuestions("journey.zijn.ott-identity");
    expect(questions).toHaveLength(5);
    expect(questions.every((question) => question.verbId === "verb.zijn")).toBe(true);
    expect(questions.map((question) => question.kind)).toEqual([
      "choice",
      "token-slots",
      "choice",
      "map-placement",
      "token-order",
    ]);
  });

  it("completes the zijn identity journey with controlled answers", () => {
    let session = createVerbPracticeSession("journey.zijn.ott-identity");
    for (const question of getVerbPracticeQuestions("journey.zijn.ott-identity")) {
      session = advanceVerbPractice(checkVerbPracticeAnswer(session, question.accepted[0]).session);
    }
    expect(session.completed).toBe(true);
  });
});

describe("zijn question and past-state practice", () => {
  it.each(["journey.zijn.ott-questions", "journey.zijn.ovt-state"] as const)("keeps %s on its own five-family bank", (journeyId) => {
    const questions = getVerbPracticeQuestions(journeyId);
    expect(questions).toHaveLength(5);
    expect(questions.every((question) => question.verbId === "verb.zijn" && question.journeyId === journeyId)).toBe(true);
    expect(new Set(questions.map((question) => question.exerciseFamily))).toHaveLength(5);
  });

  it.each(["journey.zijn.ott-questions", "journey.zijn.ovt-state"] as const)("completes %s with controlled answers", (journeyId) => {
    let session = createVerbPracticeSession(journeyId);
    for (const question of getVerbPracticeQuestions(journeyId)) session = advanceVerbPractice(checkVerbPracticeAnswer(session, question.accepted[0]).session);
    expect(session.completed).toBe(true);
  });
});

describe("zijn past-experience practice", () => {
  it("keeps the completed experience journey deterministic and bounded", () => {
    const questions = getVerbPracticeQuestions("journey.zijn.vtt-experience");
    expect(questions).toHaveLength(5);
    expect(questions.every((question) => question.verbId === "verb.zijn" && question.journeyId === "journey.zijn.vtt-experience")).toBe(true);
    expect(questions[4].delayedOrRecombined).toBe(true);
  });

  it("records a delayed decision as part of the existing practice session", () => {
    let session = createVerbPracticeSession("journey.zijn.vtt-experience");
    for (const question of getVerbPracticeQuestions("journey.zijn.vtt-experience")) session = advanceVerbPractice(checkVerbPracticeAnswer(session, question.accepted[0]).session);
    expect(session.completed).toBe(true);
    expect(session.attempts.some((attempt) => attempt.questionId.endsWith("word-order") && attempt.correct)).toBe(true);
  });
});

describe("zijn later and reference practice", () => {
  it.each(["journey.zijn.future-conditional", "journey.zijn.reference-completed"] as const)("keeps %s complete and playable", (journeyId) => {
    const questions = getVerbPracticeQuestions(journeyId);
    expect(questions).toHaveLength(5);
    expect(questions.every((question) => question.verbId === "verb.zijn" && question.journeyId === journeyId)).toBe(true);
    expect(new Set(questions.map((question) => question.exerciseFamily))).toHaveLength(5);
  });

  it.each(["journey.zijn.future-conditional", "journey.zijn.reference-completed"] as const)("completes %s without a placeholder path", (journeyId) => {
    let session = createVerbPracticeSession(journeyId);
    for (const question of getVerbPracticeQuestions(journeyId)) session = advanceVerbPractice(checkVerbPracticeAnswer(session, question.accepted[0]).session);
    expect(session.completed).toBe(true);
  });
});
