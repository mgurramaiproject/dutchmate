import type { TranslationRequest, TranslationResult } from "../translation/provider";
import type { ExtensionSettings } from "../shared/settings";
import type { CreateOrMergeLearningItemInput, LearningBackup, LearningContext, LearningItem, LessonProgress, LessonProgressStage } from "../vocabulary/learning-record";
import type { VerbJourneyRecord } from "../verb-journeys/learning";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import type { DailyFiveDimension, DailyFiveResult, DailyFiveSnapshot, VerbJourneyDailyFiveTask } from "../vocabulary/daily-five";
import type { GrammarRecord } from "../grammar/learning";
import type { GrammarPatternId } from "../lessons/catalog";
import type { ContrastRecord, ImmediateContrastRepairOffer } from "../grammar/contrast-learning";
import { contrastPack, type ContrastMisconceptionCode, type ContrastPackId } from "../grammar/contrast";
import { getVerbJourneyContentVersion, isVerbJourneyContentAvailable } from "../verb-journeys/content";
import type { VerbJourneyContentVersion } from "../verb-journeys/content";

export const TRANSLATE_MESSAGE = "hoverTranslate.translate";
export const REVIEW_SETTINGS_MESSAGE = "dutchmate.review.settings";
export const REVIEW_SETTINGS_UPDATE_MESSAGE = "dutchmate.review.settings.update";
export const LEARNING_LIST_MESSAGE = "dutchmate.learning.list";
export const LEARNING_SUMMARY_MESSAGE = "dutchmate.learning.summary";
export const LEARNING_RHYTHM_MESSAGE = "dutchmate.learning.rhythm";
export const LEARNING_CREATE_OR_MERGE_MESSAGE = "dutchmate.learning.createOrMerge";
export const LEARNING_DELETE_MESSAGE = "dutchmate.learning.delete";
export const LEARNING_REMOVE_CONTEXT_MESSAGE = "dutchmate.learning.removeContext";
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
export const LEARNING_GRAMMAR_MESSAGE = "dutchmate.learning.grammar";
export const LEARNING_GRAMMAR_INTRODUCE_MESSAGE = "dutchmate.learning.grammar.introduce";
export const LEARNING_GRAMMAR_RESULT_MESSAGE = "dutchmate.learning.grammar.result";
export const LEARNING_CONTRAST_MESSAGE = "dutchmate.learning.contrast";
export const LEARNING_CONTRAST_INTRODUCE_MESSAGE = "dutchmate.learning.contrast.introduce";
export const LEARNING_CONTRAST_RESULT_MESSAGE = "dutchmate.learning.contrast.result";
export const LEARNING_VERB_JOURNEY_MESSAGE = "dutchmate.learning.verbJourney";
export const LEARNING_VERB_JOURNEY_RESULT_MESSAGE = "dutchmate.learning.verbJourney.result";
export const LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE = "dutchmate.learning.verbJourney.complete";
export const LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE = "dutchmate.learning.verbJourney.dailyFive.result";

