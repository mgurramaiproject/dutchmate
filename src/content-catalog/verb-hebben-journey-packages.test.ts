import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { getVerbJourneyPack, verbJourneyPacks } from "../verb-journeys/content";

describe("hebben Verb Journey content package", () => {
  it("exposes the current hebben pack through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
    expect(contentCatalog.getVerbJourneyPack("verb.hebben")).toEqual(getVerbJourneyPack("verb.hebben"));
    expect(verbJourneyPacks.find((pack) => pack.verb.id === "verb.hebben")).toEqual(contentCatalog.getVerbJourneyPack("verb.hebben"));
  });
});
