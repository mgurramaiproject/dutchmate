import type { MvpLanguageCode } from "../shared/languages";
import type { SavedVocabularyEntry, SavedVocabularyStorage } from "./saved-vocabulary";
import type { ReviewCard, ReviewRating } from "./review-cards";
import { parseVocabularyBackup, type VocabularyBackup } from "./vocabulary-backup";
import { normalizeSavedVocabularyText } from "./saved-vocabulary";
import { applyDailyFiveResult, createDailyFiveSnapshot, getLocalDayStart, selectGrammarDailyFiveTasks, type DailyFiveDimension, type DailyFiveResult, type DailyFiveSnapshot, type DailyFiveTask } from "./daily-five";
import { getLearningRhythm, type LearningRhythm } from "./learning-rhythm";
import { lessonCatalog, type GrammarPatternId } from "../lessons/catalog";
import { applyGrammarCheck, applyGrammarOutcome, introduceGrammar, type GrammarOutcome, type GrammarRecord } from "../grammar/learning";
import { getGrammarPattern, grammarPatterns, isGrammarContentAvailable } from "../grammar/content";

export const LEARNING_RECORD_STORAGE_KEY = "dutchmate.learningRecord.v2";
export const LEARNING_BACKUP_FORMAT = "dutchmate-learning-backup";
export const LEARNING_BACKUP_VERSION = 3;
export const LEARNING_LANGUAGE = "nl" as const;

export type LearningItemKind = "word" | "chunk";
export type MasteryState = "new" | "learning" | "familiar" | "strong";
export type LearningMastery = {
  state: MasteryState;
  dueAt: number | null;
  intervalDays: number;
  attemptCount: number;
  successfulStreak: number;
  lastPractisedAt: number | null;
};
export type LearningItemSource = { type: "webpage" | "lesson"; addedAt: number; lessonId?: string; sourceLanguage?: MvpLanguageCode | "auto"; detectedSourceLanguage?: MvpLanguageCode; targetLanguage?: MvpLanguageCode; providerName?: string; originalLanguage?: MvpLanguageCode };
export type LearningContext = { text: string; addedAt: number; sourceLanguage?: MvpLanguageCode; english?: string | null; telugu?: string | null };
export type LearningEncounter = { count: number; lastEncounterAt: number | null };
export type LearningItem = {
  id: string;
  learningLanguage: typeof LEARNING_LANGUAGE;
  normalizedDutch: string;
  dutch: string;
  kind: LearningItemKind;
  english: string | null;
  telugu: string | null;
  sources: LearningItemSource[];
  contexts: LearningContext[];
  encounters: LearningEncounter;
  recognition: LearningMastery;
  recall: LearningMastery;
  createdAt: number;
  updatedAt: number;
};
export type LearningRecord = {
  version: 2;
  items: Record<string, LearningItem>;
  lessonProgress: Record<string, unknown>;
  rhythm: Record<string, unknown>;
  grammar: Record<string, GrammarRecord>;
};
export type LessonProgressStage = "read" | "notice" | "practise" | "replay" | "keep";
export type LessonProgress = { lessonId: string; contentVersion: number; stage: LessonProgressStage; completedAt: number | null; keptCandidateIds: string[]; updatedAt: number };
export type LearningBackup = {
  format: typeof LEARNING_BACKUP_FORMAT;
  version: 3;
  exportedAt: number;
  learningItems: LearningItem[];
  lessonProgress: Record<string, unknown>;
  rhythm: Record<string, unknown>;
  grammar: Record<string, GrammarRecord>;
};
export type LegacyLearningBackup = Omit<LearningBackup, "version" | "grammar"> & { version: 2; grammar?: Record<string, GrammarRecord> };
export type CreateOrMergeLearningItemInput = {
  dutch: string;
  kind?: LearningItemKind;
  english?: string | null;
  telugu?: string | null;
  source?: "webpage" | "lesson";
  sourceMetadata?: Omit<LearningItemSource, "type" | "addedAt">;
  context?: string | null;
  contextSourceLanguage?: MvpLanguageCode;
  contextSourceText?: string | null;
  contextTranslations?: { english?: string | null; telugu?: string | null } | null;
};

type LegacyReviewData = { cards: Record<string, ReviewCard> };
type LegacyData = { entries: Record<string, SavedVocabularyEntry> };

export class LearningRecordStore {
  constructor(private readonly storage: SavedVocabularyStorage, private readonly now: () => number = Date.now) {}

  async list(): Promise<LearningItem[]> {
    const record = await this.readMigrated();
    return Object.values(record.items).sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
  }

