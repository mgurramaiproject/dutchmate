import { describe, expect, it } from "vitest";
import type { LearningItem } from "../vocabulary/learning-record";
import { resolveSavedVerbJourney } from "./saved-link";

const item = (dutch: string, normalizedDutch = dutch): LearningItem => ({
  id: `nl\u001f${normalizedDutch}`,
  learningLanguage: "nl",
  normalizedDutch,
  dutch,
  kind: dutch.includes(" ") ? "chunk" : "word",
  english: null,
  telugu: null,
  sources: [],
  contexts: [],
  encounters: { count: 0, lastEncounterAt: null },
  recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null },
  recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null },
  createdAt: 1,
  updatedAt: 1,
});

describe("Saved Verb Journey linking", () => {
  it("resolves only authored werken forms to a stable verb and Dutch form", () => {
    expect(resolveSavedVerbJourney(item("werk"))).toMatchObject({ verbId: "verb.werken", lemma: "werken", form: "OTT" });
    expect(resolveSavedVerbJourney(item("werkte"))).toMatchObject({ form: "OVT" });
    expect(resolveSavedVerbJourney(item("heb gewerkt"))).toMatchObject({ form: "VTT", journeyId: "journey.werken.vtt-completed" });
  });

  it("does not invent a lemma for unsupported or inconsistent saved text", () => {
    expect(resolveSavedVerbJourney(item("werking"))).toBeNull();
    expect(resolveSavedVerbJourney(item("werk", "niet-werk"))).toBeNull();
  });
});
