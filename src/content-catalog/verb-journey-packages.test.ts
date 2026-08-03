import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { verbJourneyPack } from "../verb-journeys/content";

describe("Verb Journey content packages", () => {
  it("exposes the current werken pack through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
    expect(contentCatalog.getVerbJourneyPack("verb.werken")).toEqual(verbJourneyPack);
  });
});