  async summary(): Promise<{ total: number; due: number; new: number; recent: LearningItem[] }> {
    const items = await this.list();
    const now = this.now();
    return {
      total: items.length,
      due: items.filter((item) => [item.recognition, item.recall].some((mastery) => mastery.attemptCount > 0 && mastery.dueAt !== null && mastery.dueAt <= now)).length,
      new: items.filter((item) => item.recognition.attemptCount === 0).length,
      recent: [...items].sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id)).slice(0, 3),
    };
  }

  async getRhythm(): Promise<LearningRhythm> {
    const record = await this.readMigrated();
    return getLearningRhythm(Object.values(record.items), record.lessonProgress, record.rhythm, this.now(), lessonCatalog.lessons);
  }

  async createOrMerge(input: CreateOrMergeLearningItemInput): Promise<LearningItem> {
    const record = await this.readMigrated();
    const existing = record.items[getLearningItemId(input.dutch)];
    const item = mergeLearningItem(existing, input, this.now());
    record.items[item.id] = item;
    if (!existing) record.rhythm = { ...record.rhythm, ...withActivity(record.rhythm, this.now(), { saved: 1 }) };
    await this.write(record);
    return item;
  }

  async getLessonProgress(lessonId: string, contentVersion: number): Promise<LessonProgress | undefined> {
    const progress = parseLessonProgress((await this.readMigrated()).lessonProgress[lessonProgressKey(lessonId, contentVersion)]);
    return progress?.contentVersion === contentVersion ? progress : undefined;
  }

  async getGrammar(patternId: GrammarPatternId = "a0-zijn-present"): Promise<GrammarRecord | null> { return (await this.readMigrated()).grammar[patternId] ?? null; }

  async introduceGrammar(patternId: GrammarPatternId = "a0-zijn-present"): Promise<GrammarRecord> {
    const record = await this.readMigrated();
    if (record.grammar[patternId]) return record.grammar[patternId];
    const grammar = introduceGrammar(patternId, 1, this.now());
    record.grammar[patternId] = grammar;
    await this.write(record);
    return grammar;
  }

  async recordGrammarCheck(patternId: GrammarPatternId, contentVersion: 1, exerciseId: string, answer: string | null, expectedRevision: number, outcome: GrammarOutcome = { type: "check", answer: answer! }): Promise<{ grammar: GrammarRecord; recorded: boolean }> {
    const record = await this.readMigrated();
    const grammar = record.grammar[patternId];
    const pattern = getGrammarPattern(patternId);
    const exercise = pattern?.exercises.find((candidate) => candidate.id === exerciseId);
    if (!isGrammarContentAvailable() || !grammar || !pattern || !exercise || contentVersion !== 1 || (outcome.type === "check" && (!answer || !exercise.choices.includes(answer) && !exercise.distractors.some((distractor) => distractor.value === answer)))) throw new Error("This grammar exercise is unavailable.");
    if (grammar.evidenceRevision !== expectedRevision) return { grammar, recorded: false };
    const updated = applyGrammarOutcome(grammar, exercise, outcome, this.now(), true);
    record.grammar[patternId] = updated;
    await this.write(record);
    return { grammar: updated, recorded: true };
  }

  async saveLessonProgress(lessonId: string, contentVersion: number, stage: LessonProgressStage): Promise<LessonProgress> {
    const record = await this.readMigrated();
    const timestamp = this.now();
    const existing = parseLessonProgress(record.lessonProgress[lessonProgressKey(lessonId, contentVersion)]);
    const progress: LessonProgress = existing && existing.completedAt !== null ? existing : { lessonId, contentVersion, stage, completedAt: null, keptCandidateIds: existing?.keptCandidateIds ?? [], updatedAt: timestamp };
    record.lessonProgress = { ...record.lessonProgress, [lessonProgressKey(lessonId, contentVersion)]: progress };
    await this.write(record);
    return progress;
  }

  async keepLessonCandidates(lessonId: string, contentVersion: number, candidates: Array<Pick<CreateOrMergeLearningItemInput, "dutch" | "kind" | "english" | "telugu"> & { id: string }>, evidence: Array<{ dutch: string; dimension: DailyFiveDimension; result: DailyFiveResult }>): Promise<LearningItem[]> {
    const record = await this.readMigrated();
    const timestamp = this.now();
    const key = lessonProgressKey(lessonId, contentVersion);
    const existingProgress = parseLessonProgress(record.lessonProgress[key]);
    if (existingProgress && existingProgress.completedAt !== null) {
      record.rhythm = { ...record.rhythm, ...withActiveDay(record.rhythm, timestamp, "lessonCompletions"), ...withActivity(record.rhythm, timestamp, { lessons: 1 }) };
      await this.write(record);
      return existingProgress.keptCandidateIds.map((id) => candidates.find((candidate) => candidate.id === id)).filter((candidate): candidate is typeof candidates[number] => candidate !== undefined).map((candidate) => record.items[getLearningItemId(candidate.dutch)]).filter((item): item is LearningItem => item !== undefined);
    }
    const next = { ...record, items: { ...record.items } };
    const items = candidates.map((candidate) => {
      const item = mergeLearningItem(next.items[getLearningItemId(candidate.dutch)], { ...candidate, source: "lesson", sourceMetadata: { lessonId } }, timestamp);
      const results = evidence.filter((entry) => normalizeSavedVocabularyText(entry.dutch) === item.normalizedDutch);
      const practised = results.reduce((current, entry) => applyDailyFiveResult(current, entry.dimension, entry.result, timestamp).item, item);
      next.items[practised.id] = practised;
      return practised;
    });
    next.lessonProgress = { ...next.lessonProgress, [key]: { lessonId, contentVersion, stage: "keep", completedAt: timestamp, keptCandidateIds: candidates.map((candidate) => candidate.id), updatedAt: timestamp } };
    const newlySaved = items.filter((item) => record.items[item.id] === undefined).length;
    next.rhythm = { ...next.rhythm, ...withActiveDay(next.rhythm, timestamp, "lessonCompletions"), ...withActivity(next.rhythm, timestamp, { lessons: 1, saved: newlySaved }) };
    await this.write(next);
    return items;
  }

  async recordEncounter(id: string, context: string | null | undefined, sourceLanguage?: MvpLanguageCode): Promise<LearningItem | null> {
    const record = await this.readMigrated();
    const existing = record.items[id];
    if (!existing) return null;
    const encounteredAt = this.now();
    const encounter = normalizeContext(context, existing.dutch, encounteredAt, sourceLanguage);
    if (!encounter) return existing;
    const item = { ...existing, contexts: mergeContexts(existing.contexts, encounter), encounters: { count: existing.encounters.count + 1, lastEncounterAt: encounteredAt }, updatedAt: Math.max(existing.updatedAt, encounteredAt) };
    record.items[id] = item;
    await this.write(record);
    return item;
  }

  async recordMissionResult(itemId: string, dimension: DailyFiveDimension, result: DailyFiveResult, expectedAttemptCount: number): Promise<{ item: LearningItem; recorded: boolean }> {
    const record = await this.readMigrated();
    const existing = record.items[itemId];
    if (!existing) throw new Error("This learning item is unavailable.");
    if (existing[dimension].attemptCount !== expectedAttemptCount) return { item: existing, recorded: false };
    const timestamp = this.now();
    const updated = applyDailyFiveResult(existing, dimension, result, timestamp).item;
    record.items[itemId] = updated;
    record.rhythm = { ...record.rhythm, ...withActivity(record.rhythm, timestamp, { reviews: 1 }) };
    await this.write(record);
    return { item: updated, recorded: true };
  }

  async getDailyFive(continueAfterCompletion = false): Promise<DailyFiveSnapshot> {
    const record = await this.readMigrated();
    const saved = sanitizeDailyFiveSnapshot(parseDailyFiveSnapshot(record.rhythm.dailyFive), record.items);
    if (saved && !continueAfterCompletion && saved.dayStartAt === getLocalDayStart(this.now()) && (saved.tasks.length > 0 || Object.keys(record.items).length === 0)) return saved;
    const lastDirection = record.rhythm.lastDailyFiveDirection === "recognition" || record.rhythm.lastDailyFiveDirection === "recall" ? record.rhythm.lastDailyFiveDirection : undefined;
    const now = this.now();
    const grammarTasks = isGrammarContentAvailable()
      ? selectGrammarDailyFiveTasks(grammarPatterns.flatMap((pattern, patternOrder) => {
        const grammar = record.grammar[pattern.id];
        if (!grammar || grammar.dueAt > now) return [];
        return [{ task: { kind: "grammar" as const, patternId: pattern.id, contentVersion: 1 as const, exerciseId: pattern.exercises.find((exercise) => !grammar.recentExerciseIds.includes(exercise.id))?.id ?? pattern.exercises[0].id }, dueAt: grammar.dueAt, patternOrder }];
      }), now, 2)
      : [];
    const snapshot = createDailyFiveSnapshot(Object.values(record.items), now, lastDirection, grammarTasks);
    record.rhythm = { ...record.rhythm, dailyFive: snapshot };
    await this.write(record);
    return snapshot;
  }

  async recordDailyFiveResult(itemId: string, dimension: DailyFiveDimension, result: DailyFiveResult): Promise<{ item: LearningItem; snapshot: DailyFiveSnapshot }> {
    const record = await this.readMigrated();
    const timestamp = this.now();
    const snapshot = parseDailyFiveSnapshot(record.rhythm.dailyFive);
    const task = snapshot?.tasks.find((candidate) => isVocabularyTask(candidate) && candidate.itemId === itemId && candidate.dimension === dimension);
    const existing = record.items[itemId];
    if (!snapshot || !task || !existing) throw new Error("This Daily Five task is unavailable.");
    if (snapshot.completedTaskIds.includes(taskId(task))) return { item: existing, snapshot };
    const updated = applyDailyFiveResult(existing, dimension, result, timestamp).item;
    const completedTaskIds = [...snapshot.completedTaskIds, taskId(task)];
    const nextSnapshot = { ...snapshot, completedTaskIds, goalCompleted: completedTaskIds.length === snapshot.tasks.length };
    record.items[itemId] = updated;
    record.rhythm = {
      ...record.rhythm,
      dailyFive: nextSnapshot,
      lastDailyFiveDirection: dimension,
      ...withActivity(record.rhythm, timestamp, { reviews: 1 }),
      ...(nextSnapshot.goalCompleted ? withActiveDay(record.rhythm, timestamp, "dailyFiveCompletions", { snapshotCreatedAt: snapshot.createdAt }) : {}),
    };
    await this.write(record);
    return { item: updated, snapshot: nextSnapshot };
  }

  async recordGrammarDailyFiveResult(input: { patternId: GrammarPatternId; contentVersion: 1; exerciseId: string; outcome: GrammarOutcome; expectedEvidenceRevision: number }): Promise<{ grammar: GrammarRecord; snapshot: DailyFiveSnapshot }> {
    const { patternId, contentVersion, exerciseId, outcome, expectedEvidenceRevision } = input;
    const record = await this.readMigrated();
    const snapshot = parseDailyFiveSnapshot(record.rhythm.dailyFive);
    const task = snapshot?.tasks.find((candidate) => "kind" in candidate && candidate.kind === "grammar" && candidate.patternId === patternId && candidate.exerciseId === exerciseId);
    const grammar = record.grammar[patternId];
    const pattern = getGrammarPattern(patternId);
    const exercise = pattern?.exercises.find((candidate) => candidate.id === exerciseId);
    if (!isGrammarContentAvailable() || !snapshot || !task || !grammar || !exercise || contentVersion !== 1 || (outcome.type === "check" && !exercise.choices.includes(outcome.answer) && !exercise.distractors.some((distractor) => distractor.value === outcome.answer))) throw new Error("This grammar task is unavailable.");
    if (snapshot.completedTaskIds.includes(taskId(task))) return { grammar, snapshot };
    if (grammar.evidenceRevision !== expectedEvidenceRevision) return { grammar, snapshot };
    const updated = applyGrammarOutcome(grammar, exercise, outcome, this.now(), true);
    const completedTaskIds = [...snapshot.completedTaskIds, taskId(task)];
    const nextSnapshot = { ...snapshot, completedTaskIds, goalCompleted: completedTaskIds.length === snapshot.tasks.length };
    record.grammar[patternId] = updated;
    record.rhythm = { ...record.rhythm, dailyFive: nextSnapshot, ...withActivity(record.rhythm, this.now(), { reviews: 1 }), ...(nextSnapshot.goalCompleted ? withActiveDay(record.rhythm, this.now(), "dailyFiveCompletions", { snapshotCreatedAt: snapshot.createdAt }) : {}) };
    await this.write(record);
    return { grammar: updated, snapshot: nextSnapshot };
  }

  async delete(id: string): Promise<void> {
    const record = await this.readMigrated();
    delete record.items[id];
    await this.write(record);
  }

  async clear(): Promise<void> {
    await this.write({ version: 2, items: {}, lessonProgress: {}, rhythm: {}, grammar: {} });
  }

  async exportBackup(): Promise<LearningBackup> {
    const record = await this.readMigrated();
    return { format: LEARNING_BACKUP_FORMAT, version: LEARNING_BACKUP_VERSION, exportedAt: this.now(), learningItems: Object.values(record.items), lessonProgress: record.lessonProgress, rhythm: record.rhythm, grammar: record.grammar };
  }

  async importBackup(backup: LearningBackup | LegacyLearningBackup): Promise<{ items: LearningItem[]; importedCount: number; totalCount: number }> {
    backup = parseLearningBackup(backup);
    const record = await this.readMigrated();
    for (const imported of backup.learningItems) {
      const id = getLearningItemId(imported.dutch);
      record.items[id] = mergeImportedLearningItem(record.items[id], imported);
    }
    record.lessonProgress = mergeLessonProgress(record.lessonProgress, backup.lessonProgress);
    record.rhythm = mergeRhythm(record.rhythm, backup.rhythm);
    record.grammar = mergeGrammarRecords(record.grammar, backup.grammar ?? {});
    await this.write(record);
    const items = Object.values(record.items).sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
    return { items, importedCount: backup.learningItems.length, totalCount: items.length };
  }

  async importVersionOneBackup(backup: VocabularyBackup): Promise<{ items: LearningItem[]; importedCount: number; totalCount: number }> {
    const record = migrateLegacyLearningRecord(await this.readMigrated(), [], backup.cards, this.now());
    await this.write(record);
    const items = Object.values(record.items).sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
    return { items, importedCount: backup.cards.length, totalCount: items.length };
  }

  private async readMigrated(): Promise<LearningRecord> {
    const raw = await this.storage.get(LEARNING_RECORD_STORAGE_KEY);
    if (isRecord(raw) && raw.version === 2) return parseRecord(raw);
    const stored = parseRecord(raw);
    const legacyVocabulary = parseLegacyVocabulary(await this.storage.get("dutchmate.savedVocabulary.v1"));
    const legacyCards = parseLegacyCards(await this.storage.get("dutchmate.reviewCards.v1"));
    const migrated = migrateLegacyLearningRecord(stored, Object.values(legacyVocabulary.entries), Object.values(legacyCards.cards), this.now());
    await this.write(migrated);
    return migrated;
  }

  private async write(record: LearningRecord): Promise<void> { await this.storage.set(LEARNING_RECORD_STORAGE_KEY, record); }
}

