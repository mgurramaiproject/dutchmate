import type { TranslationRequest, TranslationResult } from "../translation/provider";
import type { ExtensionSettings } from "../shared/settings";
import type { CreateOrMergeLearningItemInput, LearningBackup, LearningItem, LessonProgress, LessonProgressStage } from "../vocabulary/learning-record";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import type { DailyFiveDimension, DailyFiveResult, DailyFiveSnapshot } from "../vocabulary/daily-five";

export const TRANSLATE_MESSAGE = "hoverTranslate.translate";
export const REVIEW_SETTINGS_MESSAGE = "dutchmate.review.settings";
export const REVIEW_SETTINGS_UPDATE_MESSAGE = "dutchmate.review.settings.update";
export const LEARNING_LIST_MESSAGE = "dutchmate.learning.list";
export const LEARNING_SUMMARY_MESSAGE = "dutchmate.learning.summary";
export const LEARNING_RHYTHM_MESSAGE = "dutchmate.learning.rhythm";
export const LEARNING_CREATE_OR_MERGE_MESSAGE = "dutchmate.learning.createOrMerge";
export const LEARNING_DELETE_MESSAGE = "dutchmate.learning.delete";
export const LEARNING_CLEAR_MESSAGE = "dutchmate.learning.clear";
export const LEARNING_EXPORT_MESSAGE = "dutchmate.learning.export";
export const LEARNING_IMPORT_MESSAGE = "dutchmate.learning.import";
export const LEARNING_RECORD_ENCOUNTER_MESSAGE = "dutchmate.learning.recordEncounter";
export const LEARNING_RECORD_MISSION_RESULT_MESSAGE = "dutchmate.learning.recordMissionResult";
export const LEARNING_DAILY_FIVE_MESSAGE = "dutchmate.learning.dailyFive";
export const LEARNING_DAILY_FIVE_RESULT_MESSAGE = "dutchmate.learning.dailyFive.result";
export const LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE = "dutchmate.learning.keepLessonCandidates";
export const LEARNING_LESSON_PROGRESS_MESSAGE = "dutchmate.learning.lessonProgress";
export const LEARNING_SAVE_LESSON_PROGRESS_MESSAGE = "dutchmate.learning.lessonProgress.save";

export type ReviewSettingsChanges = Pick<ExtensionSettings, "autoSaveSelectedWords" | "showExampleSentence" | "dailyReviewBadge">;
export type TranslateMessage = { type: typeof TRANSLATE_MESSAGE; payload: TranslationRequest };
export type SettingsMessage = { type: typeof REVIEW_SETTINGS_MESSAGE } | { type: typeof REVIEW_SETTINGS_UPDATE_MESSAGE; payload: Partial<ReviewSettingsChanges> };
export type LearningMessage =
  | { type: typeof LEARNING_LIST_MESSAGE }
  | { type: typeof LEARNING_SUMMARY_MESSAGE }
  | { type: typeof LEARNING_RHYTHM_MESSAGE }
  | { type: typeof LEARNING_CREATE_OR_MERGE_MESSAGE; payload: CreateOrMergeLearningItemInput }
  | { type: typeof LEARNING_DELETE_MESSAGE; payload: { id: string } }
  | { type: typeof LEARNING_CLEAR_MESSAGE }
  | { type: typeof LEARNING_EXPORT_MESSAGE }
  | { type: typeof LEARNING_IMPORT_MESSAGE; payload: { document: string } }
  | { type: typeof LEARNING_RECORD_ENCOUNTER_MESSAGE; payload: { id: string; context: string } }
  | { type: typeof LEARNING_RECORD_MISSION_RESULT_MESSAGE; payload: { itemId: string; dimension: DailyFiveDimension; result: DailyFiveResult; expectedAttemptCount: number } }
  | { type: typeof LEARNING_DAILY_FIVE_MESSAGE; payload?: { continueAfterCompletion?: boolean } }
  | { type: typeof LEARNING_DAILY_FIVE_RESULT_MESSAGE; payload: { itemId: string; dimension: DailyFiveDimension; result: DailyFiveResult } }
  | { type: typeof LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE; payload: { lessonId: string; candidateIds: string[]; evidence: Array<{ candidateId: string; dimension: DailyFiveDimension; result: DailyFiveResult }> } }
  | { type: typeof LEARNING_LESSON_PROGRESS_MESSAGE; payload: { lessonId: string } }
  | { type: typeof LEARNING_SAVE_LESSON_PROGRESS_MESSAGE; payload: { lessonId: string; stage: LessonProgressStage } };

export type TranslateMessageResponse = { ok: true; result: TranslationResult } | { ok: false; error: string };
export type SettingsMessageResponse = { ok: true; result: { settings: ExtensionSettings } } | { ok: false; error: string };
export type LearningMessageResponse = { ok: true; result: { items: LearningItem[] } | { total: number; due: number; new: number; recent: LearningItem[] } | { rhythm: LearningRhythm } | { item: LearningItem } | { deleted: true } | { cleared: true } | { backup: LearningBackup } | { importedCount: number; totalCount: number; items: LearningItem[] } | { recorded: true } | { snapshot: DailyFiveSnapshot } | { item: LearningItem; snapshot: DailyFiveSnapshot } | { progress: LessonProgress | null } } | { ok: false; error: string };
export type BackgroundMessageResponse = TranslateMessageResponse | SettingsMessageResponse | LearningMessageResponse;

