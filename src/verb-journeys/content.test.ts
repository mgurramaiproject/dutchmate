import { describe, expect, it } from "vitest";
import { verbJourneyPack, validateVerbJourneyPack } from "./content";

describe("werken Verb Journey pack", () => {
  it("provides the complete stable read-only map and staged journeys", () => {
    expect(validateVerbJourneyPack(verbJourneyPack)).toEqual([]);
    expect(verbJourneyPack.verb.id).toBe("verb.werken");
    expect(verbJourneyPack.dutchForms).toHaveLength(8);
    expect(new Set(verbJourneyPack.dutchForms.map((form) => form.dutchTense)).size).toBe(8);
    expect(verbJourneyPack.journeys.map((journey) => journey.id)).toEqual([
      "journey.werken.ott-routine",
      "journey.werken.vtt-completed",
      "journey.werken.ovt-background",
      "journey.werken.vvt-earlier-past",
      "journey.werken.future-possibility",
      "journey.werken.reference-completed-future",
    ]);
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
