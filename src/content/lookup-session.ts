import type { TooltipContext } from "./tooltip-request-state";

export type LookupCompletion<T> =
  | {
      status: "stale";
    }
  | {
      status: "current";
      context: TooltipContext;
      value: T;
    };

export class LookupSession<T> {
  #currentRequestId = 0;
  #currentContext: TooltipContext | null = null;

  get activeContext(): TooltipContext | null {
    return this.#currentContext;
  }

  shouldKeepVisibleOnMouseLeave(): boolean {
    return this.#currentContext === "selection";
  }

  hasActiveSelectionControl(): boolean {
    return this.#currentContext === "selection";
  }

  begin(context: TooltipContext): number {
    this.#currentRequestId += 1;
    this.#currentContext = context;
    return this.#currentRequestId;
  }

  isCurrent(requestId: number): boolean {
    return requestId === this.#currentRequestId;
  }

  complete(requestId: number, value: T): LookupCompletion<T> {
    if (!this.isCurrent(requestId) || this.#currentContext === null) {
      return {
        status: "stale",
      };
    }

    return {
      status: "current",
      context: this.#currentContext,
      value,
    };
  }

  fail(requestId: number, error: string): LookupCompletion<string> {
    if (!this.isCurrent(requestId) || this.#currentContext === null) {
      return {
        status: "stale",
      };
    }

    return {
      status: "current",
      context: this.#currentContext,
      value: error,
    };
  }

  clear(): void {
    this.#currentRequestId += 1;
    this.#currentContext = null;
  }
}