export type ReviewSettingsChanges = Pick<ExtensionSettings, "autoSaveSelectedWords" | "showExampleSentence" | "dailyReviewBadge">;
export type TranslateMessage = { type: typeof TRANSLATE_MESSAGE; payload: TranslationRequest };
export type SettingsMessage = { type: typeof REVIEW_SETTINGS_MESSAGE } | { type: typeof REVIEW_SETTINGS_UPDATE_MESSAGE; payload: Partial<ReviewSettingsChanges> };
export type LearningMessage =
  | { type: typeof LEARNING_LIST_MESSAGE }
  | { type: typeof LEARNING_SUMMARY_MESSAGE }
  | { type: typeof LEARNING_RHYTHM_MESSAGE }
  | { type: typeof LEARNING_CREATE_OR_MERGE_MESSAGE; payload: CreateOrMergeLearningItemInput }
  | { type: typeof LEARNING_DELETE_MESSAGE; payload: { id: string } }
  | { type: typeof LEARNING_REMOVE_CONTEXT_MESSAGE; payload: { itemId: string; context: Pick<LearningContext, "text" | "addedAt" | "sourceLanguage"> } }
  | { type: typeof LEARNING_CLEAR_MESSAGE }
  | { type: typeof LEARNING_EXPORT_MESSAGE }
  | { type: typeof LEARNING_IMPORT_MESSAGE; payload: { document: string } }
  | { type: typeof LEARNING_RECORD_ENCOUNTER_MESSAGE; payload: { id: string; context: string; sourceLanguage?: "en" | "nl" | "te" } }
  | { type: typeof LEARNING_RECORD_MISSION_RESULT_MESSAGE; payload: { itemId: string; dimension: DailyFiveDimension; result: DailyFiveResult; expectedAttemptCount: number } }
  | { type: typeof LEARNING_DAILY_FIVE_MESSAGE; payload?: { continueAfterCompletion?: boolean } }
  | { type: typeof LEARNING_DAILY_FIVE_RESULT_MESSAGE; payload: { itemId: string; dimension: DailyFiveDimension; result: DailyFiveResult } }
  | { type: typeof LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE; payload: { lessonId: string; candidateIds: string[]; evidence: Array<{ candidateId: string; dimension: DailyFiveDimension; result: DailyFiveResult }> } }
  | { type: typeof LEARNING_LESSON_PROGRESS_MESSAGE; payload: { lessonId: string } }
  | { type: typeof LEARNING_SAVE_LESSON_PROGRESS_MESSAGE; payload: { lessonId: string; stage: LessonProgressStage } }
  | { type: typeof LEARNING_GRAMMAR_MESSAGE; payload?: { patternId?: GrammarPatternId } }
  | { type: typeof LEARNING_GRAMMAR_INTRODUCE_MESSAGE; payload?: { patternId?: GrammarPatternId } }
  | { type: typeof LEARNING_GRAMMAR_RESULT_MESSAGE; payload: { patternId: GrammarPatternId; contentVersion: 1; exerciseId: string; answer?: string; expectedEvidenceRevision: number; dailyFive?: boolean; outcome?: "reveal" | "skip" } }
  | { type: typeof LEARNING_CONTRAST_MESSAGE; payload?: { packId?: ContrastPackId } }
  | { type: typeof LEARNING_CONTRAST_INTRODUCE_MESSAGE; payload?: { packId?: ContrastPackId } }
  | { type: typeof LEARNING_CONTRAST_RESULT_MESSAGE; payload: { packId: ContrastPackId; contentVersion: 1; exerciseId: string; answer?: string; expectedEvidenceRevision: number; dailyFive?: boolean; outcome?: "reveal" | "skip"; misconceptionCode?: ContrastMisconceptionCode } }
  | { type: typeof LEARNING_VERB_JOURNEY_MESSAGE }
  | { type: typeof LEARNING_VERB_JOURNEY_RESULT_MESSAGE; payload: { verbId: string; formOrSkillId: string; exerciseFamily: string; exerciseId: string; contentVersion: VerbJourneyContentVersion; result: "correct" | "incorrect"; delayedOrRecombined?: boolean; expectedEvidenceRevision: number } }
  | { type: typeof LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE; payload: { journeyId: string } }
  | { type: typeof LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE; payload: { task: VerbJourneyDailyFiveTask; result: "correct" | "incorrect"; expectedEvidenceRevision: number } };

