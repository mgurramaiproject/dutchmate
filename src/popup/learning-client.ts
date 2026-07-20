import {
  LEARNING_DELETE_MESSAGE,
  LEARNING_CLEAR_MESSAGE,
  LEARNING_EXPORT_MESSAGE,
  LEARNING_IMPORT_MESSAGE,
  LEARNING_LIST_MESSAGE,
  LEARNING_RHYTHM_MESSAGE,
  LEARNING_DAILY_FIVE_MESSAGE,
  LEARNING_DAILY_FIVE_RESULT_MESSAGE,
  LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE,
  LEARNING_LESSON_PROGRESS_MESSAGE,
  LEARNING_SAVE_LESSON_PROGRESS_MESSAGE,
  type LearningMessage,
  type LearningMessageResponse,
} from "../background/messages";
import type { LearningBackup, LearningItem, LessonProgress, LessonProgressStage } from "../vocabulary/learning-record";
import type { DailyFiveDimension, DailyFiveResult, DailyFiveSnapshot } from "../vocabulary/daily-five";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import type { LessonPracticeEvidence } from "./lesson-session";

export type LearningRuntimeApi = { runtime: { sendMessage(message: LearningMessage): Promise<LearningMessageResponse> } };
export type LearningClient = {
  list(): Promise<LearningItem[]>;
  getRhythm(): Promise<LearningRhythm>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
  exportBackup(): Promise<LearningBackup>;
  importBackup(document: string): Promise<{ importedCount: number; totalCount: number }>;
  getDailyFive(continueAfterCompletion?: boolean): Promise<DailyFiveSnapshot>;
  recordDailyFiveResult(itemId: string, dimension: DailyFiveDimension, result: DailyFiveResult): Promise<{ item: LearningItem; snapshot: DailyFiveSnapshot }>;
  keepLessonCandidates(lessonId: string, candidateIds: string[], evidence: LessonPracticeEvidence[]): Promise<LearningItem[]>;
  getLessonProgress(lessonId: string): Promise<LessonProgress | null>;
  saveLessonProgress(lessonId: string, stage: LessonProgressStage): Promise<LessonProgress>;
};

export function createLearningClient(extensionApi: LearningRuntimeApi): LearningClient {
  return {
    async list() {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_LIST_MESSAGE });
      if (response.ok && "items" in response.result) return response.result.items;
      throw new Error(response.ok ? "Learning items are unavailable." : response.error);
    },
    async getRhythm() {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_RHYTHM_MESSAGE });
      if (response.ok && "rhythm" in response.result) return response.result.rhythm;
      throw new Error(response.ok ? "Learning rhythm is unavailable." : response.error);
    },
    async delete(id) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DELETE_MESSAGE, payload: { id } });
      if (!response.ok || !("deleted" in response.result) || response.result.deleted !== true) throw new Error(response.ok ? "Learning item could not be deleted." : response.error);
    },
    async clear() { const response = await extensionApi.runtime.sendMessage({ type: LEARNING_CLEAR_MESSAGE }); if (!response.ok || !("cleared" in response.result)) throw new Error(response.ok ? "Learning data could not be cleared." : response.error); },
    async exportBackup() { const response = await extensionApi.runtime.sendMessage({ type: LEARNING_EXPORT_MESSAGE }); if (response.ok && "backup" in response.result) return response.result.backup; throw new Error(response.ok ? "Learning backup is unavailable." : response.error); },
    async importBackup(document) { const response = await extensionApi.runtime.sendMessage({ type: LEARNING_IMPORT_MESSAGE, payload: { document } }); if (response.ok && "importedCount" in response.result) return response.result; throw new Error(response.ok ? "Learning import is unavailable." : response.error); },
    async getDailyFive(continueAfterCompletion = false) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DAILY_FIVE_MESSAGE, payload: { continueAfterCompletion } });
      if (response.ok && "snapshot" in response.result) return response.result.snapshot;
      throw new Error(response.ok ? "Daily Five is unavailable." : response.error);
    },
    async recordDailyFiveResult(itemId, dimension, result) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DAILY_FIVE_RESULT_MESSAGE, payload: { itemId, dimension, result } });
      if (response.ok && "item" in response.result && "snapshot" in response.result) return response.result;
      throw new Error(response.ok ? "Your result could not be saved." : response.error);
    },
    async keepLessonCandidates(lessonId, candidateIds, evidence) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE, payload: { lessonId, candidateIds, evidence } });
      if (response.ok && "items" in response.result) return response.result.items;
      throw new Error(response.ok ? "Lesson candidates could not be kept." : response.error);
    },
    async getLessonProgress(lessonId) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_LESSON_PROGRESS_MESSAGE, payload: { lessonId } });
      if (response.ok && "progress" in response.result) return response.result.progress;
      throw new Error(response.ok ? "Lesson progress is unavailable." : response.error);
    },
    async saveLessonProgress(lessonId, stage) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_SAVE_LESSON_PROGRESS_MESSAGE, payload: { lessonId, stage } });
      if (response.ok && "progress" in response.result && response.result.progress) return response.result.progress;
      throw new Error(response.ok ? "Lesson progress could not be saved." : response.error);
    },
  };
}
