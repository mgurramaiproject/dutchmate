import { describe, expect, it, vi } from "vitest";
import { WebpageLookupModule, type TranslationTransport } from "./webpage-lookup-module";
import type { LearningItem } from "../vocabulary/learning-record";
import type { ExtensionSettings } from "../shared/settings";
import type { GrammarRecord } from "../grammar/learning";

const defaultSettings = {
  isEnabled: true,
  translateOnHover: true,
  translateOnSelection: true,
  cacheHoveredWords: true,
  cacheSelectedWords: true,
  hoverTranslationMode: "word",
  hoverDelayMs: 450,
  maxSelectionLength: 150,
  sourceLanguage: "auto",
  targetLanguage: "en",
  translateToOtherMvpLanguages: true,
  learningLanguage: "nl",
  nativeLanguage: "te",
  bridgeLanguage: "en",
  autoSaveSelectedWords: false,
  showExampleSentence: true,
  dailyReviewBadge: true,
  providerEndpoint: "https://example.test/translate",
  providerApiKey: "",
} as const;

function createTransport(
  overrides: Partial<TranslationTransport> = {},
): TranslationTransport {
  return {
    translate: async ({ text, targetLanguage }) => ({
      ok: true,
      result: {
        translatedText: `${text}-${targetLanguage}`,
        providerName: "custom-endpoint",
      },
    }),
    listLearningItemIds: async () => new Set<string>(),
    saveLearningItem: async () => ({ ok: true }),
    ...overrides,
  };
}

function savedItem(overrides: Partial<LearningItem> = {}): LearningItem {
  return {
    id: "nl\u001fgoede morgen", learningLanguage: "nl", normalizedDutch: "goede morgen", dutch: "goede morgen", kind: "chunk", english: "good morning", telugu: "శుభోదయం", sources: [], contexts: [{ text: "Goede morgen, buur.", addedAt: 1 }], encounters: { count: 0, lastEncounterAt: null }, recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1, ...overrides,
  };
}

