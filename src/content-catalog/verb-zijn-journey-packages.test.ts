import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { getVerbJourneyPack, verbJourneyPacks } from "../verb-journeys/content";

describe("zijn Verb Journey content package", () => {
  it("exposes the current zijn pack through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
    expect(contentCatalog.getVerbJourneyPack("verb.zijn")).toEqual(getVerbJourneyPack("verb.zijn"));
    expect(verbJourneyPacks.find((pack) => pack.verb.id === "verb.zijn")).toEqual(contentCatalog.getVerbJourneyPack("verb.zijn"));
  });
});
