import { describe, expect, it, vi } from "vitest";

vi.mock("webextension-polyfill", () => ({
  default: {
    storage: {
      sync: {
        get: vi.fn(),
      },
    },
  },
}));
import {
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  LEARNING_CREATE_OR_MERGE_MESSAGE,
  LEARNING_EXPORT_MESSAGE,
  LEARNING_IMPORT_MESSAGE,
  LEARNING_RECORD_ENCOUNTER_MESSAGE,
  LEARNING_REMOVE_CONTEXT_MESSAGE,
  LEARNING_DAILY_FIVE_MESSAGE,
  LEARNING_DAILY_FIVE_RESULT_MESSAGE,
  LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE,
  LEARNING_LESSON_PROGRESS_MESSAGE,
  LEARNING_GRAMMAR_INTRODUCE_MESSAGE,
  LEARNING_GRAMMAR_MESSAGE,
  LEARNING_GRAMMAR_RESULT_MESSAGE,
  LEARNING_CONTRAST_INTRODUCE_MESSAGE,
  LEARNING_CONTRAST_MESSAGE,
  LEARNING_CONTRAST_RESULT_MESSAGE,
  LEARNING_VERB_JOURNEY_MESSAGE,
  LEARNING_VERB_JOURNEY_RESULT_MESSAGE,
  LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE,
  type BackgroundMessageResponse,
} from "./messages";
import { createBackgroundMessageHandler } from "./message-handler";
import { ReviewCardStore } from "../vocabulary/review-cards";
import { SavedVocabularyStore, type SavedVocabularyStorage } from "../vocabulary/saved-vocabulary";
import { defaultSettings } from "../shared/settings";
import { createVocabularyBackup } from "../vocabulary/vocabulary-backup";
import { LearningRecordStore } from "../vocabulary/learning-record";
import { getLocalDayStart } from "../vocabulary/daily-five";
import { lessonCatalog } from "../lessons/catalog";

