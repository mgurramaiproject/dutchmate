import { describe, expect, it } from "vitest";
import { TooltipRequestState } from "./tooltip-request-state";

describe("TooltipRequestState", () => {
  it("marks an older hover request stale when a newer hover request starts", () => {
    const state = new TooltipRequestState();

    const firstRequest = state.begin("hover");
    const secondRequest = state.begin("hover");

    expect(state.isCurrent(firstRequest)).toBe(false);
    expect(state.isCurrent(secondRequest)).toBe(true);
  });

  it("marks an in-flight request stale when the tooltip is cleared", () => {
    const state = new TooltipRequestState();

    const request = state.begin("selection");
    state.clear();

    expect(state.isCurrent(request)).toBe(false);
    expect(state.activeContext).toBeNull();
  });

  it("tracks whether the active tooltip came from hover or selection", () => {
    const state = new TooltipRequestState();

    state.begin("selection");

    expect(state.activeContext).toBe("selection");
  });
});