export type TranslateMessageResponse = { ok: true; result: TranslationResult } | { ok: false; error: string };
export type SettingsMessageResponse = { ok: true; result: { settings: ExtensionSettings } } | { ok: false; error: string };
export type LearningMessageResponse = { ok: true; result: { items: LearningItem[] } | { total: number; due: number; new: number; recent: LearningItem[] } | { rhythm: LearningRhythm } | { grammar: GrammarRecord | null } | { grammar: GrammarRecord; snapshot: DailyFiveSnapshot } | { contrast: ContrastRecord | null } | { contrast: ContrastRecord; repairOffer: ImmediateContrastRepairOffer | null } | { contrast: ContrastRecord; snapshot: DailyFiveSnapshot } | { verbJourneys: VerbJourneyRecord } | { verbJourneys: VerbJourneyRecord; snapshot: DailyFiveSnapshot } | { item: LearningItem } | { deleted: true } | { cleared: true } | { backup: LearningBackup } | { importedCount: number; totalCount: number; items: LearningItem[] } | { recorded: true } | { snapshot: DailyFiveSnapshot } | { item: LearningItem; snapshot: DailyFiveSnapshot } | { progress: LessonProgress | null } } | { ok: false; error: string };
export type BackgroundMessageResponse = TranslateMessageResponse | SettingsMessageResponse | LearningMessageResponse;

export function isTranslateMessage(message: unknown): message is TranslateMessage {
  return typeof message === "object" && message !== null && "type" in message && message.type === TRANSLATE_MESSAGE && "payload" in message && typeof message.payload === "object" && message.payload !== null;
}