export function getLearningItemId(dutch: string): string { return `${LEARNING_LANGUAGE}\u001f${normalizeSavedVocabularyText(dutch)}`; }
export function createNewMastery(): LearningMastery { return { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }; }

export function migrateLegacyLearningRecord(existing: LearningRecord, entries: SavedVocabularyEntry[], cards: ReviewCard[], now = Date.now()): LearningRecord {
  const result: LearningRecord = { version: 2, items: { ...existing.items }, lessonProgress: { ...existing.lessonProgress }, rhythm: { ...existing.rhythm }, grammar: { ...existing.grammar } };
  for (const card of cards) result.items[getLearningItemId(card.dutch)] = mergeLegacyCard(result.items[getLearningItemId(card.dutch)], card, now);
  for (const entry of entries) {
    const contribution = legacyContribution(entry, entries);
    if (!contribution) continue;
    result.items[getLearningItemId(contribution.dutch)] = mergeLearningItem(result.items[getLearningItemId(contribution.dutch)], contribution, entry.updatedAt);
  }
  return result;
}

export function parseLearningBackup(input: string | unknown, preserveLegacyVersion = false): LearningBackup | LegacyLearningBackup {
  let value: unknown = input;
  if (typeof input === "string") { try { value = JSON.parse(input); } catch { throw new Error("This learning file is not valid JSON."); } }
  if (!isRecord(value) || value.format !== LEARNING_BACKUP_FORMAT || (value.version !== 2 && value.version !== LEARNING_BACKUP_VERSION) || !finite(value.exportedAt) || !Array.isArray(value.learningItems) || !isRecord(value.lessonProgress) || !isRecord(value.rhythm)) throw new Error("This learning file is not a supported DutchMate backup.");
  const learningItems = value.learningItems.map(parseLearningItem);
  const grammar = parseGrammarRecordsStrict(value.grammar, value.version === LEARNING_BACKUP_VERSION);
  if (isRecord(value.rhythm) && value.rhythm.dailyFive !== undefined && parseDailyFiveSnapshot(value.rhythm.dailyFive) === null) throw new Error("This learning file contains an invalid Daily Five snapshot.");
  const learningItemIds = new Set(learningItems.map((item) => item.id));
  const snapshot = isRecord(value.rhythm) ? parseDailyFiveSnapshot(value.rhythm.dailyFive) : null;
  if (snapshot?.tasks.some((task) => isVocabularyTask(task) && !learningItemIds.has(task.itemId))) throw new Error("This learning file contains an invalid Daily Five task.");
  const parsed = { format: LEARNING_BACKUP_FORMAT as typeof LEARNING_BACKUP_FORMAT, version: 3 as const, exportedAt: value.exportedAt, learningItems, lessonProgress: value.lessonProgress, rhythm: value.rhythm, grammar };
  return preserveLegacyVersion && value.version === 2 ? { ...parsed, version: 2 as const } : parsed;
}

