import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { grammarPatterns } from "../grammar/content";
import { contrastPack } from "../grammar/contrast";

describe("grammar and contrast content packages", () => {
  it("exposes every current grammar and contrast pack through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "grammar")).toHaveLength(4);
    expect(contentCatalog.manifest().filter((entry) => entry.family === "contrast")).toHaveLength(1);
    for (const pattern of grammarPatterns) expect(contentCatalog.getGrammarPattern(pattern.id)).toEqual(pattern);
    expect(contentCatalog.getContrastPack(contrastPack.id)).toEqual(contrastPack);
  });
});
