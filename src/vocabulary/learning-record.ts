import type { MvpLanguageCode } from "../shared/languages";
import type { SavedVocabularyEntry, SavedVocabularyStorage } from "./saved-vocabulary";
import type { ReviewCard, ReviewRating } from "./review-cards";
import { parseVocabularyBackup, type VocabularyBackup } from "./vocabulary-backup";
import { normalizeSavedVocabularyText } from "./saved-vocabulary";

export const LEARNING_RECORD_STORAGE_KEY = "dutchmate.learningRecord.v2";
export const LEARNING_BACKUP_FORMAT = "dutchmate-learning-backup";
export const LEARNING_BACKUP_VERSION = 2;
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
export type LearningItemSource = { type: "webpage" | "lesson"; addedAt: number; sourceLanguage?: MvpLanguageCode | "auto"; detectedSourceLanguage?: MvpLanguageCode; targetLanguage?: MvpLanguageCode; providerName?: string; originalLanguage?: MvpLanguageCode };
export type LearningContext = { text: string; addedAt: number };
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
};
export type LearningBackup = {
  format: typeof LEARNING_BACKUP_FORMAT;
  version: typeof LEARNING_BACKUP_VERSION;
  exportedAt: number;
  learningItems: LearningItem[];
  lessonProgress: Record<string, unknown>;
  rhythm: Record<string, unknown>;
};
export type CreateOrMergeLearningItemInput = {
  dutch: string;
  kind?: LearningItemKind;
  english?: string | null;
  telugu?: string | null;
  source?: "webpage" | "lesson";
  sourceMetadata?: Omit<LearningItemSource, "type" | "addedAt">;
  context?: string | null;
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
      due: items.filter((item) => item.recognition.attemptCount > 0 && item.recognition.dueAt !== null && item.recognition.dueAt <= now).length,
      new: items.filter((item) => item.recognition.attemptCount === 0).length,
      recent: [...items].sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id)).slice(0, 3),
    };
  }

  async createOrMerge(input: CreateOrMergeLearningItemInput): Promise<LearningItem> {
    const record = await this.readMigrated();
    const item = mergeLearningItem(record.items[getLearningItemId(input.dutch)], input, this.now());
    record.items[item.id] = item;
    await this.write(record);
    return item;
  }

  async recordEncounter(id: string, context: string | null | undefined): Promise<LearningItem | null> {
    const record = await this.readMigrated();
    const existing = record.items[id];
    if (!existing) return null;
    const encounteredAt = this.now();
    const encounter = normalizeContext(context, existing.dutch, encounteredAt);
    if (!encounter) return existing;
    const item = { ...existing, contexts: mergeContexts(existing.contexts, encounter), encounters: { count: existing.encounters.count + 1, lastEncounterAt: encounteredAt }, updatedAt: Math.max(existing.updatedAt, encounteredAt) };
    record.items[id] = item;
    await this.write(record);
    return item;
  }

  async delete(id: string): Promise<void> {
    const record = await this.readMigrated();
    delete record.items[id];
    await this.write(record);
    const legacyCards = parseLegacyCards(await this.storage.get("dutchmate.reviewCards.v1"));
    delete legacyCards.cards[id];
    await this.storage.set("dutchmate.reviewCards.v1", legacyCards);
    const dutch = id.startsWith(`${LEARNING_LANGUAGE}\u001f`) ? id.slice(3) : "";
    const legacyVocabulary = parseLegacyVocabulary(await this.storage.get("dutchmate.savedVocabulary.v1"));
    for (const [key, entry] of Object.entries(legacyVocabulary.entries)) {
      if (normalizeSavedVocabularyText(entry.text) === dutch || normalizeSavedVocabularyText(entry.translatedText) === dutch) delete legacyVocabulary.entries[key];
    }
    await this.storage.set("dutchmate.savedVocabulary.v1", legacyVocabulary);
  }

  async clear(): Promise<void> {
    await this.write({ version: 2, items: {}, lessonProgress: {}, rhythm: {} });
    await this.storage.set("dutchmate.reviewCards.v1", { cards: {} });
    await this.storage.set("dutchmate.savedVocabulary.v1", { entries: {} });
  }

  async exportBackup(): Promise<LearningBackup> {
    const record = await this.readMigrated();
    return { format: LEARNING_BACKUP_FORMAT, version: LEARNING_BACKUP_VERSION, exportedAt: this.now(), learningItems: Object.values(record.items), lessonProgress: record.lessonProgress, rhythm: record.rhythm };
  }

  async importBackup(backup: LearningBackup): Promise<{ items: LearningItem[]; importedCount: number; totalCount: number }> {
    const record = await this.readMigrated();
    for (const imported of backup.learningItems) {
      const id = getLearningItemId(imported.dutch);
      record.items[id] = mergeImportedLearningItem(record.items[id], imported);
    }
    record.lessonProgress = { ...record.lessonProgress, ...backup.lessonProgress };
    record.rhythm = { ...record.rhythm, ...backup.rhythm };
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
    const stored = parseRecord(await this.storage.get(LEARNING_RECORD_STORAGE_KEY));
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
  const result: LearningRecord = { version: 2, items: { ...existing.items }, lessonProgress: { ...existing.lessonProgress }, rhythm: { ...existing.rhythm } };
  for (const card of cards) result.items[getLearningItemId(card.dutch)] = mergeLegacyCard(result.items[getLearningItemId(card.dutch)], card, now);
  for (const entry of entries) {
    const contribution = legacyContribution(entry, entries);
    if (!contribution) continue;
    result.items[getLearningItemId(contribution.dutch)] = mergeLearningItem(result.items[getLearningItemId(contribution.dutch)], contribution, entry.updatedAt);
  }
  return result;
}

