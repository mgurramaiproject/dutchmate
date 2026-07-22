import { applySavedVocabularyStorageChange } from "./saved-vocabulary-id-cache";
import type { TranslateMessageResponse } from "./runtime-translation-client";
import { TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE } from "./tooltip-translation-timeout";
import { WebpageLookupSession, type TranslationOutcome } from "./webpage-lookup-session";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import type { ExtensionSettings } from "../shared/settings";
import { getLearningItemId } from "../vocabulary/learning-record";
import { normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";
import { getChunkCandidate } from "./chunk-candidate";
import type { CreateOrMergeLearningItemInput } from "../vocabulary/learning-record";

const supportedTargetLanguages = new Set(["en", "nl", "te"]);
const mvpLanguages = [
  { code: "en", label: "English" },
  { code: "nl", label: "Dutch" },
  { code: "te", label: "Telugu" },
];
const dutchLanguageHints = new Set([
  "aan",
  "alsjeblieft",
  "ben",
  "dank",
  "dat",
  "de",
  "een",
  "en",
  "engels",
  "geen",
  "goedemorgen",
  "hallo",
  "heb",
  "hebben",
  "het",
  "hoe",
  "huis",
  "ik",
  "is",
  "je",
  "jij",
  "kan",
  "leren",
  "maar",
  "met",
  "nederlands",
  "niet",
  "ook",
  "op",
  "spreek",
  "taal",
  "te",
  "van",
  "voor",
  "waar",
  "wat",
  "wij",
  "zijn",
]);
const englishLanguageHints = new Set([
  "a",
  "an",
  "and",
  "are",
  "dutch",
  "english",
  "for",
  "good",
  "hello",
  "i",
  "in",
  "is",
  "morning",
  "not",
  "of",
  "on",
  "please",
  "thank",
  "thanks",
  "telugu",
  "that",
  "the",
  "to",
  "with",
  "you",
]);

export type WebpageLookupInput = {
  text: string;
  context: "hover" | "selection";
  x: number;
  y: number;
  languageSample?: string;
  sourceLanguageHint?: MvpLanguageCode;
  pageContext?: string | null;
};

export type SaveActionState =
  | { status: "hidden" }
  | { status: "checking"; label: "Checking..."; disabled: true }
  | { status: "ready"; label: "Save" | "Review & save"; disabled: false }
  | { status: "already-saved"; label: "Already saved"; disabled: true }
  | { status: "saving"; label: "Saving..."; disabled: true }
  | { status: "saved"; label: "Saved"; disabled: true }
  | { status: "full"; label: "Vocabulary full"; disabled: true }
  | { status: "retry"; label: "Try again"; disabled: false; title: string };
export type ChunkConfirmation = { dutch: string; english: string | null; telugu: string | null; context: string | null };
export type ContextMission = {
  selectedDutch: string;
  pageContext: string | null;
  available: string[];
  placed: string[];
  result?: "got-it" | "again";
};

export type WebpageLookupModuleEvent =
  | {
      type: "render-loading";
      context: "hover" | "selection";
      x: number;
      y: number;
      message: string;
    }
  | {
      type: "render-result";
      context: "hover" | "selection";
      x: number;
      y: number;
      response: TranslateMessageResponse;
      saveAction: SaveActionState;
      chunkConfirmation?: ChunkConfirmation;
      seenBefore?: true;
      practiceAvailable?: true;
    }
  | {
      type: "render-error";
      context: "hover" | "selection";
      x: number;
      y: number;
      message: string;
    }
  | {
      type: "save-state-changed";
      saveAction: SaveActionState;
    }
  | {
      type: "show-seen-before";
    }
  | {
      type: "render-mission";
      mission: ContextMission;
    }
  | {
      type: "hide-tooltip";
    };

export type TranslationTransport = {
  translate(
    request: {
      text: string;
      context: "hover" | "selection";
      sourceLanguage: SourceLanguageCode;
      targetLanguage: MvpLanguageCode;
    },
  ): Promise<TranslateMessageResponse>;
  listLearningItemIds(): Promise<Set<string> | undefined>;
  saveLearningItem(input: CreateOrMergeLearningItemInput): Promise<{ ok: boolean; error?: string }>;
  listLearningItems?(): Promise<{ ok: boolean; result?: { items: Array<{ id: string; normalizedDutch: string }> } }>;
  recordLearningEncounter?(input: { id: string; context: string }): Promise<{ ok: boolean }>;
};

type StorageChange = {
  newValue?: unknown;
};

type WebpageLookupModuleDependencies = {
  getSettings(): ExtensionSettings;
  transport: TranslationTransport;
  runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T>;
  tooltipTimeoutMs: number;
};

export class WebpageLookupModule {
  readonly #session = new WebpageLookupSession();
  readonly #listeners = new Set<(event: WebpageLookupModuleEvent) => void>();
  readonly #deps: WebpageLookupModuleDependencies;

  #savedVocabularyIds: Set<string> | undefined;
  #savedVocabularyIdsRequest: Promise<Set<string> | undefined> | undefined;
  #currentSaveItem: CreateOrMergeLearningItemInput | null = null;
  #currentSaveItemId: string | null = null;
  #currentChunk: CreateOrMergeLearningItemInput | null = null;
  #practiceSelection: { dutch: string; pageContext: string | null } | null = null;
  #mission: ContextMission | null = null;

  constructor(dependencies: WebpageLookupModuleDependencies) {
    this.#deps = dependencies;
  }

  subscribe(listener: (event: WebpageLookupModuleEvent) => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  shouldKeepVisibleOnMouseLeave(): boolean {
    return this.#session.shouldKeepVisibleOnMouseLeave();
  }

  hasActiveSelectionControl(): boolean {
    return this.#session.hasActiveSelectionControl();
  }

  hasActiveMission(): boolean {
    return this.#mission !== null;
  }

  applySettings(): void {
    const settings = this.#deps.getSettings();
    if (!settings.isEnabled || !settings.translateOnSelection) {
      this.clear();
    }
  }

  handleStorageChanged(changes: Record<string, StorageChange>, areaName: string): void {
    const nextSavedVocabularyIds = applySavedVocabularyStorageChange(
      this.#savedVocabularyIds,
      changes,
      areaName,
    );

    if (nextSavedVocabularyIds === this.#savedVocabularyIds) {
      return;
    }

    this.#savedVocabularyIds = nextSavedVocabularyIds;
    this.#savedVocabularyIdsRequest = undefined;

    if (!this.#currentSaveItem) {
      return;
    }

    this.#emit({
      type: "save-state-changed",
      saveAction: this.#getSaveActionState(),
    });
    void this.#refreshCurrentSaveState();
  }

  clear(): void {
    this.#session.clear();
    this.#currentSaveItem = null;
    this.#currentSaveItemId = null;
    this.#currentChunk = null;
    this.#practiceSelection = null;
    this.#mission = null;
    this.#emit({ type: "hide-tooltip" });
  }

  async beginLookup(input: WebpageLookupInput): Promise<void> {
    const requestId = this.#session.begin(input.context);
    this.#currentSaveItem = null;
    this.#currentSaveItemId = null;
    this.#practiceSelection = null;
    this.#mission = null;

    this.#emit({
      type: "render-loading",
      context: input.context,
      x: input.x,
      y: input.y,
      message: "Translating...",
    });

    let outcome: TranslationOutcome;
    try {
      outcome = await this.#deps.runWithTimeout(
        this.#requestTranslationForCurrentSettings(
          input.text,
          input.context,
          input.languageSample ?? input.text,
          input.sourceLanguageHint,
          input.pageContext,
        ),
        this.#deps.tooltipTimeoutMs,
      );
    } catch (error) {
      const failedLookup = this.#session.acceptFailure(
        requestId,
        error instanceof Error ? error.message : "Translation request failed.",
      );

      if (failedLookup.status === "current") {
        this.#emit({
          type: "render-error",
          context: failedLookup.context,
          x: input.x,
          y: input.y,
          message: failedLookup.error || TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE,
        });
      }
      return;
    }

    const completedLookup = this.#session.acceptSuccess(requestId, input.text, outcome);
    if (completedLookup.status === "stale") {
      return;
    }

    const practiceAvailable = completedLookup.context === "selection" && completedLookup.response.ok && completedLookup.sourceLanguage === "nl" && Boolean(input.pageContext?.includes(input.text)) && isMissionSelection(input.text);
    this.#practiceSelection = practiceAvailable
      ? { dutch: input.text, pageContext: input.pageContext ?? null }
      : null;

    this.#currentSaveItem = completedLookup.context === "selection"
      ? this.#getLearningItemFromResponses(
        input.text,
        completedLookup.sourceLanguage,
        input.pageContext,
        completedLookup.responses,
      )
      : null;
    const chunk = input.context === "selection" ? getChunkCandidate(input.text) : null;
    let chunkConfirmation: ChunkConfirmation | undefined;
    if (chunk && completedLookup.response.ok) {
      const helpers = getChunkHelpers(completedLookup.response.result.translatedText);
      this.#currentChunk = { dutch: chunk.normalizedDutch, kind: "chunk", source: "webpage", context: input.pageContext, ...helpers };
      chunkConfirmation = { dutch: chunk.normalizedDutch, english: helpers.english ?? null, telugu: helpers.telugu ?? null, context: input.pageContext?.slice(0, 240) ?? null };
    }
    this.#currentSaveItemId = this.#currentSaveItem ? getLearningItemId(this.#currentSaveItem.dutch) : null;
    const saveAction: SaveActionState = this.#currentChunk ? { status: "ready", label: "Review & save", disabled: false } : this.#getSaveActionState();

    this.#emit({
      type: "render-result",
      context: completedLookup.context,
      x: input.x,
      y: input.y,
      response: completedLookup.response,
      saveAction,
      ...(chunkConfirmation ? { chunkConfirmation } : {}),
      ...(practiceAvailable ? { practiceAvailable: true } : {}),
    });

    if (completedLookup.response.ok) {
      void this.#recordEncounter(requestId, input.text, input.pageContext).then((seenBefore) => {
        if (seenBefore && this.#session.isCurrent(requestId)) this.#emit({ type: "show-seen-before" });
      });
    }

    if (saveAction.status === "checking") {
      void this.#refreshCurrentSaveState();
    }

    if (this.#deps.getSettings().autoSaveSelectedWords && !this.#currentChunk && saveAction.status !== "hidden") {
      void this.#autoSaveCurrentSelection();
    }
  }

  async #recordEncounter(requestId: number, text: string, context: string | null | undefined): Promise<boolean> {
    if (!context || !this.#deps.transport.listLearningItems || !this.#deps.transport.recordLearningEncounter) return false;
    try {
      const response = await this.#deps.transport.listLearningItems();
      const item = response.ok ? response.result?.items.find((candidate) => candidate.normalizedDutch === normalizeSavedVocabularyText(text)) : undefined;
      return item && this.#session.isCurrent(requestId) ? (await this.#deps.transport.recordLearningEncounter({ id: item.id, context })).ok : false;
    } catch {
      return false;
    }
  }

  async handleSaveAction(): Promise<void> {
    if (this.#currentChunk) {
      let response: { ok: boolean; error?: string };
      try {
        response = this.#deps.transport.saveLearningItem
          ? await this.#deps.transport.saveLearningItem(this.#currentChunk)
          : { ok: false, error: "Learning save is unavailable." };
      } catch (error) {
        response = { ok: false, error: error instanceof Error ? error.message : "Learning item could not be saved." };
      }
      this.#emit({ type: "save-state-changed", saveAction: response.ok ? { status: "saved", label: "Saved", disabled: true } : { status: "retry", label: "Try again", disabled: false, title: response.error ?? "Learning item could not be saved." } });
      return;
    }
    if (!this.#currentSaveItem) {
      return;
    }

    this.#emit({
      type: "save-state-changed",
      saveAction: {
        status: "saving",
        label: "Saving...",
        disabled: true,
      },
    });

    const response = await this.#deps.transport.saveLearningItem(this.#currentSaveItem);
    if (!response.ok) {
      this.#emit({
        type: "save-state-changed",
        saveAction: {
          status: "retry",
          label: "Try again",
          disabled: false,
          title: response.error ?? "Learning item could not be saved.",
        },
      });
      return;
    }

    if (this.#currentSaveItemId) this.#savedVocabularyIds = new Set([...(this.#savedVocabularyIds ?? []), this.#currentSaveItemId]);

    this.#emit({
      type: "save-state-changed",
      saveAction: {
        status: "saved",
        label: "Saved",
        disabled: true,
      },
    });
  }

  startPractice(): void {
    if (!this.#practiceSelection) return;
    const selectedDutch = this.#practiceSelection.dutch;
    this.#mission = {
      selectedDutch,
      pageContext: this.#practiceSelection.pageContext,
      available: deterministicRotation(selectedDutch.split(/\s+/u)),
      placed: [],
    };
    this.#emitMission();
  }

  addMissionFragment(index: number): void {
    if (!this.#mission || index < 0 || index >= this.#mission.available.length) return;
    const available = [...this.#mission.available];
    const [fragment] = available.splice(index, 1);
    this.#mission = { ...this.#mission, available, placed: [...this.#mission.placed, fragment] };
    this.#emitMission();
  }

  removeMissionFragment(index: number): void {
    if (!this.#mission || index < 0 || index >= this.#mission.placed.length) return;
    const placed = [...this.#mission.placed];
    const [fragment] = placed.splice(index, 1);
    this.#mission = { ...this.#mission, placed, available: [...this.#mission.available, fragment] };
    this.#emitMission();
  }

  resetMission(): void {
    if (!this.#mission) return;
    this.#mission = { ...this.#mission, available: deterministicRotation(this.#mission.selectedDutch.split(/\s+/u)), placed: [], result: undefined };
    this.#emitMission();
  }

  checkMission(): void {
    if (!this.#mission || this.#mission.placed.length !== this.#mission.selectedDutch.split(/\s+/u).length || this.#mission.result) return;
    const result = normalizeMissionAnswer(this.#mission.placed.join(" ")) === normalizeMissionAnswer(this.#mission.selectedDutch) ? "got-it" : "again";
    this.#mission = { ...this.#mission, result };
    this.#emitMission();
  }

  replayMission(): void {
    this.resetMission();
  }

  #emitMission(): void {
    if (this.#mission) this.#emit({ type: "render-mission", mission: this.#mission });
  }

  async #refreshCurrentSaveState(): Promise<void> {
    const snapshot = this.#currentSaveItemId;
    const savedVocabularyIds = await this.#refreshSavedVocabularyIds();

    if (snapshot !== this.#currentSaveItemId) {
      return;
    }

    this.#savedVocabularyIds = savedVocabularyIds;
    this.#emit({
      type: "save-state-changed",
      saveAction: this.#getSaveActionState(),
    });
  }

  async #autoSaveCurrentSelection(): Promise<void> {
    await this.#refreshCurrentSaveState();
    if (this.#getSaveActionState().status === "ready") {
      await this.handleSaveAction();
    }
  }

  async #refreshSavedVocabularyIds(): Promise<Set<string> | undefined> {
    if (this.#savedVocabularyIdsRequest) {
      return this.#savedVocabularyIdsRequest;
    }

    this.#savedVocabularyIdsRequest = this.#deps.transport
      .listLearningItemIds()
      .finally(() => {
        this.#savedVocabularyIdsRequest = undefined;
      });

    return this.#savedVocabularyIdsRequest;
  }

  #getSaveActionState(): SaveActionState {
    if (!this.#currentSaveItem) {
      return { status: "hidden" };
    }

    if (this.#savedVocabularyIds === undefined) {
      return {
        status: "checking",
        label: "Checking...",
        disabled: true,
      };
    }

    if (this.#currentSaveItemId && this.#savedVocabularyIds?.has(this.#currentSaveItemId)) {
      return {
        status: "already-saved",
        label: "Already saved",
        disabled: true,
      };
    }

    return {
      status: "ready",
      label: "Save",
      disabled: false,
    };
  }

  async #requestTranslationForCurrentSettings(
    text: string,
    context: "hover" | "selection",
    languageSample: string,
    sourceLanguageHint?: MvpLanguageCode,
    pageContext?: string | null,
  ): Promise<TranslationOutcome> {
    const settings = this.#deps.getSettings();
    const sourceLanguage = this.#getActiveSourceLanguage(settings, languageSample, sourceLanguageHint);
    const targetLanguages = this.#getActiveTargetLanguages(settings, sourceLanguage);

    if (targetLanguages.length <= 1) {
      const response = await this.#deps.transport.translate({
        text,
        context,
        sourceLanguage,
        targetLanguage: settings.targetLanguage,
      });

      return { response, sourceLanguage, responses: [{ targetLanguage: settings.targetLanguage, response }] };
    }

    const responses = await Promise.all(
      targetLanguages.map(async (targetLanguage) => ({
        targetLanguage,
        response: await this.#deps.transport.translate({
          text,
          context,
          sourceLanguage,
          targetLanguage,
        }),
      })),
    );
    const failedResponse = responses.find(({ response }) => !response.ok);

    if (failedResponse?.response.ok === false) {
      return {
        response: failedResponse.response, sourceLanguage, responses,
      };
    }

    return {
      response: {
        ok: true,
        result: {
          translatedText: responses
            .map(({ targetLanguage, response }) => {
              const label = this.#getLanguageLabel(targetLanguage);
              return `${label}: ${response.ok ? response.result.translatedText : ""}`;
            })
            .join("\n"),
          providerName: "multi-target",
        },
      },
        sourceLanguage, responses,
    };
  }

  #getLearningItemFromResponses(
    text: string,
    activeSourceLanguage: SourceLanguageCode,
    pageContext: string | null | undefined,
    responses: Array<{
      targetLanguage: MvpLanguageCode;
      response: TranslateMessageResponse;
    }>,
  ): CreateOrMergeLearningItemInput | null {
    if (!this.#isSelectionSaveCandidate(text) || !["en", "nl", "te"].includes(activeSourceLanguage)) return null;
    const sourceLanguage = this.#getRequestedSourceLanguage(this.#deps.getSettings());
    const detectedSourceLanguage = this.#getDetectedSourceLanguage(sourceLanguage, activeSourceLanguage);
    const translated = (language: MvpLanguageCode): string | null => {
      const response = responses.find((candidate) => candidate.targetLanguage === language)?.response;
      return response?.ok ? response.result.translatedText : null;
    };
    const dutch = activeSourceLanguage === "nl" ? text : translated("nl");
    if (!dutch) return null;
    return {
      dutch,
      kind: "word",
      english: activeSourceLanguage === "en" ? text : translated("en"),
      telugu: activeSourceLanguage === "te" ? text : translated("te"),
      source: "webpage",
      sourceMetadata: {
        sourceLanguage,
        ...(detectedSourceLanguage ? { detectedSourceLanguage } : {}),
        targetLanguage: activeSourceLanguage === "nl" ? "en" : "nl",
        providerName: (() => {
          const response = responses.find((candidate) => candidate.response.ok)?.response;
          return response?.ok ? response.result.providerName : undefined;
        })(),
      },
      ...(pageContext ? { context: pageContext } : {}),
    };
  }

  #isSelectionSaveCandidate(text: string): boolean {
    return /^[\p{Letter}\p{Number}'-]+$/u.test(text.trim().replace(/\s+/g, " ").toLocaleLowerCase());
  }

  #getRequestedSourceLanguage(settings: ExtensionSettings): SourceLanguageCode {
    return settings.sourceLanguage === "auto" || supportedTargetLanguages.has(settings.sourceLanguage)
      ? settings.sourceLanguage
      : "auto";
  }

  #getDetectedSourceLanguage(
    requestedSourceLanguage: SourceLanguageCode,
    activeSourceLanguage: SourceLanguageCode,
  ): MvpLanguageCode | undefined {
    return requestedSourceLanguage === "auto" && supportedTargetLanguages.has(activeSourceLanguage)
      ? (activeSourceLanguage as MvpLanguageCode)
      : undefined;
  }

  #getActiveTargetLanguages(
    settings: ExtensionSettings,
    sourceLanguage: SourceLanguageCode,
  ): MvpLanguageCode[] {
    if (!settings.translateToOtherMvpLanguages) {
      return [settings.targetLanguage];
    }

    const orderedLanguages =
      sourceLanguage === settings.learningLanguage
        ? [settings.bridgeLanguage, settings.nativeLanguage, settings.learningLanguage]
        : [settings.learningLanguage, settings.bridgeLanguage, settings.nativeLanguage];

    return Array.from(new Set(orderedLanguages)).filter(
      (languageCode): languageCode is MvpLanguageCode => languageCode !== sourceLanguage,
    );
  }

  #getActiveSourceLanguage(
    settings: ExtensionSettings,
    text: string,
    sourceLanguageHint?: MvpLanguageCode,
  ): SourceLanguageCode {
    if (settings.sourceLanguage !== "auto") {
      return this.#getRequestedSourceLanguage(settings);
    }

    if (!settings.translateToOtherMvpLanguages) {
      return "auto";
    }

    return this.#detectMvpSourceLanguage(text, sourceLanguageHint);
  }

  #detectMvpSourceLanguage(
    text: string,
    sourceLanguageHint?: MvpLanguageCode,
  ): MvpLanguageCode {
    if (/[\u0C00-\u0C7F]/u.test(text)) {
      return "te";
    }

    if (sourceLanguageHint) {
      return sourceLanguageHint;
    }

    const words = text.toLowerCase().match(/[\p{Letter}]+/gu) ?? [];
    let dutchScore = 0;
    let englishScore = 0;

    for (const word of words) {
      if (dutchLanguageHints.has(word)) {
        dutchScore += 1;
      }

      if (englishLanguageHints.has(word)) {
        englishScore += 1;
      }

      if (
        word.includes("ij") ||
        word.includes("sch") ||
        word.includes("oe") ||
        word.includes("ui")
      ) {
        dutchScore += 1;
      }
    }

    if (dutchScore > englishScore) {
      return "nl";
    }

    if (englishScore > dutchScore || words.length > 0) {
      return "en";
    }

    return "nl";
  }

  #getLanguageLabel(languageCode: string): string {
    return mvpLanguages.find((language) => language.code === languageCode)?.label ?? languageCode;
  }

  #emit(event: WebpageLookupModuleEvent): void {
    for (const listener of this.#listeners) {
      listener(event);
    }
  }
}

function getChunkHelpers(translatedText: string): Pick<CreateOrMergeLearningItemInput, "english" | "telugu"> {
  const lines = new Map(translatedText.split("\n").map((line) => { const [label, ...value] = line.split(":"); return [label.trim(), value.join(":").trim()]; }));
  return { english: lines.get("English") || null, telugu: lines.get("Telugu") || null };
}

function isMissionSelection(text: string): boolean {
  const words = text.trim().match(/[\p{Letter}\p{Number}][\p{Letter}\p{Number}'’-]*/gu) ?? [];
  return words.length >= 2 && words.length <= 12;
}

function deterministicRotation(words: string[]): string[] {
  return words.length < 2 ? words : [...words.slice(1), words[0]];
}

function normalizeMissionAnswer(value: string): string {
  return value.trim().replace(/[.!?]+$/u, "").trim().toLocaleLowerCase();
}
