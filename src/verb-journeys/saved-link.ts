import { normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";
import type { LearningItem } from "../vocabulary/learning-record";
import type { DutchTense } from "./content";

export type SavedVerbJourneyLink = {
  verbId: "verb.werken";
  lemma: "werken";
  form: DutchTense;
  journeyId: "journey.werken.vtt-completed" | null;
};

const authoredWerkenForms: Record<string, DutchTense> = {
  "heb gewerkt": "VTT",
  "heeft gewerkt": "VTT",
  "hebben gewerkt": "VTT",
  "had gewerkt": "VVT",
  "hadden gewerkt": "VVT",
  "zal werken": "OTTT",
  "zullen werken": "OTTT",
  "zou werken": "OVTT",
  "zouden werken": "OVTT",
  "zal gewerkt hebben": "VTTT",
  "zullen gewerkt hebben": "VTTT",
  "zou gewerkt hebben": "VVTT",
  "zouden gewerkt hebben": "VVTT",
};

export function resolveSavedVerbJourney(item: LearningItem): SavedVerbJourneyLink | null {
  const normalizedDutch = normalizeSavedVocabularyText(item.dutch);
  if (normalizedDutch !== item.normalizedDutch) return null;
  const form = authoredWerkenForms[normalizedDutch];
  if (!form) return null;
  return {
    verbId: "verb.werken",
    lemma: "werken",
    form,
    journeyId: form === "VTT" ? "journey.werken.vtt-completed" : null,
  };
}