export function parseLearningBackup(input: string | unknown): LearningBackup {
  let value: unknown = input;
  if (typeof input === "string") { try { value = JSON.parse(input); } catch { throw new Error("This learning file is not valid JSON."); } }
  if (!isRecord(value) || value.format !== LEARNING_BACKUP_FORMAT || value.version !== LEARNING_BACKUP_VERSION || !finite(value.exportedAt) || !Array.isArray(value.learningItems) || !isRecord(value.lessonProgress) || !isRecord(value.rhythm)) throw new Error("This learning file is not a supported DutchMate backup.");
  const learningItems = value.learningItems.map(parseLearningItem);
  return { format: LEARNING_BACKUP_FORMAT, version: LEARNING_BACKUP_VERSION, exportedAt: value.exportedAt, learningItems, lessonProgress: value.lessonProgress, rhythm: value.rhythm };
}

export function parseLearningImport(input: string | unknown): LearningBackup | VocabularyBackup {
  const value = typeof input === "string" ? tryJson(input) : input;
  if (isRecord(value) && value.version === LEARNING_BACKUP_VERSION) return parseLearningBackup(value);
  return parseVocabularyBackup(value);
}

export function serializeLearningBackup(backup: LearningBackup): string { return `${JSON.stringify(backup, null, 2)}\n`; }

