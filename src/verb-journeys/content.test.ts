import { describe, expect, it } from "vitest";
import { getVerbJourneyPack, isVerbJourneyContentAvailable, verbJourneyPack, verbJourneyPacks, validateVerbJourneyPack, validateVerbJourneyRegistry } from "./content";

describe("werken Verb Journey pack", () => {
  it("provides the complete stable read-only map and staged journeys", () => {
    expect(validateVerbJourneyPack(verbJourneyPack)).toEqual([]);
    expect(verbJourneyPack.verb.id).toBe("verb.werken");
    expect(verbJourneyPack.contentVersion).toBe("019-1");
    expect(verbJourneyPack.dutchForms).toHaveLength(8);
    expect(new Set(verbJourneyPack.dutchForms.map((form) => form.dutchTense)).size).toBe(8);
    expect(verbJourneyPack.englishComparison).toHaveLength(12);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "present")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "past")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.filter((record) => record.group === "future")).toHaveLength(4);
    expect(verbJourneyPack.englishComparison.every((record) => record.english && record.situation && record.meaningPreservingDutch && record.commonEverydayDutch && record.mismatchNote)).toBe(true);
    expect(verbJourneyPack.englishComparison.every((record) => record.meaningPreserving?.nl && record.meaningPreserving.en && record.meaningPreserving.te && record.meaningPreserving.form && record.everyday?.nl && record.everyday.en && record.everyday.te && record.everyday.form && record.cue?.display && record.cue.shortMeaning && record.cue.tokens.length && record.howDutchExpressesIt && record.whyTheyDiffer)).toBe(true);
    expect(verbJourneyPack.englishComparison[1]).toMatchObject({
      meaningPreserving: { nl: "Ik ben nu thuis aan het werken.", form: "OTT" },
      everyday: { nl: "Ik werk nu thuis.", form: "OTT" },
      cue: { display: "nu", kind: "current-time" },
    });
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

  it("requires complete localized form records for the multilingual content version", () => {
    const invalid = structuredClone(verbJourneyPack);
    invalid.contentVersion = "015-2" as never;
    invalid.dutchForms = invalid.dutchForms.map(({ learnerLabelEn, canonicalExample, commonUsageExample, ...form }) => form) as never;

    expect(validateVerbJourneyPack(invalid)).toEqual(expect.arrayContaining([
      expect.stringContaining("learnerLabelEn"),
      expect.stringContaining("canonicalExample"),
      expect.stringContaining("commonUsageExample"),
    ]));
  });

  it("accepts a migrated localized form record without changing its stable identity", () => {
    const migrated = structuredClone(verbJourneyPack);
    migrated.contentVersion = "015-2" as never;
    migrated.dutchForms = migrated.dutchForms.map((form) => ({
      ...form,
      learnerLabelEn: form.fullNameNl,
      canonicalExample: { nl: form.sentence, en: form.naturalEnglish, te: form.sentence },
      commonUsageExample: { nl: form.commonUsage, en: form.naturalEnglish, te: form.sentence },
    }));

    expect(validateVerbJourneyPack(migrated)).toEqual([]);
    expect(migrated.dutchForms.map((form) => form.id)).toEqual(verbJourneyPack.dutchForms.map((form) => form.id));
  });

  it("requires the additive English comparison contract for the 019 content version", () => {
    const invalid = structuredClone(verbJourneyPack);
    invalid.contentVersion = "019-1" as never;
    invalid.englishComparison = invalid.englishComparison.map(({ meaningPreserving, everyday, cue, howDutchExpressesIt, whyTheyDiffer, ...record }) => record) as never;

    expect(validateVerbJourneyPack(invalid)).toEqual(expect.arrayContaining([
      expect.stringContaining("meaningPreserving"),
      expect.stringContaining("everyday"),
      expect.stringContaining("cue"),
    ]));
  });

  it("accepts two localized comparison roles and authored cues without changing stable identities", () => {
    const migrated = structuredClone(verbJourneyPack);
    migrated.contentVersion = "019-1" as never;
    migrated.englishComparison = migrated.englishComparison.map((record) => ({
      ...record,
      meaningPreserving: { nl: record.meaningPreservingDutch, en: record.english, te: "తెలుగు", form: record.dutchAnalysis.primaryForm ?? "OTT" },
      everyday: { nl: record.commonEverydayDutch, en: record.english, te: "తెలుగు", form: record.dutchAnalysis.primaryForm ?? "OTT" },
      cue: { display: "nu", shortMeaning: "happening now", kind: "current-time", tokens: ["nu"] },
      howDutchExpressesIt: "A reviewed Dutch construction carries the meaning.",
      whyTheyDiffer: record.mismatchNote,
    })) as never;

    expect(validateVerbJourneyPack(migrated)).toEqual([]);
    expect(migrated.englishComparison.map((record) => record.id)).toEqual(verbJourneyPack.englishComparison.map((record) => record.id));
  });

  it("adds a validated zijn pack without changing werken identity", () => {
    const zijn = getVerbJourneyPack("verb.zijn");
    expect(zijn).not.toBeNull();
    expect(validateVerbJourneyPack(zijn!)).toEqual([]);
    expect(zijn!.contentVersion).toBe("019-1");
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
    expect(hebben!.contentVersion).toBe("019-1");
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

  it("qualifies the English comparison contract across every registered pack", () => {
    expect(verbJourneyPacks).toHaveLength(4);
    for (const pack of verbJourneyPacks) {
      expect(["019-1", "020-2"]).toContain(pack.contentVersion);
      expect(pack.englishComparison).toHaveLength(12);
      expect(pack.englishComparison.every((record) => record.meaningPreserving && record.everyday && record.cue && record.howDutchExpressesIt && record.whyTheyDiffer)).toBe(true);
      expect(new Set(pack.englishComparison.map((record) => record.id)).size).toBe(12);
    }
    expect(new Set(verbJourneyPacks.flatMap((pack) => pack.englishComparison.map((record) => record.id))).size).toBe(48);
  });

  it("qualifies all active packs with complete localized form and common-use records", () => {
    expect(validateVerbJourneyRegistry()).toEqual([]);
    const forms = verbJourneyPacks.flatMap((pack) => pack.dutchForms);
    expect(forms).toHaveLength(32);
    expect(forms.every((form) => form.learnerLabelEn && form.canonicalExample?.nl && form.canonicalExample.en && form.canonicalExample.te && form.commonUsageExample?.nl && form.commonUsageExample.en && form.commonUsageExample.te)).toBe(true);
    expect(forms.flatMap((form) => [form.canonicalExample!.nl, form.canonicalExample!.en, form.canonicalExample!.te, form.commonUsageExample!.nl, form.commonUsageExample!.en, form.commonUsageExample!.te])).not.toContain("Unavailable");
    expect(new Set(forms.map((form) => form.id)).size).toBe(32);
  });

  it("keeps gaan map and English comparison examples in one sentence family", () => {
    const gaan = getVerbJourneyPack("verb.gaan")!;
    const mapSentences = gaan.dutchForms.flatMap((form) => [form.canonicalExample!.nl, form.commonUsageExample!.nl]);
    expect(mapSentences.every((sentence) => sentence.includes("naar het station"))).toBe(true);
    expect(new Set(mapSentences).size).toBe(8);
    expect(gaan.englishComparison.every((record) => record.meaningPreserving?.nl.includes("naar het station") && record.everyday?.nl.includes("naar het station"))).toBe(true);
  });
});
