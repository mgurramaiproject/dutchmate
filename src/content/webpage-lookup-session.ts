import { LookupSession } from "./lookup-session";
import { getEligibleSaveCandidates } from "./save-action-eligibility";
import type { TranslateMessageResponse } from "./runtime-translation-client";
import type { RuntimeSaveVocabularyRequest } from "./runtime-vocabulary-client";
import type { TooltipContext } from "./tooltip-request-state";

export type TranslationOutcome = {
  response: TranslateMessageResponse;
  saveCandidates: RuntimeSaveVocabularyRequest[];
};

export type LookupPresentation =
  | {
      status: "stale";
    }
  | {
      status: "current";
      context: TooltipContext;
      response: TranslateMessageResponse;
      saveCandidates: RuntimeSaveVocabularyRequest[];
    };

export type LookupFailure =
  | {
      status: "stale";
    }
  | {
      status: "current";
      context: TooltipContext;
      error: string;
    };

export class WebpageLookupSession {
  readonly #session = new LookupSession<TranslationOutcome>();

  get activeContext(): TooltipContext | null {
    return this.#session.activeContext;
  }

  begin(context: TooltipContext): number {
    return this.#session.begin(context);
  }

  isCurrent(requestId: number): boolean {
    return this.#session.isCurrent(requestId);
  }

  acceptSuccess(requestId: number, text: string, outcome: TranslationOutcome): LookupPresentation {
    const completedLookup = this.#session.complete(requestId, outcome);

    if (completedLookup.status === "stale") {
      return completedLookup;
    }

    return {
      status: "current",
      context: completedLookup.context,
      response: completedLookup.value.response,
      saveCandidates: getEligibleSaveCandidates(
        text,
        completedLookup.context,
        completedLookup.value.saveCandidates,
      ),
    };
  }

  acceptFailure(requestId: number, error: string): LookupFailure {
    const failedLookup = this.#session.fail(requestId, error);

    if (failedLookup.status === "stale") {
      return failedLookup;
    }

    return {
      status: "current",
      context: failedLookup.context,
      error: failedLookup.value,
    };
  }

  shouldKeepVisibleOnMouseLeave(): boolean {
    return this.#session.shouldKeepVisibleOnMouseLeave();
  }

  hasActiveSelectionControl(): boolean {
    return this.#session.hasActiveSelectionControl();
  }

  clear(): void {
    this.#session.clear();
  }
}