function mergeLearningItem(existing: LearningItem | undefined, input: CreateOrMergeLearningItemInput, timestamp: number): LearningItem {
  const dutch = normalizeSavedVocabularyText(input.dutch); const id = getLearningItemId(dutch); const context = normalizeContext(input.context, dutch, timestamp);
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
  return { ...existing, english: existing.english ?? imported.english, telugu: existing.telugu ?? imported.telugu, sources: deduplicateSources([...existing.sources, ...imported.sources]), contexts: mergeContexts(existing.contexts, ...imported.contexts.map((context) => normalizeContext(context.text, existing.dutch, context.addedAt))), recognition: importedIsNewer ? imported.recognition : existing.recognition, recall: importedIsNewer ? imported.recall : existing.recall, createdAt: Math.min(existing.createdAt, imported.createdAt), updatedAt: Math.max(existing.updatedAt, imported.updatedAt) };
}
function mergeSource(sources: LearningItemSource[], source: "webpage" | "lesson" | undefined, addedAt: number, metadata?: Omit<LearningItemSource, "type" | "addedAt">): LearningItemSource[] { return source ? deduplicateSources([...sources, { type: source, addedAt, ...metadata }]) : sources; }
function deduplicateSources(sources: LearningItemSource[]): LearningItemSource[] { return sources.filter((item, index, all) => all.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(item)) === index); }
function mergeContexts(contexts: LearningContext[], ...incoming: Array<LearningContext | null>): LearningContext[] { const result = [...contexts]; for (const context of incoming) { if (!context) continue; const index = result.findIndex((candidate) => normalizeSavedVocabularyText(candidate.text) === normalizeSavedVocabularyText(context.text)); if (index >= 0) continue; result.push(context); } return result.slice(-3); }
function normalizeContext(value: string | null | undefined, dutch: string, addedAt: number): LearningContext | null { if (!value) return null; const text = value.trim().replace(/\s+/g, " ").slice(0, 240); return text && text.toLocaleLowerCase().includes(dutch.toLocaleLowerCase()) ? { text, addedAt } : null; }
function legacyContribution(entry: SavedVocabularyEntry, entries: SavedVocabularyEntry[]): CreateOrMergeLearningItemInput | null { const source = entry.detectedSourceLanguage ?? entry.sourceLanguage; const sourceMetadata = { sourceLanguage: entry.sourceLanguage, ...(entry.detectedSourceLanguage ? { detectedSourceLanguage: entry.detectedSourceLanguage } : {}), targetLanguage: entry.targetLanguage, providerName: entry.providerName }; if (source === "nl") return entry.targetLanguage === "en" ? { dutch: entry.text, english: entry.translatedText, source: "webpage", sourceMetadata, context: entry.pageContext } : entry.targetLanguage === "te" ? { dutch: entry.text, telugu: entry.translatedText, source: "webpage", sourceMetadata, context: entry.pageContext } : null; if (source !== "en" && source !== "te") return null; const dutch = entry.targetLanguage === "nl" ? entry.translatedText : entries.find((candidate) => (candidate.detectedSourceLanguage ?? candidate.sourceLanguage) === source && candidate.text === entry.text && candidate.targetLanguage === "nl")?.translatedText; if (!dutch) return null; return source === "en" ? { dutch, english: entry.text, source: "webpage", sourceMetadata, context: entry.pageContext } : { dutch, telugu: entry.text, source: "webpage", sourceMetadata, context: entry.pageContext }; }
function parseRecord(value: unknown): LearningRecord { return isRecord(value) && value.version === 2 && isRecord(value.items) && isRecord(value.lessonProgress) && isRecord(value.rhythm) ? { version: 2, items: Object.fromEntries(Object.entries(value.items).flatMap(([, item]) => { try { const parsed = parseLearningItem(item); return [[parsed.id, parsed]]; } catch { return []; } })), lessonProgress: value.lessonProgress, rhythm: value.rhythm } : { version: 2, items: {}, lessonProgress: {}, rhythm: {} }; }
function parseLegacyVocabulary(value: unknown): LegacyData { return isRecord(value) && isRecord(value.entries) ? { entries: value.entries as Record<string, SavedVocabularyEntry> } : { entries: {} }; }
function parseLegacyCards(value: unknown): LegacyReviewData { return isRecord(value) && isRecord(value.cards) ? { cards: value.cards as Record<string, ReviewCard> } : { cards: {} }; }
function parseLearningItem(value: unknown): LearningItem {
  if (!isRecord(value) || typeof value.dutch !== "string") throw new Error("This learning file contains an invalid learning item.");
  const dutch = value.dutch;
  if (typeof value.normalizedDutch !== "string" || value.normalizedDutch !== normalizeSavedVocabularyText(dutch) || typeof value.id !== "string" || value.id !== getLearningItemId(dutch) || value.learningLanguage !== LEARNING_LANGUAGE || (value.kind !== "word" && value.kind !== "chunk") || !nullableString(value.english) || !nullableString(value.telugu) || !Array.isArray(value.sources) || !value.sources.every(isLearningSource) || !Array.isArray(value.contexts) || !value.contexts.every((context) => isLearningContext(context, dutch)) || value.contexts.length > 3 || !mastery(value.recognition) || !mastery(value.recall) || !finite(value.createdAt) || !finite(value.updatedAt) || (value.encounters !== undefined && !learningEncounter(value.encounters))) throw new Error("This learning file contains an invalid learning item.");
  return { ...value, encounters: value.encounters ?? { count: 0, lastEncounterAt: null } } as LearningItem;
}
function isLearningSource(value: unknown): value is LearningItemSource { return isRecord(value) && (value.type === "webpage" || value.type === "lesson") && finite(value.addedAt) && (value.sourceLanguage === undefined || value.sourceLanguage === "auto" || isLanguage(value.sourceLanguage)) && (value.detectedSourceLanguage === undefined || isLanguage(value.detectedSourceLanguage)) && (value.targetLanguage === undefined || isLanguage(value.targetLanguage)) && (value.providerName === undefined || typeof value.providerName === "string") && (value.originalLanguage === undefined || isLanguage(value.originalLanguage)); }
function isLearningContext(value: unknown, dutch: string): value is LearningContext { return isRecord(value) && typeof value.text === "string" && value.text.length <= 240 && value.text.toLocaleLowerCase().includes(normalizeSavedVocabularyText(dutch)) && finite(value.addedAt); }
function learningEncounter(value: unknown): value is LearningEncounter { return isRecord(value) && nonNegativeInteger(value.count) && (value.lastEncounterAt === null || finite(value.lastEncounterAt)); }
function tryJson(input: string): unknown { try { return JSON.parse(input); } catch { throw new Error("This learning file is not valid JSON."); } }
function mastery(value: unknown): value is LearningMastery { return isRecord(value) && (value.state === "new" || value.state === "learning" || value.state === "familiar" || value.state === "strong") && (value.dueAt === null || finite(value.dueAt)) && finite(value.intervalDays) && nonNegativeInteger(value.attemptCount) && nonNegativeInteger(value.successfulStreak) && (value.lastPractisedAt === null || finite(value.lastPractisedAt)); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; } function finite(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); } function nonNegativeInteger(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 0; } function nullableString(value: unknown): value is string | null { return value === null || typeof value === "string"; } function isLanguage(value: unknown): value is MvpLanguageCode { return value === "en" || value === "nl" || value === "te"; }
