import { getWeakerMasteryDimension, type DailyFiveDimension } from "../vocabulary/daily-five";
import type { LearningItem } from "../vocabulary/learning-record";

export type SavedQuizTask = { itemId: string; dimension: DailyFiveDimension; expectedAttemptCount: number };
export type SavedQuizSession = { tasks: SavedQuizTask[]; taskIndex: number; revealed: boolean };

export function createSavedQuizSession(items: LearningItem[], random: () => number = Math.random): SavedQuizSession {
  const tasks = items.map((item) => {
    const dimension = getWeakerMasteryDimension(item);
    return { itemId: item.id, dimension, expectedAttemptCount: item[dimension].attemptCount };
  });
  for (let index = tasks.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [tasks[index], tasks[swapIndex]] = [tasks[swapIndex], tasks[index]];
  }
  return { tasks, taskIndex: 0, revealed: false };
}

export function revealSavedQuiz(session: SavedQuizSession): SavedQuizSession { return { ...session, revealed: true }; }
export function getSavedQuizTask(session: SavedQuizSession): SavedQuizTask | null { return session.tasks[session.taskIndex] ?? null; }
export function advanceSavedQuiz(session: SavedQuizSession): SavedQuizSession { return { ...session, taskIndex: session.taskIndex + 1, revealed: false }; }
