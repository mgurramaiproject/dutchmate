import { describe, expect, it } from "vitest";
import { contentCatalog, validateContentPackage } from "./index";

describe("content catalog", () => {
  it("discovers the released lesson package through the shared interface", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "lesson")).toHaveLength(15);
    expect(contentCatalog.manifest().find((entry) => entry.id === "a0-hallo-ik-ben")).toEqual({
      family: "lesson",
      id: "a0-hallo-ik-ben",
      schemaVersion: 1,
      contentVersion: 1,
      releaseStatus: "released",
    });
    const lesson = contentCatalog.getLesson("a0-hallo-ik-ben");
    expect(lesson).toMatchObject({ id: "a0-hallo-ik-ben", title: "A0 · Hallo, ik ben…" });
    expect(lesson?.lines[0].dutch).toBe("Hallo, ik ben Ravi. Ik woon sinds kort in Utrecht.");
    expect(contentCatalog.getLesson("missing-lesson")).toBeNull();
  });

  it("rejects a package that is not release-qualified", () => {
    expect(validateContentPackage({
      family: "lesson",
      id: "a0-hallo-ik-ben",
      schemaVersion: 1,
      contentVersion: 1,
      releaseStatus: "draft",
      review: { author: "", reviewer: "", reviewedAt: "", sources: [], provenance: "" },
      payload: {},
    })).toContain("releaseStatus: expected released package");
    expect(validateContentPackage({})).toContain("family: expected supported content family");
  });

  it("keeps the paired Practical Dutch topic atomic", () => {
    const topic = contentCatalog.getPracticalDutchTopic();
    expect(topic?.lessons).toHaveLength(2);
    expect(topic?.lessons.map((lesson) => lesson.cefr)).toEqual(["A1", "A2"]);
    expect(topic?.lessons.every((lesson) => lesson.coreExercises.length === 6)).toBe(true);
  });
});
