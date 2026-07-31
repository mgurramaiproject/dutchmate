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

    expect(backup.version).toBe(3);
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

  it("removes one saved context while preserving the canonical item and safe empty state", async () => {
    const storage = new MemoryStorage();
    let now = 1_000;
    const records = new LearningRecordStore(storage, () => now);
    const item = await records.createOrMerge({ dutch: "huis", english: "house", context: "Huis staat hier.", contextSourceLanguage: "nl", contextSourceText: "huis" });
    now = 2_000;
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "house" });
    const before = (await records.list())[0];
    await records.recordMissionResult(item.id, "recognition", "got-it", 0);

    const removed = await records.removeContext(item.id, before.contexts.find((context) => context.sourceLanguage === "en")!);

    expect(removed).toMatchObject({ id: item.id, dutch: "huis", contexts: [{ text: "Huis staat hier.", sourceLanguage: "nl" }], recognition: { attemptCount: 1 } });
    expect(removed?.sources).toEqual(item.sources);
    const empty = await records.removeContext(item.id, removed!.contexts[0]);
    expect(empty).toMatchObject({ id: item.id, dutch: "huis", contexts: [], recognition: { attemptCount: 1 } });
    await expect(records.list()).resolves.toEqual([empty]);
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
    expect(await records.getRhythm()).toMatchObject({ activity: [expect.objectContaining({ reviews: 1 })] });
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
    const rhythm = await records.getRhythm();
    expect(rhythm.activity.some((day) => day.lessons === 2)).toBe(true);

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

  it("keeps source-aware contexts distinct and fills only missing helpers", async () => {
    const records = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "house", contextTranslations: { telugu: "ఇక్కడ ఒక ఇల్లు ఉంది." } });
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "house", contextTranslations: { english: "A different English rendering", telugu: "ఇంకొక అనువాదం" } });
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "te", contextTranslations: { telugu: "An unrelated Telugu rendering" } });

    await expect(records.list()).resolves.toEqual([expect.objectContaining({ contexts: [
      { text: "An English house stands here.", addedAt: 1_000, sourceLanguage: "en", telugu: "ఇక్కడ ఒక ఇల్లు ఉంది.", english: "A different English rendering" },
      { text: "An English house stands here.", addedAt: 1_000, sourceLanguage: "te", telugu: "An unrelated Telugu rendering" },
    ] })]);
  });

  it("validates known contexts against the selected source form and preserves legacy validity", async () => {
    const records = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "apartment" });
    await records.createOrMerge({ dutch: "huis", context: "An English house stands here.", contextSourceLanguage: "en", contextSourceText: "house" });
    await records.createOrMerge({ dutch: "huis", context: "Huis staat hier.", contextSourceLanguage: "nl", contextSourceText: "huis" });

    await expect(records.list()).resolves.toEqual([expect.objectContaining({ contexts: [
      { text: "An English house stands here.", addedAt: 1_000, sourceLanguage: "en" },
      { text: "Huis staat hier.", addedAt: 1_000, sourceLanguage: "nl" },
    ] })]);
  });

  it("keeps legacy and known-provenance copies separate and records encounter provenance without helpers", async () => {
    const records = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    const item = await records.createOrMerge({ dutch: "huis", context: "Huis staat hier." });
    await records.createOrMerge({ dutch: "huis", context: "Huis staat hier.", contextSourceLanguage: "nl", contextSourceText: "huis" });
    await records.recordEncounter(item.id, "An English house stands here.", "en");

    await expect(records.list()).resolves.toEqual([expect.objectContaining({ contexts: [
      { text: "Huis staat hier.", addedAt: 1_000 },
      { text: "Huis staat hier.", addedAt: 1_000, sourceLanguage: "nl" },
      { text: "An English house stands here.", addedAt: 1_000, sourceLanguage: "en" },
    ], encounters: { count: 1, lastEncounterAt: 1_000 } })]);
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

  it("exports and restores grammar evidence plus the mixed Daily Five snapshot", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const source = new LearningRecordStore(new MemoryStorage(), () => now);
    await source.introduceGrammar();
    await source.recordGrammarCheck("a0-zijn-present", 1, "zijn-choose-ik", "ben", 0);
    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await source.getDailyFive();
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-zijn-present", contentVersion: 1, exerciseId: "zijn-change-jij" }]);
    const backup = await source.exportBackup();
    expect(backup).toMatchObject({ version: 3, grammar: { "a0-zijn-present": { successfulEvidenceCount: 1 } }, rhythm: { dailyFive: snapshot } });

    const restored = new LearningRecordStore(new MemoryStorage(), () => now);
    await restored.importBackup(backup);
    await expect(restored.getGrammar()).resolves.toMatchObject({ successfulEvidenceCount: 1, misconceptionCounts: {} });
    await expect(restored.getDailyFive()).resolves.toEqual(snapshot);
  });

  it("imports version 2 without grammar and merges compatible grammar summaries conservatively", async () => {
    const source = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await source.introduceGrammar();
    const backup = await source.exportBackup();
    const legacy = { ...backup, version: 2 as const, grammar: undefined };
    const restored = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await restored.importBackup(legacy);
    await expect(restored.getGrammar()).resolves.toBeNull();
    await restored.importBackup(backup);
    await expect(restored.getGrammar()).resolves.toMatchObject({ state: "introduced", dueAt: backup.grammar["a0-zijn-present"].dueAt });
  });

  it("resumes and completes a grammar position in the persisted mixed snapshot", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar();
    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    const result = await records.recordGrammarDailyFiveResult({ patternId: "a0-zijn-present", contentVersion: 1, exerciseId: "zijn-choose-ik", outcome: { type: "check", answer: "ben" }, expectedEvidenceRevision: 0 });
    expect(result.snapshot.completedTaskIds).toEqual(["a0-zijn-present\u001fzijn-choose-ik"]);
    await expect(records.getDailyFive()).resolves.toEqual(result.snapshot);
    expect(JSON.stringify(snapshot)).not.toContain("bent");
  });

  it("keeps mixed Daily Five bounded while protecting vocabulary and grammar targets", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    for (const dutch of ["een", "twee", "drie", "vier"]) await records.createOrMerge({ dutch });
    await records.introduceGrammar("a0-zijn-present");
    await records.introduceGrammar("a0-hebben-present");

    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    const grammarTasks = snapshot.tasks.filter((task): task is Extract<(typeof snapshot.tasks)[number], { kind: "grammar" }> => "kind" in task && task.kind === "grammar");
    const vocabularyTasks = snapshot.tasks.filter((task) => !("kind" in task));

    expect(snapshot.tasks).toHaveLength(5);
    expect(grammarTasks).toHaveLength(2);
    expect(vocabularyTasks).toHaveLength(3);
    expect(new Set(grammarTasks.map((task) => `${task.patternId}\u001f${task.exerciseId}`)).size).toBe(grammarTasks.length);
  });

  it("does not apply duplicate or stale grammar Daily Five submissions twice", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar();
    now = new Date(2026, 0, 2, 9).getTime();
    await records.getDailyFive();
    const input = { patternId: "a0-zijn-present" as const, contentVersion: 1 as const, exerciseId: "zijn-choose-ik", outcome: { type: "check" as const, answer: "ben" }, expectedEvidenceRevision: 0 };

    const first = await records.recordGrammarDailyFiveResult(input);
    const duplicate = await records.recordGrammarDailyFiveResult(input);
    const stale = await records.recordGrammarCheck("a0-zijn-present", 1, "zijn-change-jij", "bent", 0);

    expect(duplicate).toEqual(first);
    expect(stale).toMatchObject({ recorded: false, grammar: { evidenceRevision: 1, successfulEvidenceCount: 1 } });
    expect((await records.exportBackup()).grammar["a0-zijn-present"]).toMatchObject({ evidenceRevision: 1, successfulEvidenceCount: 1 });
  });

  it("keeps Daily Five Reveal unscored and idempotent", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar();
    now = new Date(2026, 0, 2, 9).getTime();
    await records.getDailyFive();
    const input = { patternId: "a0-zijn-present" as const, contentVersion: 1 as const, exerciseId: "zijn-choose-ik", outcome: { type: "reveal" as const }, expectedEvidenceRevision: 0 };

    const first = await records.recordGrammarDailyFiveResult(input);
    const duplicate = await records.recordGrammarDailyFiveResult({ ...input, outcome: { type: "skip" } });

    expect(first.grammar).toMatchObject({ evidenceRevision: 1, successfulEvidenceCount: 0, delayedEvidence: false });
    expect(first.snapshot.completedTaskIds).toEqual(["a0-zijn-present\u001fzijn-choose-ik"]);
    expect(duplicate).toEqual(first);
  });

  it("introduces, schedules, and persists the hebben pattern independently", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar("a0-hebben-present");
    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik" }]);
    const result = await records.recordGrammarDailyFiveResult({ patternId: "a0-hebben-present", contentVersion: 1, exerciseId: "hebben-choose-ik", outcome: { type: "check", answer: "heb" }, expectedEvidenceRevision: 0 });
    expect(result.grammar.patternId).toBe("a0-hebben-present");
    expect(result.snapshot.completedTaskIds).toEqual(["a0-hebben-present\u001fhebben-choose-ik"]);
    const backup = await records.exportBackup();
    expect(backup.grammar).toHaveProperty("a0-hebben-present");
    const restored = new LearningRecordStore(new MemoryStorage(), () => now);
    await restored.importBackup(backup);
    await expect(restored.getGrammar("a0-hebben-present")).resolves.toMatchObject({ patternId: "a0-hebben-present", successfulEvidenceCount: 1 });
  });

  it("introduces, schedules, and persists the regular-present pattern independently", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar("a0-regular-present");
    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-regular-present", contentVersion: 1, exerciseId: "regular-choose-ik" }]);
    const result = await records.recordGrammarDailyFiveResult({ patternId: "a0-regular-present", contentVersion: 1, exerciseId: "regular-choose-ik", outcome: { type: "check", answer: "woon" }, expectedEvidenceRevision: 0 });
    expect(result.grammar.patternId).toBe("a0-regular-present");
    const backup = await records.exportBackup();
    expect(backup.grammar).toHaveProperty("a0-regular-present");
  });

  it("introduces, schedules, and persists the inversion pattern independently", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceGrammar("a0-yes-no-inversion");
    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    expect(snapshot.tasks).toEqual([{ kind: "grammar", patternId: "a0-yes-no-inversion", contentVersion: 1, exerciseId: "inversion-order-je" }]);
    const result = await records.recordGrammarDailyFiveResult({ patternId: "a0-yes-no-inversion", contentVersion: 1, exerciseId: "inversion-order-je", outcome: { type: "check", answer: "Woon je hier?" }, expectedEvidenceRevision: 0 });
    expect(result.grammar).toMatchObject({ patternId: "a0-yes-no-inversion", successfulEvidenceCount: 1, primitives: ["order-tokens"] });
    expect(JSON.stringify(result.grammar)).not.toContain("Woon je hier?");
    expect((await records.exportBackup()).grammar).toHaveProperty("a0-yes-no-inversion");
  });

  it("introduces and persists the contrast pilot without changing grammar pattern records", async () => {
    const records = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    const introduced = await records.introduceContrast();
    expect(introduced).toMatchObject({ packId: "contrast.main_clause_inversion", state: "introduced", evidenceRevision: 0 });
    const result = await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "werk", 0);
    expect(result).toMatchObject({ contrast: { packId: "contrast.main_clause_inversion", evidenceRevision: 1, successfulExerciseIds: ["contrast-choose-time-first"] }, recorded: true });
    expect(await records.getGrammar("a0-yes-no-inversion")).toBeNull();
    const backup = await records.exportBackup();
    expect(backup.contrast).toHaveProperty("contrast.main_clause_inversion");
    const restored = new LearningRecordStore(new MemoryStorage(), () => 2_000);
    await restored.importBackup(backup);
    await expect(restored.getContrast()).resolves.toMatchObject({ successfulExerciseIds: ["contrast-choose-time-first"] });
  });

  it("records only the supported misconception and returns one immediate repair offer", async () => {
    const records = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await records.introduceContrast();
    const first = await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "ik werk", 0, undefined, "MAIN_CLAUSE_NO_INVERSION");
    expect(first.repairOffer).toMatchObject({ code: "MAIN_CLAUSE_NO_INVERSION", packId: "contrast.main_clause_inversion", label: "Practise this contrast (1 min)" });
    expect(first.contrast).toMatchObject({ misconceptionCounts: { MAIN_CLAUSE_NO_INVERSION: 1 } });
    expect(JSON.stringify(await records.exportBackup())).not.toContain("ik werk");

    const second = await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "ik werk", 1);
    expect(second.repairOffer).toBeNull();
    expect(second.contrast.misconceptionCounts).toEqual({ MAIN_CLAUSE_NO_INVERSION: 2 });
    await expect(records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "ik werk", 2, undefined, "UNKNOWN_CODE" as never)).rejects.toThrow("unavailable");
  });

  it("schedules one delayed contrast repair in the mixed Daily Five and clears it only on success", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceContrast();
    await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "ik werk", 0, undefined, "MAIN_CLAUSE_NO_INVERSION");
    await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-repair-time-first", "Morgen ik werk thuis.", 1, undefined, "MAIN_CLAUSE_NO_INVERSION");

    now = new Date(2026, 0, 2, 9).getTime();
    const snapshot = await records.getDailyFive();
    expect(snapshot.tasks).toEqual([{ kind: "contrast", packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment" }]);
    expect(JSON.stringify(snapshot)).not.toContain("Morgen maak ik een afspraak.");

    const skipped = await records.recordContrastDailyFiveResult({ packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", outcome: { type: "skip" }, expectedEvidenceRevision: 2 });
    expect(skipped.contrast).toMatchObject({ repair: { pending: true }, evidenceRevision: 3 });
    expect((await records.recordContrastDailyFiveResult({ packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", outcome: { type: "check", answer: "Morgen maak ik een afspraak." }, expectedEvidenceRevision: 2 })).contrast).toEqual(skipped.contrast);

    now = new Date(2026, 0, 4, 9).getTime();
    const next = await records.getDailyFive();
    expect(next.tasks).toEqual([]);
  });

  it("clears the pending delayed trigger after a successful Daily Five repair", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const records = new LearningRecordStore(new MemoryStorage(), () => now);
    await records.introduceContrast();
    await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-choose-time-first", "ik werk", 0, undefined, "MAIN_CLAUSE_NO_INVERSION");
    await records.recordContrastCheck("contrast.main_clause_inversion", 1, "contrast-repair-time-first", "Morgen ik werk thuis.", 1, undefined, "MAIN_CLAUSE_NO_INVERSION");
    now = new Date(2026, 0, 2, 9).getTime();
    await records.getDailyFive();
    const result = await records.recordContrastDailyFiveResult({ packId: "contrast.main_clause_inversion", contentVersion: 1, exerciseId: "contrast-rebuild-appointment", outcome: { type: "check", answer: "Morgen maak ik een afspraak." }, expectedEvidenceRevision: 2 });
    expect(result.contrast).toMatchObject({ repair: { pending: false, recentRelevantCodes: [] }, successfulExerciseIds: ["contrast-rebuild-appointment"], evidenceRevision: 3 });
  });

  it("preserves all published lesson progress and saved-item mastery through version 3 round trip", async () => {
    const source = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await source.createOrMerge({ dutch: "huis", english: "house" });
    const item = (await source.list())[0];
    await source.recordMissionResult(item.id, "recognition", "got-it", 0);
    for (const lessonId of ["a0-hallo-ik-ben", "a1-kunt-u-dat-herhalen", "a1-ik-wil-graag-bestellen", "a1-kan-ik-met-pin-betalen", "a1-waar-moet-ik-overstappen", "a1-mijn-trein-is-vertraagd", "a1-een-afspraak-maken", "a1-ik-heb-last-van", "a1-er-is-iets-kapot", "a1-ik-ben-beschikbaar-op", "a1-wat-moet-ik-meenemen", "a2-wat-staat-er-in-deze-brief"]) await source.saveLessonProgress(lessonId, 1, "replay");
    const backup = await source.exportBackup();
    const restored = new LearningRecordStore(new MemoryStorage(), () => 2_000);
    await restored.importBackup(backup);
    await expect(restored.list()).resolves.toEqual([expect.objectContaining({ dutch: "huis", recognition: expect.objectContaining({ attemptCount: 1 }) })]);
    const progress = await Promise.all(["a0-hallo-ik-ben", "a1-kunt-u-dat-herhalen", "a1-ik-wil-graag-bestellen", "a1-kan-ik-met-pin-betalen", "a1-waar-moet-ik-overstappen", "a1-mijn-trein-is-vertraagd", "a1-een-afspraak-maken", "a1-ik-heb-last-van", "a1-er-is-iets-kapot", "a1-ik-ben-beschikbaar-op", "a1-wat-moet-ik-meenemen", "a2-wat-staat-er-in-deze-brief"].map((lessonId) => restored.getLessonProgress(lessonId, 1)));
    expect(progress.every((entry) => entry?.stage === "replay")).toBe(true);
  });

  it("awards Applied only when merged summaries prove four distinct exercises", async () => {
    let now = new Date(2026, 0, 1, 9).getTime();
    const first = new LearningRecordStore(new MemoryStorage(), () => now);
    await first.introduceGrammar();
    await first.recordGrammarCheck("a0-zijn-present", 1, "zijn-choose-ik", "ben", 0);
    now = new Date(2026, 0, 3, 9).getTime();
    await first.recordGrammarCheck("a0-zijn-present", 1, "zijn-change-jij", "bent", 1);
    now = new Date(2026, 0, 1, 9).getTime();
    const second = new LearningRecordStore(new MemoryStorage(), () => now);
    await second.introduceGrammar();
    await second.recordGrammarCheck("a0-zijn-present", 1, "zijn-contrast-u", "bent", 0);
    now = new Date(2026, 0, 3, 9).getTime();
    await second.recordGrammarCheck("a0-zijn-present", 1, "zijn-repair-zij", "is", 1);

    const restored = new LearningRecordStore(new MemoryStorage(), () => now);
    await restored.importBackup(await first.exportBackup());
    await restored.importBackup(await second.exportBackup());
    await expect(restored.getGrammar()).resolves.toMatchObject({ state: "applied", successfulEvidenceCount: 4, successfulExerciseIds: ["zijn-choose-ik", "zijn-change-jij", "zijn-contrast-u", "zijn-repair-zij"] });
  });

  it("rejects a version 3 grammar record that omits durable distinct-evidence identities", async () => {
    const source = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    await source.introduceGrammar();
    const invalid = await source.exportBackup();
    delete (invalid.grammar["a0-zijn-present"] as unknown as Record<string, unknown>).successfulExerciseIds;
    expect(() => parseLearningBackup(invalid)).toThrow("invalid grammar evidence");
  });

  it("records additive verb journey evidence, rejects stale writes, and restores it through backup", async () => {
    const source = new LearningRecordStore(new MemoryStorage(), () => 1_000);
    const input = { verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", contentVersion: "015-1" as const, exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning", result: "correct" as const, expectedEvidenceRevision: 0 };
    await expect(source.recordVerbJourneyResult(input)).resolves.toMatchObject({ recorded: true, verbJourneys: { evidenceRevision: 1 } });
    await expect(source.recordVerbJourneyResult(input)).resolves.toMatchObject({ recorded: false, verbJourneys: { evidenceRevision: 1 } });
    const backup = await source.exportBackup();
    expect(backup.verbJourneys.skills["verb.werken\u001fskill.werken.vtt-completed"].exerciseFamilies.meaning.id).toBe("verb.werken\u001fskill.werken.vtt-completed\u001fmeaning");
    const restored = new LearningRecordStore(new MemoryStorage(), () => 2_000);
    await restored.importBackup(backup);
    await expect(restored.getVerbJourneyRecord()).resolves.toEqual(backup.verbJourneys);
  });
});

function entry(targetLanguage: "en" | "te", translatedText: string) { return { id: `nl\u001fhuis\u001f${targetLanguage}`, text: "huis", normalizedText: "huis", sourceLanguage: "auto" as const, detectedSourceLanguage: "nl" as const, targetLanguage, translatedText, providerName: "test", createdAt: 1_000, updatedAt: 2_000, pageContext: "Een huis staat daar." }; }
function card() { return { id: "nl\u001fhuis", dutch: "huis", english: null, telugu: null, pageContext: "Een huis staat daar.", createdAt: 1_000, updatedAt: 3_000, dueAt: 5_000, lastReviewedAt: 4_000, lastRating: "good" as const, reviewCount: 2 }; }
class MemoryStorage implements SavedVocabularyStorage { readonly values = new Map<string, unknown>(); async get(key: string) { return this.values.get(key); } async set(key: string, value: unknown) { this.values.set(key, value); } }
