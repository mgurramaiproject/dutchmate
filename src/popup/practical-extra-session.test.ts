import { describe, expect, it } from "vitest";
import { contentCatalog } from "../content-catalog";
import { advancePracticalExtra, checkPracticalExtraAnswer, createPracticalExtraSession, retryPracticalExtra, selectPracticalExtraAnswer, togglePracticalExtraToken } from "./practical-extra-session";

describe("Practical Dutch extra session", () => {
  it("is deterministic, retryable, and advances without changing completion", () => {
    const lesson = contentCatalog.getPracticalDutchTopic()!.lessons[0];
    let session = createPracticalExtraSession(lesson);
    session = selectPracticalExtraAnswer(session, lesson.extraExercises[0].choices[1]);
    expect(checkPracticalExtraAnswer(session).result).toBe("incorrect");
    session = retryPracticalExtra(session);
    session = selectPracticalExtraAnswer(session, lesson.extraExercises[0].choices[0]);
    session = checkPracticalExtraAnswer(session);
    expect(advancePracticalExtra(session).index).toBe(1);
    const order = lesson.extraExercises.find((exercise) => exercise.kind === "order");
    if (order?.tokens) {
      let ordered = createPracticalExtraSession(lesson, lesson.extraExercises.indexOf(order));
      for (const token of order.tokens) ordered = togglePracticalExtraToken(ordered, token);
      expect(checkPracticalExtraAnswer(ordered).result).toBe("correct");
    }
  });
});
