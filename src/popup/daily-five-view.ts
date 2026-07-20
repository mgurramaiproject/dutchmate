import type { DailyFiveSnapshot, DailyFiveTask } from "../vocabulary/daily-five";

export type DailyFiveView = { status: "empty" | "ready" | "in-progress" | "complete"; actionLabel: string | null; completed: number; total: number };

export function getDailyFiveView(snapshot: DailyFiveSnapshot): DailyFiveView {
  const completed = snapshot.completedTaskIds.length;
  if (snapshot.tasks.length === 0) return { status: "empty", actionLabel: null, completed, total: 0 };
  if (snapshot.goalCompleted) return { status: "complete", actionLabel: "Practise another five", completed, total: snapshot.tasks.length };
  return { status: completed === 0 ? "ready" : "in-progress", actionLabel: completed === 0 ? "Start Daily Five" : "Continue Daily Five", completed, total: snapshot.tasks.length };
}

export function getDailyFiveReviewView(snapshot: DailyFiveSnapshot, revealed: boolean): { task: DailyFiveTask | null; phase: "front" | "answer" | "complete"; canSubmitResult: boolean } {
  const task = snapshot.tasks[snapshot.completedTaskIds.length] ?? null;
  return { task, phase: task ? (revealed ? "answer" : "front") : "complete", canSubmitResult: task !== null && revealed };
}
