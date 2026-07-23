import { getLocalDayStart } from "./daily-five";
import type { LearningItem, LessonProgress } from "./learning-record";

export type LearningRhythmDay = { dayStartAt: number; status: "active" | "grace" | "idle" };
export type LearningActivityDay = { dayStartAt: number; reviews: number | null; saved: number | null; lessons: number | null; lessonAdditions?: number };
export type LearningMilestone = { id: string; label: string };
export type LearningRhythm = { week: LearningRhythmDay[]; activity: LearningActivityDay[]; resetCopy: string | null; milestones: LearningMilestone[] };

type LessonDefinition = { id: string; pathway: string; contentVersion: number };

export function getLearningRhythm(items: LearningItem[], lessonProgress: Record<string, unknown>, rhythm: Record<string, unknown>, now: number, lessons: LessonDefinition[]): LearningRhythm {
  const today = getLocalDayStart(now);
  const activeDays = getActiveDays(rhythm, lessonProgress);
  const recentActive = [...activeDays].some((day) => day >= localDayOffset(today, -2));
  const yesterday = localDayOffset(today, -1);
  const grace = !activeDays.has(yesterday) && [...activeDays].some((day) => day >= localDayOffset(today, -2) && day < yesterday);
  return {
    week: Array.from({ length: 7 }, (_, index) => {
      const dayStartAt = localDayOffset(today, index - 6);
      return { dayStartAt, status: activeDays.has(dayStartAt) ? "active" : grace && dayStartAt === yesterday ? "grace" : "idle" };
    }),
    activity: getActivityDays(rhythm, activeDays),
    resetCopy: activeDays.size > 0 && !recentActive ? "A fresh week starts whenever you return." : null,
    milestones: getMilestones(items, lessonProgress, lessons),
  };
}

function getActiveDays(rhythm: Record<string, unknown>, lessonProgress: Record<string, unknown>): Set<number> {
  const active = new Set<number>();
  for (const source of [rhythm.activeDays, rhythm.dailyFiveCompletions, rhythm.lessonCompletions, rhythm.activityDays]) {
    if (!isRecord(source)) continue;
    for (const key of Object.keys(source)) if (Number.isFinite(Number(key))) active.add(Number(key));
  }
  for (const value of Object.values(lessonProgress)) {
    const progress = parseLessonProgress(value);
    if (progress && progress.completedAt !== null) active.add(getLocalDayStart(progress.completedAt));
  }
  return active;
}

function getActivityDays(rhythm: Record<string, unknown>, activeDays: Set<number>): LearningActivityDay[] {
  const counts = isRecord(rhythm.activityDays) ? rhythm.activityDays : {};
  return [...activeDays].sort((a, b) => a - b).map((dayStartAt) => {
    const value = counts[String(dayStartAt)];
    const lessonAdditions = isRecord(value) && finiteCount(value.lessonAdditions) ? value.lessonAdditions : 0;
    return {
      dayStartAt,
      reviews: isRecord(value) && finiteCount(value.reviews) ? value.reviews : null,
      saved: isRecord(value) && finiteCount(value.saved) ? value.saved : null,
      lessons: isRecord(value) && finiteCount(value.lessons) ? value.lessons : null,
      ...(lessonAdditions > 0 ? { lessonAdditions } : {}),
    };
  });
}

function finiteCount(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value) && value >= 0; }

function getMilestones(items: LearningItem[], lessonProgress: Record<string, unknown>, lessons: LessonDefinition[]): LearningMilestone[] {
  const milestones: LearningMilestone[] = [];
  if (items.some((item) => item.kind === "chunk")) milestones.push({ id: "first-saved-chunk", label: "First useful phrase saved" });
  if (items.some((item) => item.recognition.attemptCount > 0 && item.recall.attemptCount > 0)) milestones.push({ id: "balanced-practice", label: "Recognition and recall practised" });
  const progressByLesson = new Map(Object.values(lessonProgress).map(parseLessonProgress).filter((progress): progress is LessonProgress => progress !== null).map((progress) => [progress.lessonId, progress]));
  const pathways = new Map<string, LessonDefinition[]>();
  for (const lesson of lessons) pathways.set(lesson.pathway, [...(pathways.get(lesson.pathway) ?? []), lesson]);
  for (const [pathway, pathwayLessons] of pathways) {
    if (pathwayLessons.every((lesson) => { const progress = progressByLesson.get(lesson.id); return progress?.contentVersion === lesson.contentVersion && progress.completedAt !== null; })) milestones.push({ id: `pathway:${pathway}`, label: `${pathway.replaceAll("-", " ")} pathway completed` });
  }
  return milestones;
}

function localDayOffset(dayStartAt: number, offset: number): number { const date = new Date(dayStartAt); date.setDate(date.getDate() + offset); return getLocalDayStart(date.getTime()); }
function parseLessonProgress(value: unknown): LessonProgress | null { return isRecord(value) && typeof value.lessonId === "string" && typeof value.contentVersion === "number" && (typeof value.completedAt === "number" || value.completedAt === null) ? value as LessonProgress : null; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
