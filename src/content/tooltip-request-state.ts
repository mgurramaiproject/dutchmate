export type TooltipContext = "hover" | "selection";

export class TooltipRequestState {
  #currentRequestId = 0;
  #activeContext: TooltipContext | null = null;

  get activeContext(): TooltipContext | null {
    return this.#activeContext;
  }

  begin(context: TooltipContext): number {
    this.#currentRequestId += 1;
    this.#activeContext = context;
    return this.#currentRequestId;
  }

  clear(): void {
    this.#currentRequestId += 1;
    this.#activeContext = null;
  }

  isCurrent(requestId: number): boolean {
    return requestId === this.#currentRequestId;
  }
}