export function isTranslateMessage(message: unknown): message is TranslateMessage {
  return typeof message === "object" && message !== null && "type" in message && message.type === TRANSLATE_MESSAGE && "payload" in message && typeof message.payload === "object" && message.payload !== null;
}

export function isLearningMessage(message: unknown): message is LearningMessage {
  if (typeof message !== "object" || message === null || !("type" in message)) return false;
  if (message.type === LEARNING_LIST_MESSAGE || message.type === LEARNING_SUMMARY_MESSAGE || message.type === LEARNING_RHYTHM_MESSAGE || message.type === LEARNING_CLEAR_MESSAGE || message.type === LEARNING_EXPORT_MESSAGE) return true;
  if (message.type === LEARNING_DAILY_FIVE_MESSAGE) { const payload = "payload" in message ? message.payload : undefined; return payload === undefined || (typeof payload === "object" && payload !== null && (!("continueAfterCompletion" in payload) || typeof payload.continueAfterCompletion === "boolean")); }
  if (!("payload" in message) || typeof message.payload !== "object" || message.payload === null) return false;
  const payload = message.payload as Record<string, unknown>;
  if (message.type === LEARNING_DELETE_MESSAGE) return typeof payload.id === "string";
  if (message.type === LEARNING_LESSON_PROGRESS_MESSAGE) return typeof payload.lessonId === "string";
  if (message.type === LEARNING_SAVE_LESSON_PROGRESS_MESSAGE) return typeof payload.lessonId === "string" && (payload.stage === "read" || payload.stage === "notice" || payload.stage === "practise" || payload.stage === "replay" || payload.stage === "keep");
  if (message.type === LEARNING_RECORD_ENCOUNTER_MESSAGE) return typeof payload.id === "string" && typeof payload.context === "string";
  if (message.type === LEARNING_RECORD_MISSION_RESULT_MESSAGE) return typeof payload.itemId === "string" && (payload.dimension === "recognition" || payload.dimension === "recall") && (payload.result === "again" || payload.result === "got-it") && typeof payload.expectedAttemptCount === "number" && Number.isInteger(payload.expectedAttemptCount) && payload.expectedAttemptCount >= 0;
  if (message.type === LEARNING_DAILY_FIVE_RESULT_MESSAGE) return typeof payload.itemId === "string" && (payload.dimension === "recognition" || payload.dimension === "recall") && (payload.result === "again" || payload.result === "got-it");
  if (message.type === LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE) return typeof payload.lessonId === "string" && Array.isArray(payload.candidateIds) && payload.candidateIds.every((id) => typeof id === "string") && Array.isArray(payload.evidence) && payload.evidence.every((entry) => typeof entry === "object" && entry !== null && "candidateId" in entry && typeof entry.candidateId === "string" && "dimension" in entry && (entry.dimension === "recognition" || entry.dimension === "recall") && "result" in entry && (entry.result === "again" || entry.result === "got-it"));
  if (message.type === LEARNING_IMPORT_MESSAGE) return typeof payload.document === "string";
  return message.type === LEARNING_CREATE_OR_MERGE_MESSAGE && typeof payload.dutch === "string" && (payload.kind === undefined || payload.kind === "word" || payload.kind === "chunk") && (payload.english === undefined || payload.english === null || typeof payload.english === "string") && (payload.telugu === undefined || payload.telugu === null || typeof payload.telugu === "string") && (payload.context === undefined || payload.context === null || typeof payload.context === "string") && (payload.contextTranslations === undefined || payload.contextTranslations === null || isContextTranslations(payload.contextTranslations)) && (payload.source === undefined || payload.source === "webpage" || payload.source === "lesson");
}

function isContextTranslations(value: unknown): value is { english: string; telugu: string } { return typeof value === "object" && value !== null && "english" in value && typeof value.english === "string" && "telugu" in value && typeof value.telugu === "string"; }

export function isSettingsMessage(message: unknown): message is SettingsMessage {
  if (typeof message !== "object" || message === null || !("type" in message)) return false;
  if (message.type === REVIEW_SETTINGS_MESSAGE) return true;
  if (message.type !== REVIEW_SETTINGS_UPDATE_MESSAGE || !("payload" in message) || typeof message.payload !== "object" || message.payload === null) return false;
  const payload = message.payload as Record<string, unknown>; const keys = Object.keys(payload);
  return keys.length > 0 && keys.every((key) => key === "autoSaveSelectedWords" || key === "showExampleSentence" || key === "dailyReviewBadge") && (payload.autoSaveSelectedWords === undefined || typeof payload.autoSaveSelectedWords === "boolean") && (payload.showExampleSentence === undefined || typeof payload.showExampleSentence === "boolean") && (payload.dailyReviewBadge === undefined || typeof payload.dailyReviewBadge === "boolean");
}