export function parseLearningImport(input: string | unknown): LearningBackup | LegacyLearningBackup | VocabularyBackup {
  const value = typeof input === "string" ? tryJson(input) : input;
  if (isRecord(value) && (value.version === 2 || value.version === LEARNING_BACKUP_VERSION)) return parseLearningBackup(value, value.version === 2);
  return parseVocabularyBackup(value);
}

export function serializeLearningBackup(backup: LearningBackup): string { return `${JSON.stringify(backup, null, 2)}\n`; }

function mergeLearningItem(existing: LearningItem | undefined, input: CreateOrMergeLearningItemInput, timestamp: number): LearningItem {
  const dutch = normalizeSavedVocabularyText(input.dutch); const id = getLearningItemId(dutch); const context = normalizeContext(input.context, dutch, timestamp, input.contextSourceLanguage, input.contextSourceText, input.contextTranslations);
  if (!existing) return { id, learningLanguage: LEARNING_LANGUAGE, normalizedDutch: dutch, dutch, kind: input.kind ?? (dutch.includes(" ") ? "chunk" : "word"), english: input.english ?? null, telugu: input.telugu ?? null, sources: input.source ? [{ type: input.source, addedAt: timestamp, ...input.sourceMetadata }] : [], contexts: context ? [context] : [], encounters: { count: 0, lastEncounterAt: null }, recognition: createNewMastery(), recall: createNewMastery(), createdAt: timestamp, updatedAt: timestamp };
  return { ...existing, english: existing.english ?? input.english ?? null, telugu: existing.telugu ?? input.telugu ?? null, sources: mergeSource(existing.sources, input.source, timestamp, input.sourceMetadata), contexts: mergeContexts(existing.contexts, context), updatedAt: Math.max(existing.updatedAt, timestamp) };
}
function mergeLegacyCard(existing: LearningItem | undefined, card: ReviewCard, now: number): LearningItem {
  const item = mergeLearningItem(existing, { dutch: card.dutch, english: card.english, telugu: card.telugu, source: "webpage", sourceMetadata: card.originalLanguage ? { originalLanguage: card.originalLanguage } : undefined, context: card.pageContext }, card.updatedAt);
  const recognition = existing || card.reviewCount === 0 ? item.recognition : { state: "learning" as const, dueAt: card.dueAt === null ? now : Math.min(card.dueAt, now), intervalDays: 1, attemptCount: card.reviewCount, successfulStreak: 0, lastPractisedAt: card.lastReviewedAt };
  return { ...item, recognition, createdAt: Math.min(item.createdAt, card.createdAt), updatedAt: Math.max(item.updatedAt, card.updatedAt) };
}
function mergeImportedLearningItem(existing: LearningItem | undefined, imported: LearningItem): LearningItem {
  if (!existing) return { ...imported, id: getLearningItemId(imported.dutch), normalizedDutch: normalizeSavedVocabularyText(imported.dutch), contexts: imported.contexts.slice(-3) };
  const importedIsNewer = Math.max(imported.recognition.lastPractisedAt ?? imported.updatedAt, imported.recall.lastPractisedAt ?? imported.updatedAt) > Math.max(existing.recognition.lastPractisedAt ?? existing.updatedAt, existing.recall.lastPractisedAt ?? existing.updatedAt);
  return { ...existing, english: existing.english ?? imported.english, telugu: existing.telugu ?? imported.telugu, sources: deduplicateSources([...existing.sources, ...imported.sources]), contexts: mergeContexts(existing.contexts, ...imported.contexts.map((context) => normalizeContext(context.text, existing.dutch, context.addedAt, context.sourceLanguage, undefined, { english: context.english, telugu: context.telugu }))), recognition: importedIsNewer ? imported.recognition : existing.recognition, recall: importedIsNewer ? imported.recall : existing.recall, createdAt: Math.min(existing.createdAt, imported.createdAt), updatedAt: Math.max(existing.updatedAt, imported.updatedAt) };
}
function mergeSource(sources: LearningItemSource[], source: "webpage" | "lesson" | undefined, addedAt: number, metadata?: Omit<LearningItemSource, "type" | "addedAt">): LearningItemSource[] { return source ? deduplicateSources([...sources, { type: source, addedAt, ...metadata }]) : sources; }
function withActiveDay(rhythm: Record<string, unknown>, timestamp: number, source: "dailyFiveCompletions" | "lessonCompletions", extra: Record<string, unknown> = {}): Record<string, unknown> { const day = getLocalDayStart(timestamp); const entry = { completedAt: timestamp, ...extra }; return { activeDays: { ...(isRecord(rhythm.activeDays) ? rhythm.activeDays : {}), [day]: entry }, [source]: { ...(isRecord(rhythm[source]) ? rhythm[source] : {}), [day]: entry } }; }
function withActivity(rhythm: Record<string, unknown>, timestamp: number, changes: { reviews?: number; saved?: number; lessons?: number }): Record<string, unknown> {
  const day = getLocalDayStart(timestamp);
  const activityDays = isRecord(rhythm.activityDays) ? rhythm.activityDays : {};
  const hasPrevious = isRecord(activityDays[day]);
  const previous: Record<string, unknown> = isRecord(activityDays[day]) ? activityDays[day] : {};
  const count = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
  const next = (key: "reviews" | "saved" | "lessons") => {
    const previousCount = typeof previous[key] === "number" && Number.isFinite(previous[key]) && previous[key] >= 0 ? previous[key] : undefined;
    if (previousCount !== undefined) return previousCount + (changes[key] ?? 0);
    return hasPrevious ? undefined : count(changes[key]);
  };
  const reviews = next("reviews"); const saved = next("saved"); const lessons = next("lessons");
  const lessonAdditions = lessons === undefined && hasPrevious
    ? count(previous.lessonAdditions) + (changes.lessons ?? 0)
    : count(previous.lessonAdditions);
  return { activityDays: { ...activityDays, [day]: { ...(reviews === undefined ? {} : { reviews }), ...(saved === undefined ? {} : { saved }), ...(lessons === undefined ? {} : { lessons }), ...(lessonAdditions > 0 ? { lessonAdditions } : {}), updatedAt: timestamp } } };
}
function mergeRhythm(existing: Record<string, unknown>, imported: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...existing, ...imported, ...Object.fromEntries(["activeDays", "dailyFiveCompletions", "lessonCompletions"].map((key) => [key, { ...(isRecord(existing[key]) ? existing[key] : {}), ...(isRecord(imported[key]) ? imported[key] : {}) }])), activityDays: mergeActivityDays(existing.activityDays, imported.activityDays) };
  const localSnapshot = parseDailyFiveSnapshot(existing.dailyFive);
  const importedSnapshot = parseDailyFiveSnapshot(imported.dailyFive);
  if (localSnapshot && importedSnapshot && localSnapshot.createdAt === importedSnapshot.createdAt && localSnapshot.tasks.every((task, index) => taskId(task) === taskId(importedSnapshot.tasks[index]))) result.dailyFive = { ...localSnapshot, completedTaskIds: [...new Set([...localSnapshot.completedTaskIds, ...importedSnapshot.completedTaskIds])], goalCompleted: localSnapshot.goalCompleted || importedSnapshot.goalCompleted };
  else if (localSnapshot && (!importedSnapshot || localSnapshot.createdAt > importedSnapshot.createdAt)) result.dailyFive = localSnapshot;
  else if (importedSnapshot) result.dailyFive = importedSnapshot;
  return result;
}