describe("WebpageLookupModule", () => {
  it("offers an introduced exact hebben encounter without another provider request", async () => {
    const events: unknown[] = [];
    const grammar: GrammarRecord = { patternId: "a0-hebben-present", contentVersion: 1, state: "introduced", introducedAt: 1, lastPractisedAt: null, dueAt: 2, intervalDays: 0, successfulEvidenceCount: 0, successfulExerciseIds: [], primitives: [], contextTags: [], recentExerciseIds: [], recentSuccessfulDays: [], delayedEvidence: false, misconceptionCounts: {}, evidenceRevision: 0, updatedAt: 1 };
    const translate = vi.fn(createTransport().translate);
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ translate, getGrammar: async (patternId) => ({ ok: true, result: { grammar: patternId === "a0-hebben-present" ? grammar : null } }) }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "u heeft", context: "hover", x: 1, y: 1, sourceLanguageHint: "nl" });

    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", grammarEncounter: { patternId: "a0-hebben-present", subject: "u", form: "heeft" } }));
    const translationCalls = translate.mock.calls.length;
    expect(translationCalls).toBeGreaterThan(0);
    module.startGrammarPractice();
    expect(translate).toHaveBeenCalledTimes(translationCalls);
    expect(events).toContainEqual({ type: "render-grammar-encounter", encounter: { patternId: "a0-hebben-present", subject: "u", form: "heeft" } });
  });

  it("offers a saved selection locally before contacting the translation provider", async () => {
    const translate = vi.fn(createTransport().translate);
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem()] } }),
        translate,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "Goede   morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });

    expect(events).toContainEqual({ type: "render-recall-offer", selectedDutch: "goede morgen", pageContext: "Goede morgen, buur.", x: 1, y: 1 });
    expect(translate).not.toHaveBeenCalled();
    module.translateNow();
    await vi.waitFor(() => expect(translate).toHaveBeenCalled());
  });

  it("offers a saved repeat using the current page context when an older item has none stored", async () => {
    const translate = vi.fn(createTransport().translate);
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ contexts: [] })] } }), translate }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });

    expect(events).toContainEqual(expect.objectContaining({ type: "render-recall-offer", pageContext: "Goede morgen, buur." }));
    expect(translate).not.toHaveBeenCalled();
  });

  it("reveals stored helpers and records recognition once after recall", async () => {
    const recordMissionResult = vi.fn(async () => ({ ok: true }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ listLearningItems: async () => ({ ok: true, result: { items: [savedItem()] } }), recordMissionResult }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    module.startRecallMission();
    expect(events.at(-1)).toEqual(expect.objectContaining({ type: "render-recall-mission", mission: expect.objectContaining({ revealed: false, english: "good morning", telugu: "శుభోదయం" }) }));
    await module.recordRecallResult("got-it");
    expect(recordMissionResult).not.toHaveBeenCalled();
    module.revealRecallMeaning();
    await module.recordRecallResult("got-it");
    await module.recordRecallResult("again");
    expect(recordMissionResult).toHaveBeenCalledTimes(1);
    expect(recordMissionResult).toHaveBeenCalledWith({ itemId: "nl\u001fgoede morgen", dimension: "recognition", result: "got-it", expectedAttemptCount: 0 });
  });

  it("rebuilds a saved repeat for recall and records only its first result", async () => {
    const translate = vi.fn(createTransport().translate);
    const recordMissionResult = vi.fn(async () => ({ ok: true }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        translate,
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ recognition: { state: "familiar", dueAt: 20, intervalDays: 3, attemptCount: 2, successfulStreak: 2, lastPractisedAt: 1 }, recall: { state: "learning", dueAt: 10, intervalDays: 1, attemptCount: 1, successfulStreak: 1, lastPractisedAt: 1 } })] } }),
        recordMissionResult,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    module.startRecallMission();
    expect(events.at(-1)).toEqual(expect.objectContaining({ type: "render-mission", mission: expect.objectContaining({ selectedDutch: "goede morgen", evidence: expect.objectContaining({ dimension: "recall", expectedAttemptCount: 1 }) }) }));
    expect(translate).not.toHaveBeenCalled();
    module.addMissionFragment(1);
    module.addMissionFragment(0);
    module.checkMission();
    module.checkMission();
    await vi.waitFor(() => expect(recordMissionResult).toHaveBeenCalledTimes(1));
    expect(recordMissionResult).toHaveBeenCalledWith({ itemId: "nl\u001fgoede morgen", dimension: "recall", result: "got-it", expectedAttemptCount: 1 });
    module.replayMission();
    module.addMissionFragment(1);
    module.addMissionFragment(0);
    module.checkMission();
    expect(recordMissionResult).toHaveBeenCalledTimes(1);
  });

  it("invalidates an in-flight recall result when the mission closes or selection translation is disabled", async () => {
    let settings: ExtensionSettings = defaultSettings;
    let resolveResult: ((value: { ok: boolean }) => void) | undefined;
    const recordMissionResult = vi.fn(() => new Promise<{ ok: boolean }>((resolve) => { resolveResult = resolve; }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => settings,
      transport: createTransport({
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ recognition: { state: "familiar", dueAt: 20, intervalDays: 3, attemptCount: 2, successfulStreak: 2, lastPractisedAt: 1 }, recall: { state: "learning", dueAt: 10, intervalDays: 1, attemptCount: 1, successfulStreak: 1, lastPractisedAt: 1 } })] } }),
        recordMissionResult,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    module.startRecallMission();
    module.addMissionFragment(1);
    module.addMissionFragment(0);
    module.checkMission();
    expect(recordMissionResult).toHaveBeenCalledOnce();
    module.clear();
    resolveResult?.({ ok: true });
    await Promise.resolve();
    expect(events.at(-1)).toEqual({ type: "hide-tooltip" });

    settings = { ...defaultSettings, translateOnSelection: false };
    module.applySettings();
    expect(events.at(-1)).toEqual({ type: "hide-tooltip" });
  });

  it("falls back to normal translation when saved recall data is incomplete", async () => {
    const translate = vi.fn(createTransport().translate);
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ translate, listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ english: null, telugu: null })] } }) }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    expect(translate).toHaveBeenCalled();
  });

  it("keeps a failed recognition save recoverable without showing false success", async () => {
    let failed = false;
    const recordMissionResult = vi.fn(async () => failed ? { ok: true } : (failed = true, { ok: false, error: "Storage unavailable" }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ listLearningItems: async () => ({ ok: true, result: { items: [savedItem()] } }), recordMissionResult }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    module.startRecallMission(); module.revealRecallMeaning();
    await module.recordRecallResult("got-it");
    expect(events.at(-1)).toEqual(expect.objectContaining({ type: "render-recall-mission", mission: expect.objectContaining({ error: "Storage unavailable", evidenceRecorded: false }) }));
    await module.recordRecallResult("got-it");
    expect(events.at(-1)).toEqual(expect.objectContaining({ type: "render-recall-mission", mission: expect.objectContaining({ result: "got-it", evidenceRecorded: true }) }));
  });

  it("does not record encounters for passive or unsaved text", async () => {
    const recordLearningEncounter = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ listLearningItems: async () => ({ ok: true, result: { items: [] } }), recordLearningEncounter }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    expect(recordLearningEncounter).not.toHaveBeenCalled();
    await module.beginLookup({ text: "onbekend", context: "hover", x: 1, y: 1, pageContext: "Een onbekend woord." });
    expect(recordLearningEncounter).not.toHaveBeenCalled();
  });

  it("does not record encounters when the deliberate translation fails", async () => {
    const recordLearningEncounter = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        translate: async () => ({ ok: false, error: "Translation failed." }),
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ id: "nl\u001fhuis", normalizedDutch: "huis", dutch: "huis" })] } }),
        recordLearningEncounter,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text: "huis", context: "hover", x: 1, y: 1, pageContext: "Een huis staat daar." });
    expect(recordLearningEncounter).not.toHaveBeenCalled();
  });

  it.each([
    ["nl", "huis", "en"],
    ["en", "house", "nl"],
    ["te", "నమస్కారం", "nl"],
  ] as const)("keeps one-target hover translation useful for %s without self-translation", async (sourceLanguage, text, targetLanguage) => {
    const translate = vi.fn(createTransport().translate);
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, sourceLanguage, targetLanguage, translateToOtherMvpLanguages: false }),
      transport: createTransport({ translate }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text, context: "hover", x: 1, y: 1 });

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ text, sourceLanguage, targetLanguage }));
    expect(translate).not.toHaveBeenCalledWith(expect.objectContaining({ sourceLanguage, targetLanguage: sourceLanguage }));
  });

  it("renders useful Dutch and English Telugu hover targets without Telugu self-translation", async () => {
    const translate = vi.fn(createTransport().translate);
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ translate }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "నమస్కారం", context: "hover", x: 1, y: 1 });

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ sourceLanguage: "te", targetLanguage: "nl" }));
    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ sourceLanguage: "te", targetLanguage: "en" }));
    expect(translate).not.toHaveBeenCalledWith(expect.objectContaining({ sourceLanguage: "te", targetLanguage: "te" }));
    expect(events).toContainEqual(expect.objectContaining({
      type: "render-result",
      response: expect.objectContaining({ ok: true, result: { translatedText: "Dutch: నమస్కారం-nl\nEnglish: నమస్కారం-en", providerName: "multi-target" } }),
    }));
  });

  it("keeps successful popup targets visible when an optional target fails", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        translate: async ({ targetLanguage }) => targetLanguage === "te"
          ? { ok: false, error: "Telugu unavailable" }
          : { ok: true, result: { translatedText: "huis-en", providerName: "custom-endpoint" } },
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "huis", context: "hover", x: 1, y: 1, sourceLanguageHint: "nl" });

    expect(events).toContainEqual(expect.objectContaining({
      type: "render-result",
      response: { ok: true, result: { translatedText: "English: huis-en\nTelugu: Unavailable", providerName: "multi-target" } },
    }));
    expect(events).not.toContainEqual(expect.objectContaining({ type: "render-error" }));
  });

  it.each([
    ["nl", "goede morgen"],
    ["en", "good morning"],
    ["te", "శుభోదయం"],
  ] as const)("shows Seen before for one unique saved %s form without page context", async (sourceLanguage, text) => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ english: "good morning", telugu: "శుభోదయం" })] } }),
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text, context: "hover", x: 1, y: 1, sourceLanguageHint: sourceLanguage });
    await vi.waitFor(() => expect(events).toContainEqual({ type: "show-seen-before" }));
  });

  it("records source-aware bounded hover context while keeping Seen before truthful when persistence fails", async () => {
    const recordLearningEncounter = vi.fn(async () => { throw new Error("Storage unavailable"); });
    const events: unknown[] = [];
    const context = "A house stands here.";
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        listLearningItems: async () => ({ ok: true, result: { items: [savedItem({ english: "house" })] } }),
        recordLearningEncounter,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "house", context: "hover", x: 1, y: 1, sourceLanguageHint: "en", pageContext: context });
    await vi.waitFor(() => expect(events).toContainEqual({ type: "show-seen-before" }));
    expect(recordLearningEncounter).toHaveBeenCalledWith({ id: "nl\u001fgoede morgen", context, sourceLanguage: "en" });
  });

  it("does not show Seen before when a helper form matches multiple saved items", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        listLearningItems: async () => ({ ok: true, result: { items: [
          savedItem({ english: "house" }),
          savedItem({ id: "nl\u001fwoning", normalizedDutch: "woning", dutch: "woning", english: "house" }),
        ] } }),
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "house", context: "hover", x: 1, y: 1, sourceLanguageHint: "en" });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(events).not.toContainEqual({ type: "show-seen-before" });
  });

  it("records a saved word but ignores an interaction cleared before lookup completes", async () => {
    const recordLearningEncounter = vi.fn(async () => ({ ok: true }));
    let resolveItems: ((value: { ok: true; result: { items: LearningItem[] } }) => void) | undefined;
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        listLearningItems: () => new Promise((resolve) => { resolveItems = resolve; }),
        recordLearningEncounter,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text: "huis", context: "hover", x: 1, y: 1, pageContext: "Een huis staat daar." });
    module.clear();
    resolveItems?.({ ok: true, result: { items: [savedItem({ id: "nl\u001fhuis", normalizedDutch: "huis", dutch: "huis" })] } });

    await Promise.resolve();
    expect(recordLearningEncounter).not.toHaveBeenCalled();
  });

  it("emits loading then result with save action for a selected single-word lookup", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });

    expect(events).toContainEqual({
      type: "render-loading",
      context: "selection",
      x: 10,
      y: 20,
      message: "Translating...",
    });
    expect(events).toContainEqual({
      type: "render-result",
      context: "selection",
      x: 10,
      y: 20,
      response: {
        ok: true,
        result: {
          translatedText: "English: huis-en\nTelugu: huis-te",
          providerName: "multi-target",
        },
      },
      saveAction: {
        status: "checking",
        label: "Checking...",
        disabled: true,
      },
    });
  });

  it("drops save action for hover lookups", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "hover",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });

    expect(events).toContainEqual({
      type: "render-result",
      context: "hover",
      x: 10,
      y: 20,
      response: {
        ok: true,
        result: {
          translatedText: "English: huis-en\nTelugu: huis-te",
          providerName: "multi-target",
        },
      },
      saveAction: {
        status: "hidden",
      },
    });
  });

  it("reuses a successful Dutch selection for one ephemeral reconstruction without more translation or learning calls", async () => {
    const translate = vi.fn(createTransport().translate);
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ translate, saveLearningItem }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "houd rekening met", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Bekijk en houd rekening met de tijd." });
    const callsAfterTranslation = translate.mock.calls.length;
    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", practiceAvailable: true }));

    module.startPractice();
    let mission = events.at(-1);
    expect(mission).toEqual(expect.objectContaining({ type: "render-mission", mission: expect.objectContaining({ selectedDutch: "houd rekening met", placed: [] }) }));
    module.addMissionFragment(2);
    module.addMissionFragment(0);
    module.addMissionFragment(0);
    module.checkMission();

    mission = events.at(-1);
    expect(mission).toEqual(expect.objectContaining({ type: "render-mission", mission: expect.objectContaining({ result: "got-it" }) }));
    expect(translate).toHaveBeenCalledTimes(callsAfterTranslation);
    expect(saveLearningItem).not.toHaveBeenCalled();
  });

  it("offers practice for a headline selection when layout whitespace splits a hyphenated Dutch word", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport(), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({
      text: "Gasprijs stijgt na oplaaiende geweld in Midden-\nOosten",
      context: "selection",
      x: 1,
      y: 1,
      sourceLanguageHint: "nl",
      pageContext: "Gasprijs stijgt na oplaaiende geweld in Midden-Oosten",
    });

    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", practiceAvailable: true }));
    module.startPractice();
    expect(events.at(-1)).toEqual(expect.objectContaining({ type: "render-mission", mission: expect.objectContaining({ selectedDutch: "Gasprijs stijgt na oplaaiende geweld in Midden-Oosten" }) }));
  });

  it.each([
    ["hover", "houd rekening met", "nl"],
    ["selection", "een", "nl"],
    ["selection", "one two", "en"],
  ] as const)("does not offer practice for %s %s", async (context, text, sourceLanguageHint) => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport(), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text, context, x: 1, y: 1, sourceLanguageHint });
    expect(events.some((event) => "practiceAvailable" in (event as object))).toBe(false);
  });

  it("updates save state after a successful save", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport(),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    module.subscribe((event) => {
      events.push(event);
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });
    await module.handleSaveAction();

    expect(events).toContainEqual({
      type: "save-state-changed",
      saveAction: {
        status: "saving",
        label: "Saving...",
        disabled: true,
      },
    });
    expect(events).toContainEqual({
      type: "save-state-changed",
      saveAction: {
        status: "saved",
        label: "Saved",
        disabled: true,
      },
    });
  });

  it("requires an explicit action before saving a selected meaningful chunk", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ saveLearningItem }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, languageSample: "goede morgen", sourceLanguageHint: "nl", pageContext: "Goede morgen, buur." });
    expect(saveLearningItem).not.toHaveBeenCalled();
    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", saveAction: { status: "ready", label: "Review & save", disabled: false } }));
    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", chunkConfirmation: { dutch: "goede morgen", english: "goede morgen-en", telugu: "goede morgen-te", context: "Goede morgen, buur." } }));
    await module.handleSaveAction();
    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({ dutch: "goede morgen", kind: "chunk", source: "webpage" }));
  });

  it("requests and saves English and Telugu translations for a Dutch webpage context", async () => {
    const translate = vi.fn(createTransport().translate);
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ translate, saveLearningItem }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });

    await module.beginLookup({ text: "huis", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "Een huis staat daar." });
    await module.handleSaveAction();

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ text: "Een huis staat daar.", sourceLanguage: "nl", targetLanguage: "en" }));
    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ text: "Een huis staat daar.", sourceLanguage: "nl", targetLanguage: "te" }));
    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({ context: "Een huis staat daar.", contextTranslations: { english: "Een huis staat daar.-en", telugu: "Een huis staat daar.-te" } }));
  });

  it("never auto-saves a selected meaningful chunk", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({ getSettings: () => ({ ...defaultSettings, autoSaveSelectedWords: true }), transport: createTransport({ saveLearningItem }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, pageContext: "Goede morgen, buur." });
    await Promise.resolve();
    expect(saveLearningItem).not.toHaveBeenCalled();
  });

  it("keeps an eligible chunk learner-controlled after its first-encounter mission", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ saveLearningItem }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl", pageContext: "goede morgen, buur." });
    module.startPractice();
    module.addMissionFragment(1);
    module.addMissionFragment(0);
    module.checkMission();

    expect(events.at(-1)).toEqual(expect.objectContaining({
      type: "render-mission",
      mission: expect.objectContaining({
        result: "got-it",
        capture: {
          saveAction: { status: "ready", label: "Review & save", disabled: false },
          chunkConfirmation: { dutch: "goede morgen", english: "goede morgen-en", telugu: "goede morgen-te", context: "goede morgen, buur." },
        },
      }),
    }));
    expect(saveLearningItem).not.toHaveBeenCalled();

    await module.handleSaveAction();
    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({ dutch: "goede morgen", kind: "chunk", source: "webpage" }));
  });

  it.each(["een zin.", "een\ntwee", `een ${"x".repeat(78)}`])("keeps %j translatable but hides chunk saving", async (text) => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport(), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text, context: "selection", x: 1, y: 1, pageContext: text });
    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", response: expect.objectContaining({ ok: true }), saveAction: { status: "hidden" } }));
  });

  it("keeps a chunk save recoverable when the background request fails", async () => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({ getSettings: () => defaultSettings, transport: createTransport({ saveLearningItem: async () => { throw new Error("Storage unavailable"); } }), runWithTimeout: (promise) => promise, tooltipTimeoutMs: 9000 });
    module.subscribe((event) => events.push(event));
    await module.beginLookup({ text: "goede morgen", context: "selection", x: 1, y: 1, pageContext: "Goede morgen, buur." });
    await module.handleSaveAction();
    expect(events).toContainEqual({ type: "save-state-changed", saveAction: { status: "retry", label: "Try again", disabled: false, title: "Storage unavailable" } });
  });

  it("saves English-source selections through one canonical learning mutation", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({
        saveLearningItem,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "house",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "house",
      sourceLanguageHint: "en",
    });
    await module.handleSaveAction();

    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({
      dutch: "house-nl",
      english: "house",
      source: "webpage",
      sourceMetadata: expect.objectContaining({
        sourceLanguage: "auto",
        detectedSourceLanguage: "en",
      }),
    }));
  });

  it.each([
    ["morning", "en", "house-nl"],
    ["నమస్కారం", "te", "hallo-nl"],
  ] as const)("keeps automatic source detection active for one-target %s selections", async (text, sourceLanguage, dutch) => {
    const translate = vi.fn(async ({ targetLanguage }: Parameters<TranslationTransport["translate"]>[0]) => ({ ok: true as const, result: { translatedText: targetLanguage === "nl" ? dutch : `${text}-${targetLanguage}`, providerName: "custom-endpoint" } }));
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, translateToOtherMvpLanguages: false }),
      transport: createTransport({ translate, saveLearningItem }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text, context: "selection", x: 1, y: 1, pageContext: `${text} context.` });
    await module.handleSaveAction();

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ text, sourceLanguage, targetLanguage: "nl" }));
    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({ dutch, contextSourceLanguage: sourceLanguage, contextSourceText: text }));
  });

  it("honors an explicit source setting and still requests Dutch for a cross-language selection", async () => {
    const translate = vi.fn(async ({ targetLanguage }: Parameters<TranslationTransport["translate"]>[0]) => ({ ok: true as const, result: { translatedText: targetLanguage === "nl" ? "huis" : "ignored", providerName: "custom-endpoint" } }));
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, sourceLanguage: "en", translateToOtherMvpLanguages: false }),
      transport: createTransport({ translate }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text: "house", context: "selection", x: 1, y: 1, sourceLanguageHint: "nl" });

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ sourceLanguage: "en", targetLanguage: "nl" }));
  });

  it.each([
    ["good morning", "morning", "house-nl"],
    ["morning", "morning", "two words"],
    ["qwerty", "qwerty", "huis"],
  ] as const)("keeps unsafe cross-language results translation-only for %s", async (text, languageSample, dutch) => {
    const events: unknown[] = [];
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, translateToOtherMvpLanguages: false }),
      transport: createTransport({ translate: async ({ targetLanguage }) => ({ ok: true, result: { translatedText: targetLanguage === "nl" ? dutch : "ignored", providerName: "custom-endpoint" } }) }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });
    module.subscribe((event) => events.push(event));

    await module.beginLookup({ text, context: "selection", x: 1, y: 1, languageSample, sourceLanguageHint: text === "qwerty" ? undefined : "en" });

    expect(events).toContainEqual(expect.objectContaining({ type: "render-result", saveAction: { status: "hidden" } }));
  });

  it("keeps cross-language save manual even when Dutch auto-save is enabled", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, sourceLanguage: "en", translateToOtherMvpLanguages: false, autoSaveSelectedWords: true }),
      transport: createTransport({ saveLearningItem, translate: async ({ targetLanguage }) => ({ ok: true, result: { translatedText: targetLanguage === "nl" ? "huis" : "ignored", providerName: "custom-endpoint" } }) }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text: "house", context: "selection", x: 1, y: 1 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(saveLearningItem).not.toHaveBeenCalled();

    await module.handleSaveAction();
    expect(saveLearningItem).toHaveBeenCalledOnce();
  });

  it("retains exact cross-language context and saves the word when an optional helper fails", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const translate = vi.fn(async ({ text, targetLanguage }: Parameters<TranslationTransport["translate"]>[0]) => text === "A house stands here." && targetLanguage === "te"
      ? { ok: false as const, error: "Telugu unavailable" }
      : { ok: true as const, result: { translatedText: targetLanguage === "nl" ? "huis" : "unexpected", providerName: "custom-endpoint" } });
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, sourceLanguage: "en", translateToOtherMvpLanguages: false }),
      transport: createTransport({ translate, saveLearningItem }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({ text: "house", context: "selection", x: 1, y: 1, pageContext: "A house stands here." });
    await module.handleSaveAction();

    expect(translate).toHaveBeenCalledWith(expect.objectContaining({ text: "A house stands here.", sourceLanguage: "en", targetLanguage: "te" }));
    expect(saveLearningItem).toHaveBeenCalledWith(expect.objectContaining({
      dutch: "huis",
      english: "house",
      context: "A house stands here.",
      contextSourceLanguage: "en",
      contextSourceText: "house",
      contextTranslations: { english: "A house stands here." },
    }));
  });

  it("auto-saves eligible selected words with reliable page context when enabled", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => ({ ...defaultSettings, autoSaveSelectedWords: true }),
      transport: createTransport({
        saveLearningItem,
      }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
      pageContext: "Een huis staat daar.",
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(saveLearningItem).toHaveBeenCalledWith(
      expect.objectContaining({
        dutch: "huis",
        context: "Een huis staat daar.",
      }),
    );
  });

  it("keeps the manual save action when automatic saving is disabled", async () => {
    const saveLearningItem = vi.fn(async () => ({ ok: true }));
    const module = new WebpageLookupModule({
      getSettings: () => defaultSettings,
      transport: createTransport({ saveLearningItem }),
      runWithTimeout: (promise) => promise,
      tooltipTimeoutMs: 9000,
    });

    await module.beginLookup({
      text: "huis",
      context: "selection",
      x: 10,
      y: 20,
      languageSample: "huis",
      sourceLanguageHint: "nl",
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(saveLearningItem).not.toHaveBeenCalled();
  });
});
