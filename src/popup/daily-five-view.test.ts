import { describe, expect, it } from "vitest";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";

const task = { itemId: "nl\u001fhuis", dimension: "recognition" as const };

describe("Daily Five popup view", () => {
  it("expresses empty, ready, progress, and completion states with one action", () => {
    expect(getDailyFiveView({ createdAt: 1, dayStartAt: 0, tasks: [], completedTaskIds: [], goalCompleted: false })).toMatchObject({ status: "empty", actionLabel: null });
    expect(getDailyFiveView({ createdAt: 1, dayStartAt: 0, tasks: [task], completedTaskIds: [], goalCompleted: false })).toMatchObject({ status: "ready", actionLabel: "Start Daily Five" });
    expect(getDailyFiveView({ createdAt: 1, dayStartAt: 0, tasks: [task, { ...task, itemId: "nl\u001fboom" }], completedTaskIds: ["nl\u001fhuis\u001frecognition"], goalCompleted: false })).toMatchObject({ status: "in-progress", actionLabel: "Continue Daily Five", completed: 1 });
    expect(getDailyFiveView({ createdAt: 1, dayStartAt: 0, tasks: [task], completedTaskIds: ["nl\u001fhuis\u001frecognition"], goalCompleted: true })).toMatchObject({ status: "complete", actionLabel: "Practise another five" });
  });

  it("requires answer reveal before a binary result can be submitted", () => {
    const snapshot = { createdAt: 1, dayStartAt: 0, tasks: [task], completedTaskIds: [], goalCompleted: false };
    expect(getDailyFiveReviewView(snapshot, false)).toMatchObject({ phase: "front", canSubmitResult: false });
    expect(getDailyFiveReviewView(snapshot, true)).toMatchObject({ phase: "answer", canSubmitResult: true });
  });
});