function mergeGrammarRecords(local: Record<string, GrammarRecord>, imported: Record<string, GrammarRecord>): Record<string, GrammarRecord> {
  const result = { ...local };
  for (const [patternId, incoming] of Object.entries(imported)) {
    if (!incoming || incoming.patternId !== patternId || incoming.contentVersion !== 1) continue;
    const existing = result[patternId];
    if (!existing) { result[patternId] = incoming; continue; }
    const successfulExerciseIds = [...new Set([...existing.successfulExerciseIds, ...incoming.successfulExerciseIds])].slice(-8);
    const merged: GrammarRecord = {
      ...existing,
      state: existing.state === "applied" || incoming.state === "applied" ? "applied" : existing.state === "practising" || incoming.state === "practising" ? "practising" : "introduced",
      introducedAt: Math.min(existing.introducedAt, incoming.introducedAt),
      lastPractisedAt: Math.max(existing.lastPractisedAt ?? 0, incoming.lastPractisedAt ?? 0) || null,
      dueAt: Math.min(existing.dueAt, incoming.dueAt),
      intervalDays: Math.max(existing.intervalDays, incoming.intervalDays),
      successfulEvidenceCount: Math.min(8, Math.max(existing.successfulEvidenceCount, incoming.successfulEvidenceCount, successfulExerciseIds.length)),
      successfulExerciseIds,
      primitives: [...new Set([...existing.primitives, ...incoming.primitives])].slice(-8),
      contextTags: [...new Set([...existing.contextTags, ...incoming.contextTags])].slice(-8),
      recentExerciseIds: [...new Set([...existing.recentExerciseIds, ...incoming.recentExerciseIds])].slice(-8),
      recentSuccessfulDays: [...new Set([...existing.recentSuccessfulDays, ...incoming.recentSuccessfulDays])].sort((a, b) => a - b).slice(-8),
      delayedEvidence: existing.delayedEvidence || incoming.delayedEvidence,
      misconceptionCounts: Object.fromEntries(Array.from(new Set([...Object.keys(existing.misconceptionCounts), ...Object.keys(incoming.misconceptionCounts)])).map((key) => [key, Math.min(9, Math.max(existing.misconceptionCounts[key] ?? 0, incoming.misconceptionCounts[key] ?? 0))])),
      evidenceRevision: Math.max(existing.evidenceRevision, incoming.evidenceRevision),
      updatedAt: Math.max(existing.updatedAt, incoming.updatedAt),
    };
    const applied = merged.successfulExerciseIds.length >= 4 && merged.primitives.length >= 2 && merged.contextTags.length >= 3 && merged.recentSuccessfulDays.length >= 2 && merged.delayedEvidence;
    merged.state = applied ? "applied" : merged.state === "applied" ? "practising" : merged.state;
    result[patternId] = merged;
  }
  return result;
}