export function isLearningMessage(message: unknown): message is LearningMessage {
  if (typeof message !== "object" || message === null || !("type" in message)) return false;
  if (message.type === LEARNING_LIST_MESSAGE || message.type === LEARNING_SUMMARY_MESSAGE || message.type === LEARNING_RHYTHM_MESSAGE || message.type === LEARNING_CLEAR_MESSAGE || message.type === LEARNING_EXPORT_MESSAGE) return true;
  if (message.type === LEARNING_GRAMMAR_MESSAGE || message.type === LEARNING_GRAMMAR_INTRODUCE_MESSAGE) { const payload = "payload" in message ? message.payload : undefined; return payload === undefined || (typeof payload === "object" && payload !== null && (!((payload as Record<string, unknown>).patternId) || (payload as Record<string, unknown>).patternId === "a0-zijn-present" || (payload as Record<string, unknown>).patternId === "a0-hebben-present" || (payload as Record<string, unknown>).patternId === "a0-regular-present" || (payload as Record<string, unknown>).patternId === "a0-yes-no-inversion")); }
  if (message.type === LEARNING_CONTRAST_MESSAGE || message.type === LEARNING_CONTRAST_INTRODUCE_MESSAGE) { const payload = "payload" in message ? message.payload : undefined; return payload === undefined || (typeof payload === "object" && payload !== null && ((payload as Record<string, unknown>).packId === undefined || (payload as Record<string, unknown>).packId === "contrast.main_clause_inversion")); }
  if (message.type === LEARNING_VERB_JOURNEY_MESSAGE) return true;
  if (message.type === LEARNING_DAILY_FIVE_MESSAGE) { const payload = "payload" in message ? message.payload : undefined; return payload === undefined || (typeof payload === "object" && payload !== null && (!("continueAfterCompletion" in payload) || typeof payload.continueAfterCompletion === "boolean")); }
  if (!("payload" in message) || typeof message.payload !== "object" || message.payload === null) return false;
  const payload = message.payload as Record<string, unknown>;
  if (message.type === LEARNING_DELETE_MESSAGE) return typeof payload.id === "string";
  if (message.type === LEARNING_REMOVE_CONTEXT_MESSAGE) {
    return typeof payload.itemId === "string" && typeof payload.context === "object" && payload.context !== null && typeof (payload.context as Record<string, unknown>).text === "string" && Number.isFinite((payload.context as Record<string, unknown>).addedAt) && ((payload.context as Record<string, unknown>).sourceLanguage === undefined || (payload.context as Record<string, unknown>).sourceLanguage === "en" || (payload.context as Record<string, unknown>).sourceLanguage === "nl" || (payload.context as Record<string, unknown>).sourceLanguage === "te");
  }
  if (message.type === LEARNING_LESSON_PROGRESS_MESSAGE) return typeof payload.lessonId === "string";
  if (message.type === LEARNING_SAVE_LESSON_PROGRESS_MESSAGE) return typeof payload.lessonId === "string" && (payload.stage === "read" || payload.stage === "notice" || payload.stage === "practise" || payload.stage === "replay" || payload.stage === "keep");
  if (message.type === LEARNING_RECORD_ENCOUNTER_MESSAGE) return typeof payload.id === "string" && typeof payload.context === "string" && (payload.sourceLanguage === undefined || payload.sourceLanguage === "en" || payload.sourceLanguage === "nl" || payload.sourceLanguage === "te");
  if (message.type === LEARNING_RECORD_MISSION_RESULT_MESSAGE) return typeof payload.itemId === "string" && (payload.dimension === "recognition" || payload.dimension === "recall") && (payload.result === "again" || payload.result === "got-it") && typeof payload.expectedAttemptCount === "number" && Number.isInteger(payload.expectedAttemptCount) && payload.expectedAttemptCount >= 0;
  if (message.type === LEARNING_DAILY_FIVE_RESULT_MESSAGE) return typeof payload.itemId === "string" && (payload.dimension === "recognition" || payload.dimension === "recall") && (payload.result === "again" || payload.result === "got-it");
  if (message.type === LEARNING_GRAMMAR_RESULT_MESSAGE) return (payload.patternId === "a0-zijn-present" || payload.patternId === "a0-hebben-present" || payload.patternId === "a0-regular-present" || payload.patternId === "a0-yes-no-inversion") && payload.contentVersion === 1 && typeof payload.exerciseId === "string" && typeof payload.expectedEvidenceRevision === "number" && Number.isInteger(payload.expectedEvidenceRevision) && payload.expectedEvidenceRevision >= 0 && (payload.dailyFive === undefined || typeof payload.dailyFive === "boolean") && (payload.outcome === undefined || payload.outcome === "reveal" || payload.outcome === "skip") && (payload.outcome !== undefined ? payload.dailyFive === true : typeof payload.answer === "string");
  if (message.type === LEARNING_CONTRAST_RESULT_MESSAGE) return payload.packId === "contrast.main_clause_inversion" && payload.contentVersion === 1 && typeof payload.exerciseId === "string" && contrastPack.exercises.some((exercise) => exercise.id === payload.exerciseId) && typeof payload.expectedEvidenceRevision === "number" && Number.isInteger(payload.expectedEvidenceRevision) && payload.expectedEvidenceRevision >= 0 && (payload.dailyFive === undefined || typeof payload.dailyFive === "boolean") && (payload.outcome === undefined || payload.outcome === "reveal" || payload.outcome === "skip") && (payload.misconceptionCode === undefined || payload.misconceptionCode === "MAIN_CLAUSE_NO_INVERSION") && (payload.outcome !== undefined ? payload.answer === undefined && payload.dailyFive === true : typeof payload.answer === "string");
  if (message.type === LEARNING_VERB_JOURNEY_RESULT_MESSAGE) return typeof payload.verbId === "string" && isVerbJourneyContentAvailable(payload.verbId) && payload.contentVersion === getVerbJourneyContentVersion(payload.verbId) && typeof payload.formOrSkillId === "string" && typeof payload.exerciseFamily === "string" && typeof payload.exerciseId === "string" && (payload.result === "correct" || payload.result === "incorrect") && (payload.delayedOrRecombined === undefined || typeof payload.delayedOrRecombined === "boolean") && typeof payload.expectedEvidenceRevision === "number" && Number.isInteger(payload.expectedEvidenceRevision) && payload.expectedEvidenceRevision >= 0;
  if (message.type === LEARNING_VERB_JOURNEY_COMPLETION_MESSAGE) return typeof payload.journeyId === "string";
  if (message.type === LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE) return isVerbJourneyDailyFiveResult(payload);
  if (message.type === LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE) return typeof payload.lessonId === "string" && Array.isArray(payload.candidateIds) && payload.candidateIds.every((id) => typeof id === "string") && Array.isArray(payload.evidence) && payload.evidence.every((entry) => typeof entry === "object" && entry !== null && "candidateId" in entry && typeof entry.candidateId === "string" && "dimension" in entry && (entry.dimension === "recognition" || entry.dimension === "recall") && "result" in entry && (entry.result === "again" || entry.result === "got-it"));
  if (message.type === LEARNING_IMPORT_MESSAGE) return typeof payload.document === "string";
  return message.type === LEARNING_CREATE_OR_MERGE_MESSAGE && typeof payload.dutch === "string" && (payload.kind === undefined || payload.kind === "word" || payload.kind === "chunk") && (payload.english === undefined || payload.english === null || typeof payload.english === "string") && (payload.telugu === undefined || payload.telugu === null || typeof payload.telugu === "string") && (payload.context === undefined || payload.context === null || typeof payload.context === "string") && (payload.contextSourceLanguage === undefined || payload.contextSourceLanguage === "en" || payload.contextSourceLanguage === "nl" || payload.contextSourceLanguage === "te") && (payload.contextSourceText === undefined || payload.contextSourceText === null || typeof payload.contextSourceText === "string") && (payload.contextTranslations === undefined || payload.contextTranslations === null || isContextTranslations(payload.contextTranslations)) && (payload.source === undefined || payload.source === "webpage" || payload.source === "lesson");
}

