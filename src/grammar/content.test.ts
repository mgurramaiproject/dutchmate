import { describe, expect, it } from "vitest";
import { createGrammarContentReport, grammarPatterns, hebbenPattern, inversionPattern, isGrammarContentAvailable, matchGrammarEncounter, matchIntroducedGrammarEncounter, matchIntroducedZijnEncounter, matchZijnEncounter, regularPattern, validateAllLearningContent, validateGrammarPattern, validateLearningContent, zijnPattern } from "./content";
import { lessonCatalog } from "../lessons/catalog";

describe("zijn grammar content", () => {
  it("has finite reviewed answers, coded distractors, and exact feedback", () => {
    expect(validateGrammarPattern(zijnPattern)).toEqual([]);
    expect(zijnPattern.exercises).toHaveLength(4);
    expect(new Set(zijnPattern.exercises.map((exercise) => exercise.primitive)).size).toBeGreaterThan(1);
  });

  it("adds the reviewed hebben pattern with both polite forms accepted", () => {
    expect(validateGrammarPattern(hebbenPattern)).toEqual([]);
    const polite = hebbenPattern.exercises.find((exercise) => exercise.id === "hebben-contrast-u")!;
    expect(polite.accepted).toEqual(["hebt", "heeft"]);
    expect(polite.distractors.map((distractor) => distractor.value)).not.toContain("hebt");
    expect(polite.distractors.map((distractor) => distractor.value)).not.toContain("heeft");
    expect(validateAllLearningContent()).toEqual([]);
  });

  it("matches only exact reviewed subject-form pairs", () => {
    expect(matchZijnEncounter("IK BEN.")).toEqual({ subject: "ik", form: "ben" });
    expect(matchZijnEncounter("jij bent")).toEqual({ subject: "jij", form: "bent" });
    expect(matchZijnEncounter("ben")).toBeNull();
    expect(matchZijnEncounter("ik ben hier")).toBeNull();
    expect(matchZijnEncounter("ik bent")).toBeNull();
    expect(matchIntroducedZijnEncounter("ik ben", false)).toBeNull();
    expect(matchIntroducedZijnEncounter("ik ben", true)).toEqual({ subject: "ik", form: "ben" });
  });

  it("matches introduced hebben encounters without matching before introduction", () => {
    expect(matchGrammarEncounter("u heeft", hebbenPattern)).toEqual({ patternId: "a0-hebben-present", subject: "u", form: "heeft" });
    expect(matchIntroducedGrammarEncounter("u hebt", [], [hebbenPattern])).toBeNull();
    expect(matchIntroducedGrammarEncounter("u hebt", ["a0-hebben-present"], [hebbenPattern])).toEqual({ patternId: "a0-hebben-present", subject: "u", form: "hebt" });
  });

  it("adds regular present agreement across the reviewed verb inventory", () => {
    expect(validateGrammarPattern(regularPattern)).toEqual([]);
    expect(regularPattern.forms.find((entry) => entry.subject === "jij/je")?.forms).toEqual(["woont", "werkt", "leert", "maakt"]);
    expect(regularPattern.exercises.map((exercise) => exercise.contextTag)).toEqual(["home", "work", "learning", "plans"]);
    expect(matchGrammarEncounter("jij werkt", regularPattern)).toEqual({ patternId: "a0-regular-present", subject: "jij", form: "werkt" });
    expect(matchIntroducedGrammarEncounter("u leert", [], [regularPattern])).toBeNull();
    expect(matchIntroducedGrammarEncounter("u leert", ["a0-regular-present"], [regularPattern])).toEqual({ patternId: "a0-regular-present", subject: "u", form: "leert" });
    expect(createGrammarContentReport()).toContain("regular-change-jij");
  });

  it("adds reviewed yes-no inversion with token ordering and precise contrast feedback", () => {
    expect(validateGrammarPattern(inversionPattern)).toEqual([]);
    expect(inversionPattern.exercises.map((exercise) => exercise.primitive)).toEqual(["order-tokens", "order-tokens", "contrast-form", "repair-choice"]);
    const jij = inversionPattern.exercises.find((exercise) => exercise.id === "inversion-order-je")!;
    expect(jij.tokens).toEqual(["Woon", "je", "hier?"]);
    expect(jij.accepted).toEqual(["Woon je hier?"]);
    expect(jij.distractors).toEqual(expect.arrayContaining([expect.objectContaining({ value: "Je woont hier?", misconception: "wrong-person" })]));
    const u = inversionPattern.exercises.find((exercise) => exercise.id === "inversion-order-u")!;
    expect(u.distractors).toEqual(expect.arrayContaining([expect.objectContaining({ value: "Werk u vandaag?", misconception: "wrong-person" }), expect.objectContaining({ value: "U werkt vandaag?", misconception: "invalid-order" })]));
    expect(matchGrammarEncounter("Woon je hier?", inversionPattern)).toEqual({ patternId: "a0-yes-no-inversion", subject: "je", form: "woon" });
    expect(matchIntroducedGrammarEncounter("Woon je hier?", [], [inversionPattern])).toBeNull();
    expect(matchIntroducedGrammarEncounter("Woon je hier?", ["a0-yes-no-inversion"], [inversionPattern])).toEqual({ patternId: "a0-yes-no-inversion", subject: "je", form: "woon" });
    expect(createGrammarContentReport()).toContain("inversion-order-u");
  });

  it("generates a deterministic review report with every released exercise", () => {
    const report = createGrammarContentReport();
    expect(report).toContain("Author: DutchMate team");
    expect(report).toContain("zijn-choose-ik");
    expect(report).toContain("hebben-contrast-u");
    expect(report).toContain("Voor mijn Nederlandse les heb ik een pen nodig.");
    expect(report).toContain("https://taaladvies.net/u-heeft-of-hebt/");
    expect(report).toContain("Distractor: bent [wrong-person]");
    expect(createGrammarContentReport()).toBe(report);
  });

  it("rejects unsupported primitives and missing review provenance", () => {
    const invalid = structuredClone(zijnPattern);
    invalid.review.sources = [];
    invalid.exercises[0].primitive = "unsupported" as never;
    expect(validateGrammarPattern(invalid)).toEqual(expect.arrayContaining(["a0-zijn-present.review: incomplete review metadata or provenance", "zijn-choose-ik: unsupported primitive"]));
  });

  it("extends the lesson validator with the companion link", () => {
    const invalidCatalog = { version: 1 as const, lessons: [] };
    expect(validateLearningContent(zijnPattern, invalidCatalog)).toContain("a0-zijn-present.companionLessonId: lesson is missing from the bundled catalog");
  });

  it("requires a complete four-pattern pack and second review for every release item", () => {
    const missingPattern = grammarPatterns.filter((pattern) => pattern.id !== "a0-regular-present");
    expect(validateAllLearningContent(lessonCatalog, missingPattern)).toContain("grammar pack: expected exactly the four shipped A0 pattern IDs");

    const draftPattern = structuredClone(zijnPattern);
    draftPattern.review.reviewState = "self-reviewed";
    expect(validateGrammarPattern(draftPattern)).toContain("a0-zijn-present.review: requires second review before runtime release");
    expect(isGrammarContentAvailable(draftPattern)).toBe(false);

    const draftExercise = structuredClone(zijnPattern);
    draftExercise.exercises[0].review.reviewState = "self-reviewed";
    expect(validateGrammarPattern(draftExercise)).toContain("zijn-choose-ik.review: requires second review before runtime release");

    expect(grammarPatterns.every((pattern) => pattern.exercises.every((exercise) => exercise.review.reviewState === "second-review-complete"))).toBe(true);
  });

  it("requires every released choice to be classified as accepted or a distractor", () => {
    const invalid = structuredClone(zijnPattern);
    invalid.exercises[0].choices.push("onbekend");
    expect(validateGrammarPattern(invalid)).toContain("zijn-choose-ik: every choice must be accepted or a coded distractor");

    const report = createGrammarContentReport();
    expect(report.match(/Exercise review state:/g)).toHaveLength(16);
  });
});