describe("createBackgroundMessageHandler", () => {
  it("handles learning records through the typed background contract with an injected clock", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({
      savedVocabulary, reviewCards, learningRecords: new LearningRecordStore(storage, () => 1_000), refreshBadge: async () => undefined,
    });
    await expect(send(handleMessage, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload: { dutch: "goedemorgen", english: "good morning", source: "webpage" } })).resolves.toMatchObject({ ok: true, result: { item: { id: "nl\u001fgoedemorgen", createdAt: 1_000 } } });
    const exported = await send(handleMessage, { type: LEARNING_EXPORT_MESSAGE });
    expect(exported).toMatchObject({ ok: true, result: { backup: { version: 3, learningItems: [expect.objectContaining({ english: "good morning" })], grammar: {} } } });
    const versionOne = createVocabularyBackup([{ id: "nl\u001fboom", dutch: "boom", english: "tree", telugu: null, pageContext: null, createdAt: 1, updatedAt: 1, dueAt: null, lastReviewedAt: null, lastRating: null, reviewCount: 0 }], 1_000);
    await expect(send(handleMessage, { type: LEARNING_IMPORT_MESSAGE, payload: { document: JSON.stringify(versionOne) } })).resolves.toMatchObject({ ok: true, result: { importedCount: 1, totalCount: 2 } });
  });

  it("persists a confirmed chunk atomically through the typed learning contract", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload: { dutch: "goede morgen", kind: "chunk", english: "good morning", source: "webpage", context: "Goede morgen, buur.", contextTranslations: { english: "Good morning, neighbour.", telugu: "శుభోదయం, పొరుగువారూ." } } })).resolves.toMatchObject({ ok: true, result: { item: { id: "nl\u001fgoede morgen", kind: "chunk", contexts: [{ text: "Goede morgen, buur.", english: "Good morning, neighbour.", telugu: "శుభోదయం, పొరుగువారూ." }] } } });
    await expect(records.list()).resolves.toHaveLength(1);
  });

  it("accepts source-aware contexts with partial helpers through the learning contract", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload: { dutch: "huis", source: "webpage", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "house", contextTranslations: { telugu: "ఇక్కడ ఒక ఇల్లు ఉంది." } } })).resolves.toMatchObject({ ok: true, result: { item: { contexts: [{ text: "An English house stands here.", sourceLanguage: "en", telugu: "ఇక్కడ ఒక ఇల్లు ఉంది." }] } } });
  });

  it("removes one context through the learning contract without deleting the item", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", context: "Huis staat hier.", contextSourceLanguage: "nl", contextSourceText: "huis" });
    const handleMessage = createBackgroundMessageHandler({ learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_REMOVE_CONTEXT_MESSAGE, payload: { itemId: item.id, context: { text: "Huis staat hier.", addedAt: 1_000, sourceLanguage: "nl" } } })).resolves.toMatchObject({ ok: true, result: { item: { id: item.id, contexts: [] } } });
    await expect(records.list()).resolves.toEqual([expect.objectContaining({ id: item.id, contexts: [] })]);
  });

  it("leaves existing learning data intact when chunk persistence fails", async () => {
    const storage = new FailingLearningStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "huis", english: "house" });
    storage.failLearningWrites = true;
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload: { dutch: "goede morgen", kind: "chunk" } })).resolves.toEqual({ ok: false, error: "Learning records are unavailable." });
    storage.failLearningWrites = false;
    await expect(records.list()).resolves.toEqual([expect.objectContaining({ dutch: "huis" })]);
  });

  it("records an encounter without changing mastery through the learning contract", async () => {
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => 1_000 });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => 1_000);
    const records = new LearningRecordStore(storage, () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_RECORD_ENCOUNTER_MESSAGE, payload: { id: item.id, context: "Een huis staat daar." } })).resolves.toEqual({ ok: true, result: { recorded: true } });
    await expect(records.list()).resolves.toEqual([expect.objectContaining({ contexts: [{ text: "Een huis staat daar.", addedAt: 1_000 }], recognition: item.recognition, recall: item.recall })]);
  });

  it("persists a Daily Five snapshot and applies only its requested binary result", async () => {
    let now = 1_000;
    const storage = new MemoryStorage();
    const savedVocabulary = new SavedVocabularyStore(storage, { now: () => now });
    const reviewCards = new ReviewCardStore(savedVocabulary, storage, () => now);
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    const refreshBadge = vi.fn(async () => undefined);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary, reviewCards, learningRecords: records, refreshBadge });

    const first = await send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE });
    const second = await send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE });
    expect(first).toEqual(second);
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_RESULT_MESSAGE, payload: { itemId: item.id, dimension: "recognition", result: "got-it" } })).resolves.toMatchObject({ ok: true, result: { item: { recognition: { state: "learning", dueAt: 1_000 + 86_400_000 }, recall: { state: "new" } }, snapshot: { completedTaskIds: [`${item.id}\u001frecognition`], goalCompleted: true } } });
    now += 1;
    await send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE, payload: { continueAfterCompletion: true } });
    await expect(records.exportBackup()).resolves.toMatchObject({ rhythm: { dailyFiveCompletions: { [getLocalDayStart(1_000)]: { snapshotCreatedAt: 1_000, completedAt: 1_000 } } } });
    now += 2 * 86_400_000;
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE })).resolves.toMatchObject({ ok: true, result: { snapshot: { createdAt: now } } });
    expect(refreshBadge).toHaveBeenCalledTimes(1);
  });

  it("routes typed hebben introduction and Daily Five evidence through the background boundary", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => now);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_INTRODUCE_MESSAGE, payload: { patternId: "a0-hebben-present" } })).resolves.toMatchObject({ ok: true, result: { grammar: { patternId: "a0-hebben-present" } } });
    now = new Date(2026, 0, 2, 9).getTime();
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE })).resolves.toMatchObject({ ok: true, result: { snapshot: { tasks: [{ patternId: "a0-hebben-present", exerciseId: "hebben-choose-ik" }] } } });
    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_RESULT_MESSAGE, payload: { patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik", answer: "heb", expectedEvidenceRevision: 0, dailyFive: true } })).resolves.toMatchObject({ ok: true, result: { grammar: { successfulEvidenceCount: 1 }, snapshot: { completedTaskIds: ["a0-hebben-present\u001fhebben-choose-ik"] } } });
    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_RESULT_MESSAGE, payload: { patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik", answer: "heb", expectedEvidenceRevision: 0, dailyFive: true } })).resolves.toMatchObject({ ok: true, result: { grammar: { evidenceRevision: 1, successfulEvidenceCount: 1 }, snapshot: { completedTaskIds: ["a0-hebben-present\u001fhebben-choose-ik"] } } });
    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_MESSAGE, payload: { patternId: "a0-hebben-present" } })).resolves.toMatchObject({ ok: true, result: { grammar: { patternId: "a0-hebben-present", successfulEvidenceCount: 1 } } });
  });

  it("routes typed regular-present introduction and evidence through the background boundary", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => now);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_INTRODUCE_MESSAGE, payload: { patternId: "a0-regular-present" } })).resolves.toMatchObject({ ok: true, result: { grammar: { patternId: "a0-regular-present" } } });
    now = new Date(2026, 0, 2, 9).getTime();
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE })).resolves.toMatchObject({ ok: true, result: { snapshot: { tasks: [{ patternId: "a0-regular-present", exerciseId: "regular-choose-ik" }] } } });
    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_RESULT_MESSAGE, payload: { patternId: "a0-regular-present", contentVersion: 1, exerciseId: "regular-choose-ik", answer: "woon", expectedEvidenceRevision: 0, dailyFive: true } })).resolves.toMatchObject({ ok: true, result: { grammar: { successfulEvidenceCount: 1 } } });
  });

  it("routes typed inversion introduction and token-order evidence through the background boundary", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => now);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_INTRODUCE_MESSAGE, payload: { patternId: "a0-yes-no-inversion" } })).resolves.toMatchObject({ ok: true, result: { grammar: { patternId: "a0-yes-no-inversion" } } });
    now = new Date(2026, 0, 2, 9).getTime();
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE })).resolves.toMatchObject({ ok: true, result: { snapshot: { tasks: [{ patternId: "a0-yes-no-inversion", exerciseId: "inversion-order-je" }] } } });
    await expect(send(handleMessage, { type: LEARNING_GRAMMAR_RESULT_MESSAGE, payload: { patternId: "a0-yes-no-inversion", contentVersion: 1, exerciseId: "inversion-order-je", answer: "Woon je hier?", expectedEvidenceRevision: 0, dailyFive: true } })).resolves.toMatchObject({ ok: true, result: { grammar: { successfulEvidenceCount: 1 } } });
  });

  it("routes the reviewed contrast pilot through one canonical first-check boundary", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_CONTRAST_MESSAGE, payload: { packId: "contrast.main_clause_inversion" } })).resolves.toMatchObject({ ok: true, result: { contrast: null } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_INTRODUCE_MESSAGE, payload: { packId: "contrast.main_clause_inversion" } })).resolves.toMatchObject({ ok: true, result: { contrast: { packId: "contrast.main_clause_inversion", evidenceRevision: 0 } } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "werk", expectedEvidenceRevision: 0 } })).resolves.toMatchObject({ ok: true, result: { contrast: { successfulExerciseIds: ["contrast-choose-time-first"], evidenceRevision: 1 } } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "werk", expectedEvidenceRevision: 0 } })).resolves.toEqual({ ok: false, error: "This contrast result was already recorded." });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_MESSAGE, payload: { packId: "contrast.main_clause_inversion" } })).resolves.toMatchObject({ ok: true, result: { contrast: { evidenceRevision: 1 } } });
  });

  it("routes verb journey evidence through the revision-checked learning boundary", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ learningRecords: records, refreshBadge: async () => undefined });
    await expect(send(handleMessage, { type: LEARNING_VERB_JOURNEY_MESSAGE })).resolves.toMatchObject({ ok: true, result: { verbJourneys: { evidenceRevision: 0 } } });
    const payload = { verbId: "verb.werken" as const, formOrSkillId: "skill.werken.vtt-completed", exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning", contentVersion: "015-1" as const, result: "correct" as const, expectedEvidenceRevision: 0 };
    await expect(send(handleMessage, { type: LEARNING_VERB_JOURNEY_RESULT_MESSAGE, payload })).resolves.toMatchObject({ ok: true, result: { verbJourneys: { evidenceRevision: 1 } } });
    await expect(send(handleMessage, { type: LEARNING_VERB_JOURNEY_RESULT_MESSAGE, payload })).resolves.toEqual({ ok: false, error: "This verb journey result was already recorded." });
  });

  it("routes a Verb Journey Daily Five result through the shared snapshot boundary", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ learningRecords: records, refreshBadge: async () => undefined });
    await send(handleMessage, { type: LEARNING_VERB_JOURNEY_RESULT_MESSAGE, payload: { verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", contentVersion: "015-1", exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning", result: "incorrect", expectedEvidenceRevision: 0 } });
    const snapshot = await records.getDailyFive();
    const task = snapshot.tasks.find((candidate) => "kind" in candidate && candidate.kind === "verb");
    await expect(send(handleMessage, { type: LEARNING_VERB_JOURNEY_DAILY_FIVE_RESULT_MESSAGE, payload: { task: task!, result: "correct", expectedEvidenceRevision: 1 } })).resolves.toMatchObject({ ok: true, result: { snapshot: { goalCompleted: true }, verbJourneys: { evidenceRevision: 2 } } });
  });

  it("returns an immediate repair offer only for the allowlisted controlled misconception", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await send(handleMessage, { type: LEARNING_CONTRAST_INTRODUCE_MESSAGE, payload: { packId: "contrast.main_clause_inversion" } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "ik werk", expectedEvidenceRevision: 0, misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" } })).resolves.toMatchObject({ ok: true, result: { repairOffer: { code: "MAIN_CLAUSE_NO_INVERSION", label: "Practise this contrast (1 min)" }, contrast: { misconceptionCounts: { MAIN_CLAUSE_NO_INVERSION: 1 } } } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "ik werk", expectedEvidenceRevision: 1, misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" } })).resolves.toMatchObject({ ok: true, result: { repairOffer: null, contrast: { misconceptionCounts: { MAIN_CLAUSE_NO_INVERSION: 2 } } } });
  });

  it("routes a scheduled contrast repair through the mixed Daily Five boundary", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => now);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });
    await send(handleMessage, { type: LEARNING_CONTRAST_INTRODUCE_MESSAGE, payload: { packId: "contrast.main_clause_inversion" } });
    await send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-choose-time-first", answer: "ik werk", expectedEvidenceRevision: 0, misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" } });
    await send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-repair-time-first", answer: "Morgen ik werk thuis.", expectedEvidenceRevision: 1, misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" } });
    now = new Date(2026, 0, 2, 9).getTime();
    await expect(send(handleMessage, { type: LEARNING_DAILY_FIVE_MESSAGE })).resolves.toMatchObject({ ok: true, result: { snapshot: { tasks: [{ kind: "contrast", exerciseId: "contrast-rebuild-appointment" }] } } });
    await expect(send(handleMessage, { type: LEARNING_CONTRAST_RESULT_MESSAGE, payload: { packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", answer: "Morgen maak ik een afspraak.", expectedEvidenceRevision: 2, dailyFive: true } })).resolves.toMatchObject({ ok: true, result: { contrast: { repair: { pending: false } }, snapshot: { goalCompleted: true } } });
  });

  it("keeps selected lesson candidates atomically with lesson provenance", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE, payload: { lessonId: "a1-een-afspraak-maken", candidateIds: ["afspraak-maken", "als-het-kan"], evidence: [{ candidateId: "afspraak-maken", dimension: "recognition", result: "got-it" }] } })).resolves.toMatchObject({ ok: true, result: { items: [expect.objectContaining({ dutch: "een afspraak maken", recognition: expect.objectContaining({ state: "learning" }), sources: expect.arrayContaining([expect.objectContaining({ type: "lesson", lessonId: "a1-een-afspraak-maken" })]) }), expect.objectContaining({ dutch: "als het kan" })] } });
    await expect(send(handleMessage, { type: LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE, payload: { lessonId: "a1-een-afspraak-maken", candidateIds: ["afspraak-maken"], evidence: [] } })).resolves.toMatchObject({ ok: true });
    await expect(records.list()).resolves.toHaveLength(2);
  });

  it("does not change storage when keeping lesson candidates fails", async () => {
    const storage = new FailingLearningStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "huis", english: "house" });
    storage.failLearningWrites = true;
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: records, refreshBadge: async () => undefined });

    await expect(send(handleMessage, { type: LEARNING_KEEP_LESSON_CANDIDATES_MESSAGE, payload: { lessonId: "a1-een-afspraak-maken", candidateIds: ["afspraak-maken"], evidence: [] } })).resolves.toEqual({ ok: false, error: "Learning records are unavailable." });
    storage.failLearningWrites = false;
    await expect(records.list()).resolves.toEqual([expect.objectContaining({ dutch: "huis" })]);
  });

  it("rejects invalid bundled lessons before reading progress", async () => {
    const storage = new MemoryStorage();
    const handleMessage = createBackgroundMessageHandler({ savedVocabulary: new SavedVocabularyStore(storage), reviewCards: new ReviewCardStore(new SavedVocabularyStore(storage), storage), learningRecords: new LearningRecordStore(storage), refreshBadge: async () => undefined });
    const lesson = lessonCatalog.lessons[0];
    const version = lesson.contentVersion;
    lesson.contentVersion = 0;
    try {
      await expect(send(handleMessage, { type: LEARNING_LESSON_PROGRESS_MESSAGE, payload: { lessonId: lesson.id } })).resolves.toEqual({ ok: false, error: "Lessons are unavailable until bundled content is fixed." });
    } finally {
      lesson.contentVersion = version;
    }
  });
});

async function send(
  handleMessage: ReturnType<typeof createBackgroundMessageHandler>,
  message: Parameters<typeof handleMessage>[0],
): Promise<BackgroundMessageResponse> {
  return new Promise((resolve) => {
    expect(handleMessage(message, resolve)).toBe(true);
  });
}

class MemoryStorage implements SavedVocabularyStorage {
  readonly values = new Map<string, unknown>();

  async get(key: string): Promise<unknown> {
    return this.values.get(key);
  }

  async set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
  }
}

class FailingLearningStorage extends MemoryStorage {
  failLearningWrites = false;

  override async set(key: string, value: unknown): Promise<void> {
    if (this.failLearningWrites && key === "dutchmate.learningRecord.v2") throw new Error("Storage unavailable");
    await super.set(key, value);
  }
}
