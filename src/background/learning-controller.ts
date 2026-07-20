import type { LearningRecordStore } from "../vocabulary/learning-record";
import { parseLearningImport } from "../vocabulary/learning-record";
import type { LearningMessage, LearningMessageResponse } from "./messages";
import {
  LEARNING_CLEAR_MESSAGE,
  LEARNING_CREATE_OR_MERGE_MESSAGE,
  LEARNING_DELETE_MESSAGE,
  LEARNING_EXPORT_MESSAGE,
  LEARNING_IMPORT_MESSAGE,
  LEARNING_LIST_MESSAGE,
  LEARNING_RECORD_ENCOUNTER_MESSAGE,
  LEARNING_RHYTHM_MESSAGE,
  LEARNING_SUMMARY_MESSAGE,
  LEARNING_DAILY_FIVE_MESSAGE,
  LEARNING_DAILY_FIVE_RESULT_MESSAGE,
  LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE,
  LEARNING_LESSON_PROGRESS_MESSAGE,
  LEARNING_SAVE_LESSON_PROGRESS_MESSAGE,
} from "./messages";
import { lessonCatalog, validateLessonCatalog } from "../lessons/catalog";

export async function handleLearningMessage(message: LearningMessage, store: LearningRecordStore): Promise<LearningMessageResponse> {
  try {
    const catalogErrors = validateLessonCatalog(lessonCatalog);
    if (catalogErrors.length > 0 && (message.type === LEARNING_LESSON_PROGRESS_MESSAGE || message.type === LEARNING_SAVE_LESSON_PROGRESS_MESSAGE || message.type === LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE)) return { ok: false, error: "Lessons are unavailable until bundled content is fixed." };
    if (message.type === LEARNING_LESSON_PROGRESS_MESSAGE) {
      const lesson = lessonCatalog.lessons.find((candidate) => candidate.id === message.payload.lessonId);
      return lesson ? { ok: true, result: { progress: await store.getLessonProgress(lesson.id, lesson.contentVersion) ?? null } } : { ok: false, error: "This lesson is unavailable." };
    }
    if (message.type === LEARNING_SAVE_LESSON_PROGRESS_MESSAGE) {
      const lesson = lessonCatalog.lessons.find((candidate) => candidate.id === message.payload.lessonId);
      return lesson ? { ok: true, result: { progress: await store.saveLessonProgress(lesson.id, lesson.contentVersion, message.payload.stage) } } : { ok: false, error: "This lesson is unavailable." };
    }
    if (message.type === LEARNING_LIST_MESSAGE) return { ok: true, result: { items: await store.list() } };
    if (message.type === LEARNING_SUMMARY_MESSAGE) return { ok: true, result: await store.summary() };
    if (message.type === LEARNING_RHYTHM_MESSAGE) return { ok: true, result: { rhythm: await store.getRhythm() } };
    if (message.type === LEARNING_CREATE_OR_MERGE_MESSAGE) return { ok: true, result: { item: await store.createOrMerge(message.payload) } };
    if (message.type === LEARNING_RECORD_ENCOUNTER_MESSAGE) {
      const item = await store.recordEncounter(message.payload.id, message.payload.context);
      return item ? { ok: true, result: { recorded: true } } : { ok: false, error: "Learning item was not found." };
    }
    if (message.type === LEARNING_DAILY_FIVE_MESSAGE) return { ok: true, result: { snapshot: await store.getDailyFive(message.payload?.continueAfterCompletion) } };
    if (message.type === LEARNING_DAILY_FIVE_RESULT_MESSAGE) return { ok: true, result: await store.recordDailyFiveResult(message.payload.itemId, message.payload.dimension, message.payload.result) };
    if (message.type === LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE) {
      const lesson = lessonCatalog.lessons.find((candidate) => candidate.id === message.payload.lessonId);
      if (!lesson) return { ok: false, error: "This lesson is unavailable." };
      if (new Set(message.payload.candidateIds).size !== message.payload.candidateIds.length || message.payload.evidence.some((entry) => !message.payload.candidateIds.includes(entry.candidateId))) return { ok: false, error: "Lesson candidates are unavailable." };
      const candidates = message.payload.candidateIds.map((id) => lesson.candidates.find((candidate) => candidate.id === id));
      if (candidates.some((candidate) => !candidate)) return { ok: false, error: "Lesson candidates are unavailable." };
      const selected = candidates.filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== undefined);
      const evidence = message.payload.evidence.map((entry) => ({ ...entry, dutch: selected.find((candidate) => candidate.id === entry.candidateId)!.dutch }));
      return { ok: true, result: { items: await store.keepLessonCandidates(lesson.id, lesson.contentVersion, selected, evidence) } };
    }
    if (message.type === LEARNING_DELETE_MESSAGE) { await store.delete(message.payload.id); return { ok: true, result: { deleted: true } }; }
    if (message.type === LEARNING_CLEAR_MESSAGE) { await store.clear(); return { ok: true, result: { cleared: true } }; }
    if (message.type === LEARNING_EXPORT_MESSAGE) return { ok: true, result: { backup: await store.exportBackup() } };
    if (message.type === LEARNING_IMPORT_MESSAGE) {
      const backup = parseLearningImport(message.payload.document);
      return { ok: true, result: "learningItems" in backup ? await store.importBackup(backup) : await store.importVersionOneBackup(backup) };
    }
    return { ok: false, error: "Unsupported learning message." };
  } catch (error) {
    return { ok: false, error: message.type === LEARNING_IMPORT_MESSAGE && error instanceof Error ? error.message : "Learning records are unavailable." };
  }
}
