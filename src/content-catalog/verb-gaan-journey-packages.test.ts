import { describe, expect, it } from "vitest";
import { contentCatalog } from "./index";
import { gaanPack } from "../verb-journeys/gaan-content";
import { getVerbJourneyPack } from "../verb-journeys/content";

describe("gaan Verb Journey content package", () => {
  it("exposes the current gaan pack through the catalog", () => {
    expect(contentCatalog.manifest().filter((entry) => entry.family === "verb-journey")).toHaveLength(4);
    expect(contentCatalog.getVerbJourneyPack("verb.gaan")).toEqual(gaanPack);
    expect(getVerbJourneyPack("verb.gaan")).toEqual(contentCatalog.getVerbJourneyPack("verb.gaan"));
  });
});