function isContextTranslations(value: unknown): value is { english?: string | null; telugu?: string | null } { if (typeof value !== "object" || value === null) return false; const translations = value as Record<string, unknown>; return Object.keys(translations).every((key) => key === "english" || key === "telugu") && (translations.english === undefined || translations.english === null || typeof translations.english === "string") && (translations.telugu === undefined || translations.telugu === null || typeof translations.telugu === "string"); }

function isVerbJourneyDailyFiveResult(value: Record<string, unknown>): value is { task: VerbJourneyDailyFiveTask; result: "correct" | "incorrect"; expectedEvidenceRevision: number } {
  if (!value.task || typeof value.task !== "object" || value.task === null) return false;
  const task = value.task as Record<string, unknown>;
  return task.kind === "verb" && typeof task.verbId === "string" && isVerbJourneyContentAvailable(task.verbId) && task.contentVersion === getVerbJourneyContentVersion(task.verbId) && typeof task.formOrSkillId === "string" && typeof task.exerciseFamily === "string" && typeof task.exerciseId === "string" && (value.result === "correct" || value.result === "incorrect") && typeof value.expectedEvidenceRevision === "number" && Number.isInteger(value.expectedEvidenceRevision) && value.expectedEvidenceRevision >= 0;
}

export function isSettingsMessage(message: unknown): message is SettingsMessage {
  if (typeof message !== "object" || message === null || !("type" in message)) return false;
  if (message.type === REVIEW_SETTINGS_MESSAGE) return true;
  if (message.type !== REVIEW_SETTINGS_UPDATE_MESSAGE || !("payload" in message) || typeof message.payload !== "object" || message.payload === null) return false;
  const payload = message.payload as Record<string, unknown>; const keys = Object.keys(payload);
  return keys.length > 0 && keys.every((key) => key === "autoSaveSelectedWords" || key === "showExampleSentence" || key === "dailyReviewBadge") && (payload.autoSaveSelectedWords === undefined || typeof payload.autoSaveSelectedWords === "boolean") && (payload.showExampleSentence === undefined || typeof payload.showExampleSentence === "boolean") && (payload.dailyReviewBadge === undefined || typeof payload.dailyReviewBadge === "boolean");
}
