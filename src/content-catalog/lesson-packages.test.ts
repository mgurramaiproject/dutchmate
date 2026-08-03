import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { lessonCatalog } from "../lessons/catalog";

describe("lesson content packages", () => {
  it("exposes every current lesson through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "lesson")).toHaveLength(15);
    for (const lesson of lessonCatalog.lessons) {
      expect(contentCatalog.getLesson(lesson.id)).toEqual(lesson);
    }
  });
});
