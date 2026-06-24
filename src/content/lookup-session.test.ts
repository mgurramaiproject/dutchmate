import { describe, expect, it } from "vitest";
import { LookupSession } from "./lookup-session";

describe("LookupSession", () => {
  it("accepts only the newest hover lookup result", () => {
    const session = new LookupSession<string>();

    const firstLookup = session.begin("hover");
    const secondLookup = session.begin("hover");

    expect(session.complete(firstLookup, "huis")).toEqual({
      status: "stale",
    });
    expect(session.complete(secondLookup, "woning")).toEqual({
      status: "current",
      context: "hover",
      value: "woning",
    });
  });

  it("keeps selection as the active lookup context when it replaces hover", () => {
    const session = new LookupSession<string>();

    const hoverLookup = session.begin("hover");
    const selectionLookup = session.begin("selection");

    expect(session.activeContext).toBe("selection");
    expect(session.complete(hoverLookup, "huis")).toEqual({
      status: "stale",
    });
    expect(session.complete(selectionLookup, "het huis")).toEqual({
      status: "current",
      context: "selection",
      value: "het huis",
    });
  });

  it("clearing the active lookup makes in-flight results stale", () => {
    const session = new LookupSession<string>();

    const lookup = session.begin("selection");
    session.clear();

    expect(session.activeContext).toBeNull();
    expect(session.complete(lookup, "huis")).toEqual({
      status: "stale",
    });
  });

  it("keeps the tooltip active on mouse leave for selection lookups only", () => {
    const session = new LookupSession<string>();

    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(false);

    session.begin("hover");
    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(false);

    session.begin("selection");
    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(true);

    session.clear();
    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(false);
  });

  it("recognizes when selection lookup state should keep control of the session", () => {
    const session = new LookupSession<string>();

    expect(session.hasActiveSelectionControl()).toBe(false);

    session.begin("hover");
    expect(session.hasActiveSelectionControl()).toBe(false);

    session.begin("selection");
    expect(session.hasActiveSelectionControl()).toBe(true);

    session.clear();
    expect(session.hasActiveSelectionControl()).toBe(false);
  });

  it("accepts an error only when it belongs to the current lookup", () => {
    const session = new LookupSession<never>();

    const firstLookup = session.begin("hover");
    const secondLookup = session.begin("hover");

    expect(session.fail(firstLookup, "timed out")).toEqual({
      status: "stale",
    });
    expect(session.fail(secondLookup, "timed out")).toEqual({
      status: "current",
      context: "hover",
      value: "timed out",
    });
  });
});
