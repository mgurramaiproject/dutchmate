import { describe, expect, it } from "vitest";
import { WebpageLookupSession, type TranslationOutcome } from "./webpage-lookup-session";

const singleWordOutcome: TranslationOutcome = {
  response: {
    ok: true,
    result: {
      translatedText: "house",
      providerName: "custom-endpoint",
    },
  },
  sourceLanguage: "nl",
  responses: [{ targetLanguage: "en", response: { ok: true, result: { translatedText: "house", providerName: "custom-endpoint" } } }],
};

describe("WebpageLookupSession", () => {
  it("keeps typed translation evidence only for the current lookup", () => {
    const session = new WebpageLookupSession();
    const requestId = session.begin("selection");

    expect(session.acceptSuccess(requestId, "huis", singleWordOutcome)).toEqual({
      status: "current",
      context: "selection",
      response: singleWordOutcome.response,
      sourceLanguage: singleWordOutcome.sourceLanguage,
      responses: singleWordOutcome.responses,
    });
  });

  it("keeps typed translation evidence for the current hover lookup", () => {
    const session = new WebpageLookupSession();
    const requestId = session.begin("hover");

    expect(session.acceptSuccess(requestId, "huis", singleWordOutcome)).toEqual({
      status: "current",
      context: "hover",
      response: singleWordOutcome.response,
      sourceLanguage: singleWordOutcome.sourceLanguage,
      responses: singleWordOutcome.responses,
    });
  });

  it("treats an older successful lookup as stale after a newer one starts", () => {
    const session = new WebpageLookupSession();
    const firstRequestId = session.begin("hover");
    session.begin("selection");

    expect(session.acceptSuccess(firstRequestId, "huis", singleWordOutcome)).toEqual({
      status: "stale",
    });
  });

  it("treats an older failed lookup as stale after a newer one starts", () => {
    const session = new WebpageLookupSession();
    const firstRequestId = session.begin("hover");
    session.begin("selection");

    expect(session.acceptFailure(firstRequestId, "timed out")).toEqual({
      status: "stale",
    });
  });

  it("recovers cleanly on the next lookup after a failed request", () => {
    const session = new WebpageLookupSession();
    const failedRequestId = session.begin("hover");

    expect(session.acceptFailure(failedRequestId, "Translation request timed out before the backend responded.")).toEqual({
      status: "current",
      context: "hover",
      error: "Translation request timed out before the backend responded.",
    });

    const recoveredRequestId = session.begin("hover");

    expect(session.acceptSuccess(recoveredRequestId, "huis", singleWordOutcome)).toEqual({
      status: "current",
      context: "hover",
      response: singleWordOutcome.response,
      sourceLanguage: singleWordOutcome.sourceLanguage,
      responses: singleWordOutcome.responses,
    });
  });

  it("keeps selection lifecycle rules behind the same interface", () => {
    const session = new WebpageLookupSession();

    expect(session.hasActiveSelectionControl()).toBe(false);

    session.begin("selection");

    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(true);
    expect(session.hasActiveSelectionControl()).toBe(true);

    session.clear();

    expect(session.shouldKeepVisibleOnMouseLeave()).toBe(false);
    expect(session.hasActiveSelectionControl()).toBe(false);
  });
});
