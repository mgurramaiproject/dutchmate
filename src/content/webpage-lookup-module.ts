import { applySavedVocabularyStorageChange } from "./saved-vocabulary-id-cache";
import type { TranslateMessageResponse } from "./runtime-translation-client";
import { TOOLTIP_TRANSLATION_TIMEOUT_MESSAGE } from "./tooltip-translation-timeout";
import { WebpageLookupSession, type TranslationOutcome } from "./webpage-lookup-session";
import type {
  RuntimeSaveVocabularyBatchResponse,
  RuntimeSaveVocabularyRequest,
} from "./runtime-vocabulary-client";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import type { ExtensionSettings } from "../shared/settings";
import { getSavedVocabularyEntryId } from "../vocabulary/saved-vocabulary";

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
};

export type SaveActionState =
  | { status: "hidden" }
  | { status: "checking"; label: "Checking..."; disabled: true }
  | { status: "ready"; label: "Save"; disabled: false }
  | { status: "already-saved"; label: "Already saved"; disabled: true }
  | { status: "saving"; label: "Saving..."; disabled: true }
  | { status: "saved"; label: "Saved"; disabled: true }
  | { status: "full"; label: "Vocabulary full"; disabled: true }
  | { status: "retry"; label: "Try again"; disabled: false; title: string };

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
  listSavedVocabularyIds(): Promise<Set<string> | undefined>;
  saveVocabularyBatch(
    requests: RuntimeSaveVocabularyRequest[],
  ): Promise<RuntimeSaveVocabularyBatchResponse>;
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
  #currentSaveCandidates: RuntimeSaveVocabularyRequest[] = [];
  #currentSaveCandidateIds: string[] = [];

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

  applySettings(): void {
    if (!this.#deps.getSettings().isEnabled) {
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

    if (this.#currentSaveCandidates.length === 0) {
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
    this.#currentSaveCandidates = [];
    this.#currentSaveCandidateIds = [];
    this.#emit({ type: "hide-tooltip" });
  }

  async beginLookup(input: WebpageLookupInput): Promise<void> {
    const requestId = this.#session.begin(input.context);
    this.#currentSaveCandidates = [];
    this.#currentSaveCandidateIds = [];

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

    this.#currentSaveCandidates = completedLookup.saveCandidates;
    this.#currentSaveCandidateIds = completedLookup.saveCandidates.map((candidate) =>
      getSavedVocabularyEntryId(candidate),
    );
    const saveAction = this.#getSaveActionState();

    this.#emit({
      type: "render-result",
      context: completedLookup.context,
      x: input.x,
      y: input.y,
      response: completedLookup.response,
      saveAction,
    });

    if (saveAction.status === "checking") {
      void this.#refreshCurrentSaveState();
    }
  }

  async handleSaveAction(): Promise<void> {
    if (this.#currentSaveCandidates.length === 0) {
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

    const response = await this.#deps.transport.saveVocabularyBatch(this.#currentSaveCandidates);
    if (!response.ok) {
      this.#emit({
        type: "save-state-changed",
        saveAction: {
          status: "retry",
          label: "Try again",
          disabled: false,
          title: response.error,
        },
      });
      return;
    }

    const saveResults = response.result.results;
    const maxEntriesResult = saveResults.find((result) => result.status === "max-entries-reached");
    if (maxEntriesResult?.status === "max-entries-reached") {
      this.#emit({
        type: "save-state-changed",
        saveAction: {
          status: "full",
          label: "Vocabulary full",
          disabled: true,
        },
      });
      return;
    }

    if (saveResults.every((result) => result.status === "already-saved")) {
      this.#emit({
        type: "save-state-changed",
        saveAction: {
          status: "already-saved",
          label: "Already saved",
          disabled: true,
        },
      });
      return;
    }

    const savedEntries = saveResults.flatMap((result) =>
      "entry" in result && result.entry ? [result.entry] : [],
    );
    const savedIds = savedEntries.map((entry) => entry.id);
    this.#savedVocabularyIds = new Set([...(this.#savedVocabularyIds ?? []), ...savedIds]);

    this.#emit({
      type: "save-state-changed",
      saveAction: {
        status: "saved",
        label: "Saved",
        disabled: true,
      },
    });
  }

  async #refreshCurrentSaveState(): Promise<void> {
    const snapshot = this.#currentSaveCandidateIds.join("\u001f");
    const savedVocabularyIds = await this.#refreshSavedVocabularyIds();

    if (snapshot !== this.#currentSaveCandidateIds.join("\u001f")) {
      return;
    }

    this.#savedVocabularyIds = savedVocabularyIds;
    this.#emit({
      type: "save-state-changed",
      saveAction: this.#getSaveActionState(),
    });
  }

  async #refreshSavedVocabularyIds(): Promise<Set<string> | undefined> {
    if (this.#savedVocabularyIdsRequest) {
      return this.#savedVocabularyIdsRequest;
    }

    this.#savedVocabularyIdsRequest = this.#deps.transport
      .listSavedVocabularyIds()
      .finally(() => {
        this.#savedVocabularyIdsRequest = undefined;
      });

    return this.#savedVocabularyIdsRequest;
  }

  #getSaveActionState(): SaveActionState {
    if (this.#currentSaveCandidates.length === 0) {
      return { status: "hidden" };
    }

    if (this.#savedVocabularyIds === undefined) {
      return {
        status: "checking",
        label: "Checking...",
        disabled: true,
      };
    }

    if (this.#currentSaveCandidateIds.every((id) => this.#savedVocabularyIds?.has(id))) {
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

      return {
        response,
        saveCandidates: this.#getSaveCandidatesFromResponses(settings, text, sourceLanguage, [
          {
            targetLanguage: settings.targetLanguage,
            response,
          },
        ]),
      };
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
        response: failedResponse.response,
        saveCandidates: [],
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
      saveCandidates: this.#getSaveCandidatesFromResponses(
        settings,
        text,
        sourceLanguage,
        responses,
      ),
    };
  }

  #getSaveCandidatesFromResponses(
    settings: ExtensionSettings,
    text: string,
    activeSourceLanguage: SourceLanguageCode,
    responses: Array<{
      targetLanguage: MvpLanguageCode;
      response: TranslateMessageResponse;
    }>,
  ): RuntimeSaveVocabularyRequest[] {
    const sourceLanguage = this.#getRequestedSourceLanguage(settings);
    const detectedSourceLanguage = this.#getDetectedSourceLanguage(
      sourceLanguage,
      activeSourceLanguage,
    );

    return responses.flatMap(({ targetLanguage, response }) => {
      if (!response.ok || !this.#isSelectionSaveCandidate(text)) {
        return [];
      }

      return [
        {
          text,
          sourceLanguage,
          detectedSourceLanguage,
          targetLanguage,
          translatedText: response.result.translatedText,
          providerName: response.result.providerName,
        },
      ];
    });
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
