import type { VerbJourneyPack } from "./content";
import { contentCatalog } from "../content-catalog";

function getGaanPack(): VerbJourneyPack {
  const pack = contentCatalog.getVerbJourneyPack("verb.gaan");
  if (!pack) throw new Error("Content catalog is missing Verb Journey package: verb.gaan");
  return pack;
}

export const gaanPack = getGaanPack();
