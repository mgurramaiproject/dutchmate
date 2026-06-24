import type { RuntimeSaveVocabularyRequest } from "./runtime-vocabulary-client";
import type { TooltipContext } from "./tooltip-request-state";
import {
  isSingleSavedVocabularyWord,
  normalizeSavedVocabularyText,
} from "../vocabulary/saved-vocabulary";

export function getEligibleSaveCandidates(
  text: string,
  context: TooltipContext,
  candidates: RuntimeSaveVocabularyRequest[],
): RuntimeSaveVocabularyRequest[] {
  if (
    context !== "selection" ||
    !isSingleSavedVocabularyWord(normalizeSavedVocabularyText(text))
  ) {
    return [];
  }

  return candidates;
}
