import { describe, expect, it } from "vitest";
import { contentCatalog, validateContentCatalog, validateContentPackage } from "./index";
import { validatePracticalDutchTopic } from "./practical-dutch";
import { lessonCatalog, validateLessonCatalog } from "../lessons/catalog";
import { grammarPatterns, validateAllLearningContent } from "../grammar/content";
import { contrastPack, validateContrastPack } from "../grammar/contrast";
import { validateVerbJourneyRegistry, verbJourneyPacks } from "../verb-journeys/content";

describe("complete content catalog qualification", () => {
  it("contains every released package exactly once across the four families", () => {
    const manifest = contentCatalog.manifest();
    expect(manifest).toHaveLength(25);
    expect(new Set(manifest.map((entry) => entry.id)).size).toBe(manifest.length);
    expect(manifest.filter((entry) => entry.family === "lesson")).toHaveLength(15);
    expect(manifest.filter((entry) => entry.family === "grammar")).toHaveLength(4);
    expect(manifest.filter((entry) => entry.family === "contrast")).toHaveLength(1);
    expect(manifest.filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
    expect(manifest.filter((entry) => entry.family === "practical-dutch")).toHaveLength(1);
  });

  it("qualifies package envelopes and all runtime content contracts", () => {
    expect(contentCatalog.manifest().every((entry) => entry.releaseStatus === "released" && entry.schemaVersion === 1)).toBe(true);
    expect(lessonCatalog.lessons).toHaveLength(15);
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
    expect(validateAllLearningContent(lessonCatalog, grammarPatterns)).toEqual([]);
    expect(validateContrastPack(contrastPack)).toEqual([]);
    expect(validateVerbJourneyRegistry(verbJourneyPacks)).toEqual([]);
    expect(contentCatalog.manifest().map((entry) => contentCatalog.getLesson(entry.id) ?? contentCatalog.getGrammarPattern(entry.id) ?? contentCatalog.getContrastPack(entry.id) ?? contentCatalog.getVerbJourneyPack(entry.id) ?? contentCatalog.getPracticalDutchTopic(entry.id)).every((payload) => payload !== null)).toBe(true);
    expect(contentCatalog.validate()).toEqual([]);
    expect(validateContentCatalog()).toEqual([]);
    const topic = contentCatalog.getPracticalDutchTopic();
    expect(topic).toMatchObject({ id: "practical-dutch-supermarket-shopping", lessons: [{ cefr: "A1" }, { cefr: "A2" }] });
    expect(validatePracticalDutchTopic(topic!)).toEqual([]);
    expect(topic?.lessons.every((lesson) => lesson.coreExercises.length === 6 && lesson.extraExercises.length >= 6 && lesson.coreExercises.every((exercise) => exercise.review.reviewState === "second-review-complete") && lesson.extraExercises.every((exercise) => exercise.review.reviewState === "second-review-complete"))).toBe(true);
  });

  it("fails closed for draft packages while exposing only release-qualified packages", () => {
    expect(validateContentPackage({ family: "practical-dutch", id: "draft-practical-topic", schemaVersion: 1, contentVersion: 1, releaseStatus: "draft", review: { author: "", reviewer: "", reviewedAt: "", sources: [], provenance: "" }, payload: {} })).toEqual(expect.arrayContaining(["releaseStatus: expected released package", "payload: invalid Practical Dutch topic"]));
    expect(contentCatalog.manifest().every((entry) => entry.releaseStatus === "released")).toBe(true);
  });
});