function sanitizeDailyFiveSnapshot(snapshot: DailyFiveSnapshot | null, items: Record<string, LearningItem>): DailyFiveSnapshot | null {
  if (!snapshot) return null;
  const tasks = snapshot.tasks.filter((task) => isVocabularyTask(task) ? items[task.itemId] !== undefined : isGrammarContentAvailable());
  const taskIds = new Set(tasks.map(taskId));
  const completedTaskIds = snapshot.completedTaskIds.filter((id) => taskIds.has(id));
  return { ...snapshot, tasks, completedTaskIds, goalCompleted: tasks.length > 0 && completedTaskIds.length === tasks.length };
}
function mergeActivityDays(local: unknown, incoming: unknown): Record<string, unknown> {
  const result = { ...(isRecord(local) ? local : {}) };
  if (!isRecord(incoming)) return result;
  for (const [day, value] of Object.entries(incoming)) {
    if (!isRecord(value)) continue;
    const hasCurrent = isRecord(result[day]);
    const current: Record<string, unknown> = isRecord(result[day]) ? result[day] : {};
    const count = (entry: Record<string, unknown>, key: "reviews" | "saved" | "lessons" | "lessonAdditions") => typeof entry[key] === "number" && Number.isFinite(entry[key]) && entry[key] >= 0 ? entry[key] : undefined;
    const mergedCount = (key: "reviews" | "saved" | "lessons") => {
      const currentCount = count(current, key); const incomingCount = count(value, key);
      if (!hasCurrent) return incomingCount;
      if (currentCount === undefined) return incomingCount;
      if (incomingCount === undefined) return currentCount;
      return Math.max(currentCount, incomingCount);
    };
    const reviews = mergedCount("reviews"); const saved = mergedCount("saved"); const lessons = mergedCount("lessons");
    const lessonAdditions = Math.max(count(current, "lessonAdditions") ?? 0, count(value, "lessonAdditions") ?? 0);
    result[day] = { ...(reviews === undefined ? {} : { reviews }), ...(saved === undefined ? {} : { saved }), ...(lessons === undefined ? {} : { lessons }), ...(lessonAdditions > 0 ? { lessonAdditions } : {}), updatedAt: Math.max(typeof current.updatedAt === "number" ? current.updatedAt : 0, typeof value.updatedAt === "number" ? value.updatedAt : 0) };
  }
  return result;
}
function deduplicateSources(sources: LearningItemSource[]): LearningItemSource[] { return sources.filter((item, index, all) => all.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(item)) === index); }
function mergeContexts(contexts: LearningContext[], ...incoming: Array<LearningContext | null>): LearningContext[] { const result = [...contexts]; for (const context of incoming) { if (!context) continue; const index = result.findIndex((candidate) => normalizeSavedVocabularyText(candidate.text) === normalizeSavedVocabularyText(context.text) && candidate.sourceLanguage === context.sourceLanguage); if (index >= 0) { const existing = result[index]; result[index] = { ...existing, ...(existing.english == null && context.english != null ? { english: context.english } : {}), ...(existing.telugu == null && context.telugu != null ? { telugu: context.telugu } : {}) }; continue; } result.push(context); } return result.slice(-3); }
function normalizeContext(value: string | null | undefined, dutch: string, addedAt: number, sourceLanguage?: MvpLanguageCode, sourceText?: string | null, translations?: { english?: string | null; telugu?: string | null } | null): LearningContext | null {
  if (!value) return null;
  const text = value.trim().replace(/\s+/g, " ").slice(0, 240);
  const requiredText = sourceLanguage ? sourceText?.trim() : dutch;
  if (!text || (sourceLanguage && typeof sourceText === "string" && !requiredText) || (requiredText && !normalizeSavedVocabularyText(text).includes(normalizeSavedVocabularyText(requiredText)))) return null;
  return { text, addedAt, ...(sourceLanguage ? { sourceLanguage } : {}), ...(translations?.english != null ? { english: translations.english } : {}), ...(translations?.telugu != null ? { telugu: translations.telugu } : {}) };
}
function lessonProgressKey(lessonId: string, contentVersion: number): string { return `${lessonId}\u001f${contentVersion}`; }
function parseLessonProgress(value: unknown): LessonProgress | undefined { return isRecord(value) && typeof value.lessonId === "string" && finite(value.contentVersion) && (value.stage === "read" || value.stage === "notice" || value.stage === "practise" || value.stage === "replay" || value.stage === "keep") && (value.completedAt === null || finite(value.completedAt)) && Array.isArray(value.keptCandidateIds) && value.keptCandidateIds.every((id) => typeof id === "string") && finite(value.updatedAt) ? { lessonId: value.lessonId, contentVersion: value.contentVersion, stage: value.stage, completedAt: value.completedAt, keptCandidateIds: value.keptCandidateIds, updatedAt: value.updatedAt } : undefined; }
function mergeLessonProgress(local: Record<string, unknown>, imported: Record<string, unknown>): Record<string, unknown> { const result = { ...local }; for (const [key, value] of Object.entries(imported)) { const incoming = parseLessonProgress(value); if (!incoming) continue; const existing = parseLessonProgress(result[key]); if (!existing || incoming.updatedAt > existing.updatedAt) result[key] = incoming; } return result; }
function legacyContribution(entry: SavedVocabularyEntry, entries: SavedVocabularyEntry[]): CreateOrMergeLearningItemInput | null { const source = entry.detectedSourceLanguage ?? entry.sourceLanguage; const sourceMetadata = { sourceLanguage: entry.sourceLanguage, ...(entry.detectedSourceLanguage ? { detectedSourceLanguage: entry.detectedSourceLanguage } : {}), targetLanguage: entry.targetLanguage, providerName: entry.providerName }; if (source === "nl") return entry.targetLanguage === "en" ? { dutch: entry.text, english: entry.translatedText, source: "webpage", sourceMetadata, context: entry.pageContext } : entry.targetLanguage === "te" ? { dutch: entry.text, telugu: entry.translatedText, source: "webpage", sourceMetadata, context: entry.pageContext } : null; if (source !== "en" && source !== "te") return null; const dutch = entry.targetLanguage === "nl" ? entry.translatedText : entries.find((candidate) => (candidate.detectedSourceLanguage ?? candidate.sourceLanguage) === source && candidate.text === entry.text && candidate.targetLanguage === "nl")?.translatedText; if (!dutch) return null; return source === "en" ? { dutch, english: entry.text, source: "webpage", sourceMetadata, context: entry.pageContext } : { dutch, telugu: entry.text, source: "webpage", sourceMetadata, context: entry.pageContext }; }
function parseRecord(value: unknown): LearningRecord { return isRecord(value) && value.version === 2 && isRecord(value.items) && isRecord(value.lessonProgress) && isRecord(value.rhythm) ? { version: 2, items: Object.fromEntries(Object.entries(value.items).flatMap(([, item]) => { try { const parsed = parseLearningItem(item); return [[parsed.id, parsed]]; } catch { return []; } })), lessonProgress: value.lessonProgress, rhythm: value.rhythm, grammar: parseGrammarRecords(value.grammar) } : { version: 2, items: {}, lessonProgress: {}, rhythm: {}, grammar: {} }; }
function parseLegacyVocabulary(value: unknown): LegacyData { return isRecord(value) && isRecord(value.entries) ? { entries: value.entries as Record<string, SavedVocabularyEntry> } : { entries: {} }; }
function parseLegacyCards(value: unknown): LegacyReviewData { return isRecord(value) && isRecord(value.cards) ? { cards: value.cards as Record<string, ReviewCard> } : { cards: {} }; }
function parseLearningItem(value: unknown): LearningItem {
  if (!isRecord(value) || typeof value.dutch !== "string") throw new Error("This learning file contains an invalid learning item.");
  const dutch = value.dutch;
  if (typeof value.normalizedDutch !== "string" || value.normalizedDutch !== normalizeSavedVocabularyText(dutch) || typeof value.id !== "string" || value.id !== getLearningItemId(dutch) || value.learningLanguage !== LEARNING_LANGUAGE || (value.kind !== "word" && value.kind !== "chunk") || !nullableString(value.english) || !nullableString(value.telugu) || !Array.isArray(value.sources) || !value.sources.every(isLearningSource) || !Array.isArray(value.contexts) || !value.contexts.every((context) => isLearningContext(context, dutch)) || value.contexts.length > 3 || !mastery(value.recognition) || !mastery(value.recall) || !finite(value.createdAt) || !finite(value.updatedAt) || (value.encounters !== undefined && !learningEncounter(value.encounters))) throw new Error("This learning file contains an invalid learning item.");
  return { ...value, encounters: value.encounters ?? { count: 0, lastEncounterAt: null } } as LearningItem;
}
function parseDailyFiveSnapshot(value: unknown): DailyFiveSnapshot | null {
  if (!isRecord(value) || !finite(value.createdAt) || !finite(value.dayStartAt) || !Array.isArray(value.tasks) || !Array.isArray(value.completedTaskIds) || typeof value.goalCompleted !== "boolean") return null;
  const tasks = value.tasks.filter((task): task is DailyFiveTask => isVocabularyTask(task) || isGrammarTask(task));
  if (tasks.length !== value.tasks.length || tasks.length > 5 || new Set(tasks.map(taskId)).size !== tasks.length || !value.completedTaskIds.every((id) => typeof id === "string" && tasks.some((task) => taskId(task) === id))) return null;
  return { createdAt: value.createdAt, dayStartAt: value.dayStartAt, tasks, completedTaskIds: value.completedTaskIds as string[], goalCompleted: value.goalCompleted };
}
function taskId(task: DailyFiveTask): string { return isVocabularyTask(task) ? `${task.itemId}\u001f${task.dimension}` : `${task.patternId}\u001f${task.exerciseId}`; }
function isVocabularyTask(value: unknown): value is { itemId: string; dimension: DailyFiveDimension } { return isRecord(value) && typeof value.itemId === "string" && (value.dimension === "recognition" || value.dimension === "recall"); }
function isGrammarTask(value: unknown): value is Extract<DailyFiveTask, { kind: "grammar" }> {
  if (!isRecord(value) || value.kind !== "grammar" || value.contentVersion !== 1 || typeof value.patternId !== "string" || typeof value.exerciseId !== "string") return false;
  const pattern = getGrammarPattern(value.patternId as GrammarPatternId);
  return pattern !== undefined && pattern.exercises.some((exercise) => exercise.id === value.exerciseId);
}
function parseGrammarRecords(value: unknown): Record<string, GrammarRecord> { if (!isRecord(value)) return {}; const result: Record<string, GrammarRecord> = {}; for (const [key, candidate] of Object.entries(value)) { const parsed = parseGrammarRecord(candidate); if (parsed && key === parsed.patternId) result[key] = parsed; } return result; }
function parseGrammarRecordsStrict(value: unknown, durable: boolean): Record<string, GrammarRecord> {
  if (value === undefined && !durable) return {};
  if (value === undefined) throw new Error("This learning file contains invalid grammar evidence.");
  if (!isRecord(value)) throw new Error("This learning file contains invalid grammar evidence.");
  const result: Record<string, GrammarRecord> = {};
  for (const [key, candidate] of Object.entries(value)) {
    const parsed = parseGrammarRecord(candidate, durable);
    if (!parsed || key !== parsed.patternId) throw new Error("This learning file contains invalid grammar evidence.");
    if (parsed.state === "applied" && !hasAppliedEvidence(parsed)) parsed.state = "practising";
    result[key] = parsed;
  }
  return result;
}
function parseGrammarRecord(value: unknown, durable = false): GrammarRecord | null {
  if (!isRecord(value) || typeof value.patternId !== "string" || value.contentVersion !== 1 || (value.state !== "introduced" && value.state !== "practising" && value.state !== "applied") || !finite(value.introducedAt) || (value.lastPractisedAt !== null && !finite(value.lastPractisedAt)) || !finite(value.dueAt) || !finite(value.intervalDays) || !nonNegativeInteger(value.successfulEvidenceCount) || !Array.isArray(value.primitives) || !value.primitives.every((entry) => typeof entry === "string") || !Array.isArray(value.contextTags) || !value.contextTags.every((entry) => typeof entry === "string") || !Array.isArray(value.recentExerciseIds) || !value.recentExerciseIds.every((entry) => typeof entry === "string") || !Array.isArray(value.recentSuccessfulDays) || !value.recentSuccessfulDays.every(finite) || typeof value.delayedEvidence !== "boolean" || !isRecord(value.misconceptionCounts) || !Object.values(value.misconceptionCounts).every(nonNegativeInteger) || !nonNegativeInteger(value.evidenceRevision)) return null;
  const pattern = getGrammarPattern(value.patternId as GrammarPatternId);
  if (!pattern) return null;
  const successfulExerciseIds = Array.isArray(value.successfulExerciseIds) && value.successfulExerciseIds.every((entry) => typeof entry === "string") ? value.successfulExerciseIds : [];
  const knownExerciseIds = new Set(pattern.exercises.map((exercise) => exercise.id));
  const knownPrimitives = new Set<string>(pattern.exercises.map((exercise) => exercise.primitive));
  const knownContextTags = new Set(pattern.exercises.map((exercise) => exercise.contextTag));
  if (durable && (!Array.isArray(value.successfulExerciseIds) || !finite(value.updatedAt) || successfulExerciseIds.length < Math.min(4, value.successfulEvidenceCount))) return null;
  if (successfulExerciseIds.some((entry) => !knownExerciseIds.has(entry)) || (value.recentExerciseIds as string[]).some((entry) => !knownExerciseIds.has(entry)) || (value.primitives as string[]).some((entry) => !knownPrimitives.has(entry)) || (value.contextTags as string[]).some((entry) => !knownContextTags.has(entry))) return null;
  const introducedAt = value.introducedAt as number;
  const lastPractisedAt = value.lastPractisedAt as number | null;
  const dueAt = value.dueAt as number;
  const intervalDays = value.intervalDays as number;
  const successfulEvidenceCount = value.successfulEvidenceCount as number;
  const state = value.state as GrammarRecord["state"];
  const primitives = value.primitives as string[];
  const contextTags = value.contextTags as string[];
  const recentExerciseIds = value.recentExerciseIds as string[];
  const recentSuccessfulDays = value.recentSuccessfulDays as number[];
  const misconceptionCounts = value.misconceptionCounts as Record<string, number>;
  const parsed: GrammarRecord = { patternId: value.patternId as GrammarPatternId, contentVersion: 1, state, introducedAt, lastPractisedAt, dueAt, intervalDays, successfulEvidenceCount: Math.min(8, successfulEvidenceCount), successfulExerciseIds: successfulExerciseIds.slice(-8), primitives: primitives.slice(-8), contextTags: contextTags.slice(-8), recentExerciseIds: recentExerciseIds.slice(-8), recentSuccessfulDays: recentSuccessfulDays.slice(-8), delayedEvidence: value.delayedEvidence, misconceptionCounts: Object.fromEntries(Object.entries(misconceptionCounts).map(([key, count]) => [key, Math.min(9, count)])), evidenceRevision: value.evidenceRevision as number, updatedAt: finite(value.updatedAt) ? value.updatedAt : lastPractisedAt ?? introducedAt };
  if (parsed.state === "applied" && !hasAppliedEvidence(parsed)) parsed.state = "practising";
  return parsed;
}
function hasAppliedEvidence(record: GrammarRecord): boolean { return record.successfulExerciseIds.length >= 4 && record.primitives.length >= 2 && record.contextTags.length >= 3 && record.recentSuccessfulDays.length >= 2 && record.delayedEvidence; }
function isLearningSource(value: unknown): value is LearningItemSource { return isRecord(value) && (value.type === "webpage" || value.type === "lesson") && finite(value.addedAt) && (value.lessonId === undefined || typeof value.lessonId === "string") && (value.sourceLanguage === undefined || value.sourceLanguage === "auto" || isLanguage(value.sourceLanguage)) && (value.detectedSourceLanguage === undefined || isLanguage(value.detectedSourceLanguage)) && (value.targetLanguage === undefined || isLanguage(value.targetLanguage)) && (value.providerName === undefined || typeof value.providerName === "string") && (value.originalLanguage === undefined || isLanguage(value.originalLanguage)); }
function isLearningContext(value: unknown, dutch: string): value is LearningContext { return isRecord(value) && typeof value.text === "string" && value.text.trim().length > 0 && value.text.length <= 240 && (!("sourceLanguage" in value) || isLanguage(value.sourceLanguage)) && (!("english" in value) || nullableString(value.english)) && (!("telugu" in value) || nullableString(value.telugu)) && (value.sourceLanguage !== undefined || value.text.toLocaleLowerCase().includes(normalizeSavedVocabularyText(dutch))) && finite(value.addedAt); }
function learningEncounter(value: unknown): value is LearningEncounter { return isRecord(value) && nonNegativeInteger(value.count) && (value.lastEncounterAt === null || finite(value.lastEncounterAt)); }
function tryJson(input: string): unknown { try { return JSON.parse(input); } catch { throw new Error("This learning file is not valid JSON."); } }
function mastery(value: unknown): value is LearningMastery { return isRecord(value) && (value.state === "new" || value.state === "learning" || value.state === "familiar" || value.state === "strong") && (value.dueAt === null || finite(value.dueAt)) && finite(value.intervalDays) && nonNegativeInteger(value.attemptCount) && nonNegativeInteger(value.successfulStreak) && (value.lastPractisedAt === null || finite(value.lastPractisedAt)); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; } function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); } function nonNegativeInteger(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 0; } function nullableString(value: unknown): value is string | null { return value === null || typeof value === "string"; } function isLanguage(value: unknown): value is MvpLanguageCode { return value === "en" || value === "nl" || value === "te"; }
