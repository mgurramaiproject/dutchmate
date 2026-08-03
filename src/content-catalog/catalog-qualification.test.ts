import { describe, expect, it } from "vitest";
import { contentCatalog, validateContentCatalog } from "./index";
import { lessonCatalog, validateLessonCatalog } from "../lessons/catalog";
import { grammarPatterns, validateAllLearningContent } from "../grammar/content";
import { contrastPack, validateContrastPack } from "../grammar/contrast";
import { validateVerbJourneyRegistry, verbJourneyPacks } from "../verb-journeys/content";

describe("complete content catalog qualification", () => {
  it("contains every released package exactly once across the four families", () => {
    const manifest = contentCatalog.manifest();
    expect(manifest).toHaveLength(24);
    expect(new Set(manifest.map((entry) => entry.id)).size).toBe(manifest.length);
    expect(manifest.filter((entry) => entry.family === "lesson")).toHaveLength(15);
    expect(manifest.filter((entry) => entry.family === "grammar")).toHaveLength(4);
    expect(manifest.filter((entry) => entry.family === "contrast")).toHaveLength(1);
    expect(manifest.filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
  });

  it("qualifies package envelopes and all runtime content contracts", () => {
    expect(contentCatalog.manifest().every((entry) => entry.releaseStatus === "released" && entry.schemaVersion === 1)).toBe(true);
    expect(lessonCatalog.lessons).toHaveLength(15);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(validateAllLearningContent(lessonCatalog, grammarPatterns)).toEqual([]);
    expect(validateContrastPack(contrastPack)).toEqual([]);
    expect(validateVerbJourneyRegistry(verbJourneyPacks)).toEqual([]);
    expect(contentCatalog.manifest().map((entry) => contentCatalog.getLesson(entry.id) ?? contentCatalog.getGrammarPattern(entry.id) ?? contentCatalog.getContrastPack(entry.id) ?? contentCatalog.getVerbJourneyPack(entry.id)).every((payload) => payload !== null)).toBe(true);
    expect(contentCatalog.validate()).toEqual([]);
    expect(validateContentCatalog()).toEqual([]);
  });
});
