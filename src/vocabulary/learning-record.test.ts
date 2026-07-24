import { describe, expect, it } from "vitest";
import { LEARNING_RECORD_STORAGE_KEY, LearningRecordStore, parseLearningBackup } from "./learning-record";
import type { SavedVocabularyStorage } from "./saved-vocabulary";

describe("LearningRecordStore", () => {
  it("migrates legacy Dutch meanings and review history once without duplicates", async () => {
    const storage = new MemoryStorage();
    await storage.set("dutchmate.savedVocabulary.v1", { entries: {
      "nl\u001fhuis\u001fen": entry("en", "house"),
      "nl\u001fhuis\u001fte": entry("te", "ఇల్లు"),
    } });
    await storage.set("dutchmate.reviewCards.v1", { cards: { "nl\u001fhuis": card() } });
    const records = new LearningRecordStore(storage, () => 10_000);

    const [first] = await records.list();
    const [second] = await records.list();

    expect(first).toMatchObject({ id: "nl\u001fhuis", kind: "word", english: "house", telugu: "ఇల్లు", recognition: { state: "learning", dueAt: 5_000, attemptCount: 2 }, recall: { state: "new", attemptCount: 0 } });
    expect(first.sources).toEqual(expect.arrayContaining([expect.objectContaining({ providerName: "test", detectedSourceLanguage: "nl", targetLanguage: "en" })]));
    expect(second).toEqual(first);
    expect((storage.values.get(LEARNING_RECORD_STORAGE_KEY) as { items: Record<string, unknown> }).items).toHaveProperty("nl\u001fhuis");
  });

  it("merges new records safely and exports only learning data", async () => {
    const storage = new MemoryStorage();
    await storage.set("providerApiKey", "secret");
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "  goede   morgen ", kind: "chunk", english: "good morning", source: "webpage", context: "Goede morgen, buur!" });
    await records.createOrMerge({ dutch: "goede morgen", telugu: "శుభోదయం", source: "lesson", context: "Goede morgen, buur!" });
    const backup = await records.exportBackup();

    expect(backup.version).toBe(2);
    expect(backup.learningItems[0]).toMatchObject({
      id: "nl\u001fgoede morgen",
      kind: "chunk",
      english: "good morning",
      telugu: "శుభోదయం",
      contexts: [{ text: "Goede morgen, buur!" }],
      recognition: { state: "new", attemptCount: 0, dueAt: null },
      recall: { state: "new", attemptCount: 0, dueAt: null },
    });
    expect(JSON.stringify(backup)).not.toContain("secret");
  });

  it("retains context translations through merge, backup, import, and restart without replacing local mastery", async () => {
    const source = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await source.createOrMerge({ dutch: "huis", english: "house", context: "Een huis staat daar.", contextTranslations: { english: "A house stands there.", telugu: "అక్కడ ఒక ఇల్లు ఉంది." } });
    const backup = await source.exportBackup();
    const restored = new LearningRecordStore(new MemoryStorage(), () => 2_000);
    const local = await restored.createOrMerge({ dutch: "huis", context: "Dit huis is nieuw.", contextTranslations: { english: "This house is new.", telugu: "ఈ ఇల్లు కొత్తది." } });
    await restored.recordMissionResult(local.id, "recognition", "got-it", 0);
    await restored.importBackup(backup);
    await restored.createOrMerge({ dutch: "huis", context: "Een huis staat daar.", contextTranslations: { english: "A different translation", telugu: "వేరే అనువాదం" } });

    await expect(restored.list()).resolves.toEqual([expect.objectContaining({ contexts: expect.arrayContaining([expect.objectContaining({ text: "Een huis staat daar.", english: "A house stands there.", telugu: "అక్కడ ఒక ఇల్లు ఉంది." }), expect.objectContaining({ text: "Dit huis is nieuw.", english: "This house is new.", telugu: "ఈ ఇల్లు కొత్తది." })]), recognition: expect.objectContaining({ attemptCount: 1 }) })]);
  });

  it("records only distinct recent encounter contexts without changing mastery", async () => {
    const storage = new MemoryStorage();
    let now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "goede morgen", kind: "chunk" });

    await records.recordEncounter(item.id, "Goede morgen, buur.");
    now = 2_000;
    await records.recordEncounter(item.id, "Goede morgen, buur.");
    now = 3_000;
    await records.recordEncounter(item.id, "Goede morgen, collega.");
    now = 4_000;
    await records.recordEncounter(item.id, "Goede morgen, iedereen.");
    now = 5_000;
    await records.recordEncounter(item.id, "Goede morgen, vrienden.");

    const [updated] = await records.list();
    expect(updated.contexts).toEqual([
      { text: "Goede morgen, collega.", addedAt: 3_000 },
      { text: "Goede morgen, iedereen.", addedAt: 4_000 },
      { text: "Goede morgen, vrienden.", addedAt: 5_000 },
    ]);
    expect(updated.encounters).toEqual({ count: 5, lastEncounterAt: 5_000 });
    expect(updated.recognition).toEqual(item.recognition);
    expect(updated.recall).toEqual(item.recall);
  });

  it("records Context Mission recognition without completing or changing a Daily Five snapshot", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    const snapshot = await records.getDailyFive();

    const updated = await records.recordMissionResult(item.id, "recognition", "got-it", 0);

    expect(updated.item.recognition).toMatchObject({ state: "learning", attemptCount: 1, successfulStreak: 1 });
    expect(updated.item.recall).toEqual(item.recall);
    expect((await records.getDailyFive()).completedTaskIds).toEqual(snapshot.completedTaskIds);
    await expect(records.recordMissionResult(item.id, "recognition", "got-it", 0)).resolves.toMatchObject({ recorded: false, item: updated.item });
  });

  it("records Context Mission recall without changing recognition or a Daily Five snapshot", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    const snapshot = await records.getDailyFive();

    const updated = await records.recordMissionResult(item.id, "recall", "again", 0);

    expect(updated.item.recall).toMatchObject({ state: "learning", attemptCount: 1, successfulStreak: 0 });
    expect(updated.item.recognition).toEqual(item.recognition);
    expect((await records.getDailyFive()).completedTaskIds).toEqual(snapshot.completedTaskIds);
    await expect(records.recordMissionResult(item.id, "recall", "again", 0)).resolves.toMatchObject({ recorded: false, item: updated.item });
  });

  it("rejects malformed or unsupported imports before changing storage", async () => {
    const storage = new MemoryStorage();
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.createOrMerge({ dutch: "huis", english: "house" });
    const before = JSON.stringify(storage.values.get(LEARNING_RECORD_STORAGE_KEY));
    expect(() => parseLearningBackup('{"version":2}')).toThrow("not a supported");
    expect(() => parseLearningBackup("not json")).toThrow("not valid JSON");
    expect(() => parseLearningBackup({ format: "dutchmate-learning-backup", version: 2, exportedAt: 1, lessonProgress: {}, rhythm: {}, learningItems: [{ id: "nl\u001fhuis", learningLanguage: "nl", normalizedDutch: "huis", dutch: "huis", kind: "word", english: null, telugu: null, sources: [], contexts: [{ text: "not the saved item", addedAt: 1 }], recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1 }] })).toThrow("invalid learning item");
    expect(JSON.stringify(storage.values.get(LEARNING_RECORD_STORAGE_KEY))).toBe(before);
  });

  it("does not revive deleted or cleared records from compatibility storage", async () => {
    const storage = new MemoryStorage();
    await storage.set("dutchmate.savedVocabulary.v1", { entries: { "nl\u001fhuis\u001fen": entry("en", "house") } });
    const records = new LearningRecordStore(storage, () => 1_000);
    await records.delete("nl\u001fhuis");
    await expect(records.list()).resolves.toEqual([]);
    await records.createOrMerge({ dutch: "boom", english: "tree" });
    await records.clear();
    await expect(records.list()).resolves.toEqual([]);
  });

  it("keeps earlier appointment progress separate when a reviewed lesson has a new content version", async () => {
    const storage = new MemoryStorage();
    let now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    await records.saveLessonProgress("a1-een-afspraak-maken", 1, "notice");
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toMatchObject({ stage: "notice", completedAt: null });
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 2)).resolves.toBeUndefined();

    await records.saveLessonProgress("a1-een-afspraak-maken", 2, "read");
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toMatchObject({ stage: "notice", completedAt: null });
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 2)).resolves.toMatchObject({ stage: "read", completedAt: null });

    now = 2_000;
    const candidates = [{ id: "afspraak-maken", dutch: "een afspraak maken", kind: "chunk" as const, english: "make an appointment", telugu: "అపాయింట్‌మెంట్ తీసుకోవడం" }];
    const [kept] = await records.keepLessonCandidates("a1-een-afspraak-maken", 1, candidates, [{ dutch: "een afspraak maken", dimension: "recognition", result: "got-it" }]);
    const beforeReplay = structuredClone(kept);
    await records.keepLessonCandidates("a1-een-afspraak-maken", 1, candidates, [{ dutch: "een afspraak maken", dimension: "recognition", result: "got-it" }]);
    await expect(records.list()).resolves.toEqual([beforeReplay]);
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toMatchObject({ completedAt: 2_000, keptCandidateIds: ["afspraak-maken"] });

    await records.clear();
    await expect(records.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toBeUndefined();
  });

  it("imports newer valid lesson progress without copying catalog content", async () => {
    const local = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await local.saveLessonProgress("a1-een-afspraak-maken", 1, "read");
    const imported = await local.exportBackup();
    imported.lessonProgress = { "a1-een-afspraak-maken\u001f1": { lessonId: "a1-een-afspraak-maken", contentVersion: 1, stage: "replay", completedAt: null, keptCandidateIds: [], updatedAt: 2_000 } };
    await local.importBackup(imported);
    await expect(local.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toMatchObject({ stage: "replay", updatedAt: 2_000 });
    expect(JSON.stringify((await local.exportBackup()).lessonProgress)).not.toContain("patternExplanation");
  });

  it("keeps qualifying active days through import and removes them on clear", async () => {
    const storage = new MemoryStorage();
    let now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis" });
    await records.getDailyFive();
    await records.recordDailyFiveResult(item.id, "recognition", "got-it");
    const backup = await records.exportBackup();
    expect(backup.rhythm).toMatchObject({ activeDays: { [new Date(now).setHours(0, 0, 0, 0)]: { completedAt: now } } });

    now += 2 * 86_400_000;
    const restored = new LearningRecordStore(new MemoryStorage(), () => now);
    await restored.importBackup(backup);
    const incoming = structuredClone(backup);
    incoming.rhythm = { activeDays: { [new Date(now).setHours(0, 0, 0, 0)]: { completedAt: now } } };
    await restored.importBackup(incoming);
    expect((await restored.exportBackup()).rhythm).toMatchObject({ activeDays: expect.objectContaining({ [new Date(1_000).setHours(0, 0, 0, 0)]: expect.anything(), [new Date(now).setHours(0, 0, 0, 0)]: expect.anything() }) });
    expect(await restored.getRhythm()).toMatchObject({ week: expect.arrayContaining([expect.objectContaining({ status: "active" })]) });
    await restored.clear();
    expect(await restored.getRhythm()).toMatchObject({ milestones: [], week: expect.not.arrayContaining([expect.objectContaining({ status: "active" })]) });
  });

  it("records local review and newly saved-item counts and preserves them through backup import", async () => {
    const storage = new MemoryStorage();
    let now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis" });
    await records.getDailyFive();
    await records.recordDailyFiveResult(item.id, "recognition", "got-it");

    const day = new Date(now).setHours(0, 0, 0, 0);
    await expect(records.getRhythm()).resolves.toMatchObject({ activity: expect.arrayContaining([{ dayStartAt: day, reviews: 1, saved: 1, lessons: 0 }]) });

    const backup = await records.exportBackup();
    now += 86_400_000;
    const restored = new LearningRecordStore(new MemoryStorage(), () => now);
    await restored.importBackup(backup);
    await expect(restored.getRhythm()).resolves.toMatchObject({ activity: expect.arrayContaining([{ dayStartAt: day, reviews: 1, saved: 1, lessons: 0 }]) });
  });

  it("restores saved, reviewed, and completed-lesson history from local storage after a restart", async () => {
    const storage = new MemoryStorage();
    const now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis", english: "house" });
    await records.getDailyFive();
    await records.recordDailyFiveResult(item.id, "recognition", "got-it");
    await records.keepLessonCandidates(
      "a1-een-afspraak-maken",
      1,
      [{ id: "afspraak-maken", dutch: "een afspraak maken", kind: "chunk", english: "make an appointment", telugu: "అపాయింట్‌మెంట్ తీసుకోవడం" }],
      [{ dutch: "een afspraak maken", dimension: "recall", result: "got-it" }],
    );

    const restarted = new LearningRecordStore(storage, () => now + 10_000);
    const day = new Date(now).setHours(0, 0, 0, 0);

    await expect(restarted.getRhythm()).resolves.toMatchObject({
      activity: expect.arrayContaining([{ dayStartAt: day, reviews: 1, saved: 2, lessons: 1 }]),
    });
    await expect(restarted.getLessonProgress("a1-een-afspraak-maken", 1)).resolves.toMatchObject({ completedAt: now });
    await expect(restarted.list()).resolves.toHaveLength(2);
  });

  it("preserves partial legacy activity counts through import and a restart", async () => {
    const storage = new MemoryStorage();
    const now = 1_000;
    const day = new Date(now).setHours(0, 0, 0, 0);
    const records = new LearningRecordStore(storage, () => now);
    await records.importBackup({
      format: "dutchmate-learning-backup",
      version: 2,
      exportedAt: now,
      learningItems: [],
      lessonProgress: {},
      rhythm: { activityDays: { [day]: { reviews: 3, saved: 1, updatedAt: now } } },
    });

    const restarted = new LearningRecordStore(storage, () => now + 10_000);
    await expect(restarted.getRhythm()).resolves.toMatchObject({
      activity: expect.arrayContaining([{ dayStartAt: day, reviews: 3, saved: 1, lessons: null }]),
    });

    await restarted.keepLessonCandidates(
      "a1-een-afspraak-maken",
      1,
      [{ id: "afspraak-maken", dutch: "een afspraak maken", kind: "chunk", english: "make an appointment", telugu: "అపాయింట్‌మెంట్ తీసుకోవడం" }],
      [],
    );
    const restartedAgain = new LearningRecordStore(storage, () => now + 20_000);
    await expect(restartedAgain.getRhythm()).resolves.toMatchObject({
      activity: expect.arrayContaining([{ dayStartAt: day, reviews: 3, saved: 2, lessons: null, lessonAdditions: 1 }]),
    });
  });

  it("keeps known activity categories when merging a legacy backup in either direction", async () => {
    const now = 1_000;
    const day = new Date(now).setHours(0, 0, 0, 0);
    const legacyBackup = {
      format: "dutchmate-learning-backup" as const,
      version: 2 as const,
      exportedAt: now,
      learningItems: [],
      lessonProgress: {},
      rhythm: { activityDays: { [day]: { reviews: 3, saved: 1, updatedAt: now } } },
    };
    const completeBackup = {
      ...legacyBackup,
      rhythm: { activityDays: { [day]: { reviews: 1, saved: 1, lessons: 1, updatedAt: now } } },
    };

    const localComplete = new LearningRecordStore(new MemoryStorage(), () => now);
    await localComplete.importBackup(completeBackup);
    await localComplete.importBackup(legacyBackup);
    await expect(localComplete.getRhythm()).resolves.toMatchObject({ activity: expect.arrayContaining([{ dayStartAt: day, reviews: 3, saved: 1, lessons: 1 }]) });

    const localLegacy = new LearningRecordStore(new MemoryStorage(), () => now);
    await localLegacy.importBackup(legacyBackup);
    await localLegacy.importBackup(completeBackup);
    await expect(localLegacy.getRhythm()).resolves.toMatchObject({ activity: expect.arrayContaining([{ dayStartAt: day, reviews: 3, saved: 1, lessons: 1 }]) });
  });
});

function entry(targetLanguage: "en" | "te", translatedText: string) { return { id: `nl\u001fhuis\u001f${targetLanguage}`, text: "huis", normalizedText: "huis", sourceLanguage: "auto" as const, detectedSourceLanguage: "nl" as const, targetLanguage, translatedText, providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." }; }
function card() { return { id: "nl\u001fhuis", dutch: "huis", english: null, telugu: null, pageContext: "Een huis staat daar.", createdAt: 1_000, updatedAt: 3_000, dueAt: 5_000, lastReviewedAt: 4_000, lastRating: "good" as const, reviewCount: 2 }; }
class MemoryStorage implements SavedVocabularyStorage { readonly values = new Map<string, unknown>(); async get(key: string) { return this.values.get(key); } async set(key: string, value: unknown) { this.values.set(key, value); } }
