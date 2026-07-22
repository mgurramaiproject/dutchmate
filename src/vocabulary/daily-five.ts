import type { LearningItem, LearningMastery, MasteryState } from "./learning-record";

const DAY_MS = 24 * 60 * 60 * 1_000;
const stateRank: Record<MasteryState, number> = { new: 0, learning: 1, familiar: 2, strong: 3 };

export type DailyFiveDimension = "recognition" | "recall";
export type DailyFiveResult = "again" | "got-it";
export type DailyFiveTask = { itemId: string; dimension: DailyFiveDimension };
export type DailyFiveSnapshot = { createdAt: number; dayStartAt: number; tasks: DailyFiveTask[]; completedTaskIds: string[]; goalCompleted: boolean };

export function createDailyFiveSnapshot(items: LearningItem[], now: number, lastDirection?: DailyFiveDimension): DailyFiveSnapshot {
  const due = items.flatMap((item) => {
    const dimension = getDueDimension(item, now, lastDirection);
    return dimension ? [{ item, dimension, dueAt: item[dimension].dueAt ?? Number.MAX_SAFE_INTEGER }] : [];
  }).sort((a, b) => a.dueAt - b.dueAt || a.item.createdAt - b.item.createdAt || a.item.id.localeCompare(b.item.id));
  const dueIds = new Set(due.map(({ item }) => item.id));
  const fresh = items.filter((item) => !dueIds.has(item.id)).flatMap((item) => {
    const dimension = getUnattemptedDimension(item, now);
    return dimension ? [{ item, dimension }] : [];
  }).sort((a, b) => a.item.createdAt - b.item.createdAt || a.item.id.localeCompare(b.item.id));
  return { createdAt: now, dayStartAt: getLocalDayStart(now), tasks: [...due, ...fresh].slice(0, 5).map(({ item, dimension }) => ({ itemId: item.id, dimension })), completedTaskIds: [], goalCompleted: false };
}

export function applyDailyFiveResult(item: LearningItem, dimension: DailyFiveDimension, result: DailyFiveResult, now: number): { item: LearningItem; mastery: LearningMastery } {
  const current = item[dimension];
  const mastery = result === "got-it" ? applySuccess(current, now) : applyAgain(current, now);
  return { item: { ...item, [dimension]: mastery, updatedAt: Math.max(item.updatedAt, now) }, mastery };
}

export function getOverallMastery(item: LearningItem): MasteryState {
  return stateRank[item.recognition.state] <= stateRank[item.recall.state] ? item.recognition.state : item.recall.state;
}

export function getWeakerMasteryDimension(item: LearningItem): DailyFiveDimension {
  return (["recognition", "recall"] as DailyFiveDimension[]).sort((first, second) =>
    stateRank[item[first].state] - stateRank[item[second].state]
      || (item[first].dueAt ?? Number.MAX_SAFE_INTEGER) - (item[second].dueAt ?? Number.MAX_SAFE_INTEGER)
      || (first === "recognition" ? -1 : 1),
  )[0];
}

function getDueDimension(item: LearningItem, now: number, lastDirection?: DailyFiveDimension): DailyFiveDimension | null {
  const eligible = (["recognition", "recall"] as const).filter((dimension) => item[dimension].attemptCount > 0 && item[dimension].dueAt !== null && item[dimension].dueAt <= now);
  if (eligible.length === 0) return null;
  return eligible.sort((first, second) => stateRank[item[first].state] - stateRank[item[second].state] || (item[first].dueAt ?? 0) - (item[second].dueAt ?? 0) || (lastDirection === first ? 1 : lastDirection === second ? -1 : first.localeCompare(second)))[0];
}

function getUnattemptedDimension(item: LearningItem, now: number): DailyFiveDimension | null {
  if (item.recognition.attemptCount === 0) return "recognition";
  return item.recall.attemptCount === 0 && (item.recognition.lastPractisedAt === null || getLocalDayStart(item.recognition.lastPractisedAt) < getLocalDayStart(now)) ? "recall" : null;
}

export function getLocalDayStart(timestamp: number): number { const date = new Date(timestamp); date.setHours(0, 0, 0, 0); return date.getTime(); }

function applySuccess(current: LearningMastery, now: number): LearningMastery {
  const next: Record<MasteryState, [MasteryState, number]> = { new: ["learning", 1], learning: ["familiar", 3], familiar: ["strong", 7], strong: ["strong", Math.min(Math.max(current.intervalDays * 2, 14), 60)] };
  const [state, intervalDays] = next[current.state];
  return { ...current, state, intervalDays, dueAt: now + intervalDays * DAY_MS, attemptCount: current.attemptCount + 1, successfulStreak: current.successfulStreak + 1, lastPractisedAt: now };
}

function applyAgain(current: LearningMastery, now: number): LearningMastery {
  const state: MasteryState = current.state === "strong" ? "familiar" : current.state === "familiar" ? "learning" : "learning";
  return { ...current, state, intervalDays: 1, dueAt: now + DAY_MS, attemptCount: current.attemptCount + 1, successfulStreak: 0, lastPractisedAt: now };
}
