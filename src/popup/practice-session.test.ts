import { describe, expect, it } from "vitest";
import {
  advancePracticeSession,
  createPracticeSession,
  revealPracticeAnswer,
  type PracticeSessionState,
} from "./practice-session";
import type { ReviewCard } from "../vocabulary/review-cards";

describe("practice session state", () => {
  it("keeps a queue snapshot and starts on the front of the first card", () => {
    const queue = [card("huis"), card("boom")];
    const session = createPracticeSession(queue);

    queue.reverse();

    expect(session).toEqual({
      queue: [card("huis"), card("boom")],
      mode: "new",
      currentIndex: 0,
      revealed: false,
      completed: false,
    });
  });

  it("reveals the answer without changing the queue position", () => {
    const session = createPracticeSession([card("huis"), card("boom")]);

    expect(revealPracticeAnswer(session)).toMatchObject({
      currentIndex: 0,
      revealed: true,
      completed: false,
    });
  });

  it("advances after a rating and ends after the last card", () => {
    const first = card("huis");
    const second = card("boom");
    const session: PracticeSessionState = {
      queue: [first, second],
      mode: "new",
      currentIndex: 0,
      revealed: true,
      completed: false,
    };

    const next = advancePracticeSession(session, { ...first, lastRating: "good" });
    expect(next).toEqual({
      queue: [{ ...first, lastRating: "good" }, second],
      mode: "new",
      currentIndex: 1,
      revealed: false,
      completed: false,
    });

    expect(advancePracticeSession(next, { ...second, lastRating: "easy" })).toEqual({
      queue: [{ ...first, lastRating: "good" }, { ...second, lastRating: "easy" }],
      mode: "new",
      currentIndex: 2,
      revealed: false,
      completed: true,
    });
  });
});

function card(dutch: string): ReviewCard {
  return {
    id: `nl\u001f${dutch}`,
    dutch,
    english: dutch === "huis" ? "house" : "tree",
    telugu: null,
    pageContext: null,
    createdAt: 1_000,
    updatedAt: 1_000,
    dueAt: null,
    lastReviewedAt: null,
    lastRating: null,
    reviewCount: 0,
  };
}
