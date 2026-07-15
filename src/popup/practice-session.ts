import type { ReviewCard } from "../vocabulary/review-cards";

export type PracticeSessionState = {
  queue: ReviewCard[];
  currentIndex: number;
  revealed: boolean;
  completed: boolean;
};

export function createPracticeSession(queue: ReviewCard[]): PracticeSessionState {
  return {
    queue: [...queue],
    currentIndex: 0,
    revealed: false,
    completed: queue.length === 0,
  };
}

export function revealPracticeAnswer(session: PracticeSessionState): PracticeSessionState {
  return { ...session, revealed: true };
}

export function advancePracticeSession(
  session: PracticeSessionState,
  reviewedCard: ReviewCard,
): PracticeSessionState {
  const queue = session.queue.map((card, index) =>
    index === session.currentIndex ? reviewedCard : card,
  );
  const currentIndex = session.currentIndex + 1;

  return {
    queue,
    currentIndex,
    revealed: false,
    completed: currentIndex >= queue.length,
  };
}

export function getCurrentPracticeCard(session: PracticeSessionState): ReviewCard | null {
  return session.completed ? null : session.queue[session.currentIndex] ?? null;
}
