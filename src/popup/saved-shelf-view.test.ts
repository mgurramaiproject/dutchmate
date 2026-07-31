import { describe, expect, it } from "vitest";
import { getSavedShelfView, sortSavedItems } from "./saved-shelf-view";
import type { LearningItem } from "../vocabulary/learning-record";

const item = (dutch: string, createdAt: number, values: Partial<LearningItem> = {}): LearningItem => ({
  id: `nl\u001f${dutch}`,
  learningLanguage: "nl",
  normalizedDutch: dutch,
  dutch,
  kind: dutch.includes(" ") ? "chunk" : "word",
  english: null,
  telugu: null,
  sources: [],
  contexts: [],
  encounters: { count: 0, lastEncounterAt: null },
  recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null },
  recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null },
  createdAt,
  updatedAt: createdAt,
  ...values,
});

describe("getSavedShelfView", () => {
  const earliest = item("appel", 10, { english: "apple", telugu: "ఆపిల్" });
  const newest = item("zebra", 30, {
    english: "zebra",
    recognition: { state: "strong", dueAt: 1, intervalDays: 7, attemptCount: 3, successfulStreak: 3, lastPractisedAt: 1 },
    recall: { state: "familiar", dueAt: 1, intervalDays: 3, attemptCount: 2, successfulStreak: 2, lastPractisedAt: 1 },
  });
  const middle = item("boek", 20, { telugu: "పుస్తకం" });

  it("uses newest-first by default while retaining chronological shelf numbers", () => {
    const view = getSavedShelfView([middle, earliest, newest]);

    expect(view).toMatchObject({ status: "ready", sort: "newest", count: 3 });
    if (view.status !== "ready") throw new Error("Expected saved items.");
    expect(view.items.map(({ dutch, shelfNumber, mastery, english, telugu }) => ({ dutch, shelfNumber, mastery, english, telugu }))).toEqual([
      { dutch: "zebra", shelfNumber: 3, mastery: "Familiar", english: "zebra", telugu: "Unavailable" },
      { dutch: "boek", shelfNumber: 2, mastery: "New", english: "Unavailable", telugu: "పుస్తకం" },
      { dutch: "appel", shelfNumber: 1, mastery: "New", english: "apple", telugu: "ఆపిల్" },
    ]);
  });

  it("sorts A-Z without changing item data or its stable shelf number", () => {
    const view = getSavedShelfView([newest, middle, earliest], { sort: "alphabetical" });

    if (view.status !== "ready") throw new Error("Expected saved items.");
    expect(view.items.map(({ dutch, shelfNumber }) => [dutch, shelfNumber])).toEqual([["appel", 1], ["boek", 2], ["zebra", 3]]);
  });

  it("uses the same deterministic newest-first order for equal save timestamps", () => {
    const sameTimestamp = item("aardappel", 30);

    expect(sortSavedItems([newest, sameTimestamp], "newest").map(({ dutch }) => dutch)).toEqual([
      "zebra",
      "aardappel",
    ]);
  });

  it("expands only the selected item with safe latest provenance and capped context", () => {
    const withDetails = item("straat", 40, {
      sources: [{ type: "lesson", lessonId: "lesson-1", addedAt: 20 }, { type: "webpage", addedAt: 30, providerName: "private provider" }],
      contexts: [{ text: "Ik woon aan deze straat.", addedAt: 25 }, { text: "De straat is vandaag rustig.", addedAt: 35 }],
    });
    const view = getSavedShelfView([earliest, withDetails], { expandedItemId: withDetails.id });

    if (view.status !== "ready") throw new Error("Expected saved items.");
    expect(view.items.map(({ dutch, expanded, details }) => ({ dutch, expanded, details }))).toEqual([
      { dutch: "straat", expanded: true, details: { source: "Saved from webpage", contexts: [{ text: "De straat is vandaag rustig.", originalLabel: "Original context · Language not detected", englishTranslation: null, teluguTranslation: null }, { text: "Ik woon aan deze straat.", originalLabel: "Original context · Language not detected", englishTranslation: null, teluguTranslation: null }] } },
      { dutch: "appel", expanded: false, details: undefined },
    ]);
    expect(JSON.stringify(view)).not.toContain("private provider");
    expect(getSavedShelfView([earliest], { expandedItemId: withDetails.id })).not.toMatchObject({ status: "ready", items: [{ expanded: true }] });
  });

  it("presents three newest contexts with provenance and only relevant helper translations", () => {
    const withContexts = item("huis", 50, {
      contexts: [
        { text: "Old context", addedAt: 10 },
        { text: "Een huis staat daar.", addedAt: 20, sourceLanguage: "nl", english: "A house stands there.", telugu: null },
        { text: "A house stands here.", addedAt: 30, sourceLanguage: "en", english: "A house stands here.", telugu: "ఇక్కడ ఒక ఇల్లు ఉంది." },
        { text: "ఇల్లు ఇక్కడ ఉంది.", addedAt: 40, sourceLanguage: "te", english: "The house is here.", telugu: "ఇల్లు ఇక్కడ ఉంది." },
      ],
    });
    const view = getSavedShelfView([withContexts], { expandedItemId: withContexts.id });

    if (view.status !== "ready") throw new Error("Expected saved items.");
    expect(view.items[0].details?.contexts).toEqual([
      { text: "ఇల్లు ఇక్కడ ఉంది.", originalLabel: "Original context · Telugu", englishTranslation: "The house is here.", teluguTranslation: null },
      { text: "A house stands here.", originalLabel: "Original context · English", englishTranslation: null, teluguTranslation: "ఇక్కడ ఒక ఇల్లు ఉంది." },
      { text: "Een huis staat daar.", originalLabel: "Original context · Dutch", englishTranslation: "A house stands there.", teluguTranslation: null },
    ]);
  });

  it("caps displayed Page context even if an invalid record reaches the presentation seam", () => {
    const longContext = item("lang", 50, { contexts: [{ text: `lang ${"x".repeat(300)}`, addedAt: 50 }] });
    const view = getSavedShelfView([longContext], { expandedItemId: longContext.id });

    if (view.status !== "ready") throw new Error("Expected saved items.");
    expect(view.items[0].details?.contexts[0].text).toHaveLength(240);
  });

  it("exposes a safe authored Verb Journey link only for a resolved werken form", () => {
    const resolved = getSavedShelfView([item("werk", 50)]);
    const unresolved = getSavedShelfView([item("werking", 50)]);

    if (resolved.status !== "ready" || unresolved.status !== "ready") throw new Error("Expected saved items.");
    expect(resolved.items[0].verbJourney).toEqual({ verbId: "verb.werken", lemma: "werken", form: "OTT", journeyId: null });
    expect(unresolved.items[0].verbJourney).toBeUndefined();
  });

  it("models loading, recoverable error, and an actionable empty collection", () => {
    expect(getSavedShelfView([], { loading: true })).toMatchObject({ status: "loading" });
    expect(getSavedShelfView([], { error: "Local read failed" })).toMatchObject({ status: "error", message: "Local read failed" });
    expect(getSavedShelfView([])).toMatchObject({ status: "empty" });
  });
});
