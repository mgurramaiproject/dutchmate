import { describe, expect, it } from "vitest";
import { getVerbJourneyPack, isVerbJourneyContentAvailable, verbJourneyPack, validateVerbJourneyPack } from "./content";

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
    const storyLines = verbJourneyPack.journeys.flatMap((journey) => journey.story);
    expect(storyLines.some((line) => /Groningen/u.test(line.nl))).toBe(false);
    expect(storyLines.every((line) => /\bik\b/iu.test(line.nl))).toBe(true);
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

  it("adds a validated zijn pack without changing werken identity", () => {
    const zijn = getVerbJourneyPack("verb.zijn");
    expect(zijn).not.toBeNull();
    expect(validateVerbJourneyPack(zijn!)).toEqual([]);
    expect(zijn!.contentVersion).toBe("016-1");
    expect(zijn!.verb).toMatchObject({ id: "verb.zijn", lemma: "zijn", auxiliary: "zijn" });
    expect(zijn!.dutchForms).toHaveLength(8);
    expect(zijn!.englishComparison).toHaveLength(12);
    expect(zijn!.journeys).toHaveLength(6);
    expect(zijn!.journeys.map((journey) => journey.id)).toEqual([
      "journey.zijn.ott-identity",
      "journey.zijn.ott-questions",
      "journey.zijn.ovt-state",
      "journey.zijn.vtt-experience",
      "journey.zijn.future-conditional",
      "journey.zijn.reference-completed",
    ]);
    expect(zijn!.journeys[0].story).toHaveLength(5);
    expect(zijn!.journeys[0].story.every((line) => line.targets.every((target) => line.nl.includes(target.text)))).toBe(true);
    expect(isVerbJourneyContentAvailable("verb.zijn")).toBe(true);
    expect(verbJourneyPack.verb.id).toBe("verb.werken");
  });

  it("adds the first hebben journey through the additive registry", () => {
    const hebben = getVerbJourneyPack("verb.hebben");
    expect(hebben).not.toBeNull();
    expect(validateVerbJourneyPack(hebben!)).toEqual([]);
    expect(hebben!.contentVersion).toBe("017-1");
    expect(hebben!.verb).toMatchObject({ id: "verb.hebben", lemma: "hebben", english: "to have", auxiliary: "hebben" });
    expect(hebben!.dutchForms).toHaveLength(8);
    expect(hebben!.englishComparison).toHaveLength(12);
    expect(hebben!.journeys.map((journey) => journey.id)).toEqual([
      "journey.hebben.ott-possession",
      "journey.hebben.ott-expressions",
      "journey.hebben.ovt-possession",
      "journey.hebben.vtt-experience",
      "journey.hebben.vtt-auxiliary",
      "journey.hebben.future-reference",
    ]);
    expect(hebben!.journeys.every((journey) => journey.story.length > 0 && journey.notice)).toBe(true);
    expect(hebben!.journeys.find((journey) => journey.id === "journey.hebben.vtt-experience")?.notice?.title).toBe("Having had the experience");
    expect(hebben!.journeys.find((journey) => journey.id === "journey.hebben.vtt-auxiliary")?.notice?.title).toBe("Choosing the practical auxiliary");
    expect(hebben!.journeys.find((journey) => journey.id === "journey.hebben.future-reference")?.notice?.title).toBe("Looking ahead with hebben");
    expect(hebben!.journeys[0].story).toHaveLength(5);
    expect(hebben!.journeys[0].story.every((line) => line.targets.every((target) => line.nl.includes(target.text)))).toBe(true);
    expect(isVerbJourneyContentAvailable("verb.hebben")).toBe(true);
    expect(verbJourneyPack.verb.id).toBe("verb.werken");
  });
});
