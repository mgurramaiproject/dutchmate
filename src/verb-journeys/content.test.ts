import { describe, expect, it } from "vitest";
import { verbJourneyPack, validateVerbJourneyPack } from "./content";

describe("werken Verb Journey pack", () => {
  it("provides the complete stable read-only map and staged journeys", () => {
    expect(validateVerbJourneyPack(verbJourneyPack)).toEqual([]);
    expect(verbJourneyPack.verb.id).toBe("verb.werken");
    expect(verbJourneyPack.dutchForms).toHaveLength(8);
    expect(new Set(verbJourneyPack.dutchForms.map((form) => form.dutchTense)).size).toBe(8);
    expect(verbJourneyPack.englishComparison).toHaveLength(12);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "present")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "past")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "future")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.every((record) => record.english && record.situation && record.meaningPreservingDutch && record.commonEverydayDutch && record.mismatchNote)).toBe(true);
    expect(verbJourneyPack.journeys.map((journey) => journey.id)).toEqual([
      "journey.werken.ott-routine",
      "journey.werken.vtt-completed",
      "journey.werken.ovt-background",
      "journey.werken.vvt-earlier-past",
      "journey.werken.future-possibility",
      "journey.werken.reference-completed-future",
    ]);
    expect(verbJourneyPack.journeys.every((journey) => journey.story.length > 0 && journey.notice)).toBe(true);
    expect(verbJourneyPack.journeys.map((journey) => journey.story.length)).toEqual([5, 5, 5, 5, 5, 5]);
    expect(verbJourneyPack.journeys.flatMap((journey) => journey.story).some((line) => /Groningen|\bIk\b/u.test(line.nl))).toBe(false);
  });

  it("rejects duplicate identifiers and dangling target forms", () => {
    const invalid = structuredClone(verbJourneyPack);
    invalid.dutchForms[1].id = invalid.dutchForms[0].id;
    invalid.journeys[0].targetForms = ["NOT-A-FORM"] as never;
    expect(validateVerbJourneyPack(invalid)).toEqual(expect.arrayContaining([
      expect.stringContaining("duplicate stable identifier"),
      expect.stringContaining("targetForms"),
    ]));
  });

  it("rejects story targets that are not present in their Dutch line", () => {
    const invalid = structuredClone(verbJourneyPack);
    invalid.journeys[1].story[0].targets[0].text = "ontbreekt";
    expect(validateVerbJourneyPack(invalid)).toContain("journey.werken.vtt-completed.story[0].targets[0]: target text is not present in line");
  });
});
