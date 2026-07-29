import { getWeakerMasteryDimension, type DailyFiveDimension } from "../vocabulary/daily-five";
import type { LearningContext, LearningItem } from "../vocabulary/learning-record";
import { normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";

const MAX_RECONSTRUCTION_LENGTH = 160;
const MIN_RECONSTRUCTION_TOKENS = 2;
const MAX_RECONSTRUCTION_TOKENS = 12;
const SAFE_TOKEN = /^[\p{Letter}\p{Mark}\p{Number}]+(?:['’\-][\p{Letter}\p{Mark}\p{Number}]+)*(?:[.,!?;:]?)$/u;

export type SavedContextReconstruction = {
  tokens: string[];
  targetTokenIndex: number;
};

export type SavedContextMission = {
  itemId: string;
  context: LearningContext;
  dimension: DailyFiveDimension;
  expectedAttemptCount: number;
  revealed: boolean;
  reconstruction: SavedContextReconstruction | null;
  placedTokenIndexes: number[];
};

export function getSavedContext(item: LearningItem): LearningContext | null {
  if (item.kind !== "word") return null;
  return [...item.contexts]
    .filter((context) => context.sourceLanguage === "nl" && context.text.trim().length > 0)
    .sort((first, second) => second.addedAt - first.addedAt || normalizeSavedVocabularyText(second.text).localeCompare(normalizeSavedVocabularyText(first.text)))
    .at(0) ?? null;
}

export function createSavedContextMission(item: LearningItem): SavedContextMission | null {
  const context = getSavedContext(item);
  if (!context) return null;
  const reconstruction = getSavedContextReconstruction(item);
  const dimension = reconstruction ? "recall" : getWeakerMasteryDimension(item);
  return { itemId: item.id, context, dimension, expectedAttemptCount: item[dimension].attemptCount, revealed: false, reconstruction, placedTokenIndexes: [] };
}

export function revealSavedContextMission(mission: SavedContextMission): SavedContextMission {
  return { ...mission, revealed: true };
}

export function getSavedContextReconstruction(item: LearningItem): SavedContextReconstruction | null {
  if (item.kind !== "word") return null;
  const context = getSavedContext(item);
  if (!context || context.text.length > MAX_RECONSTRUCTION_LENGTH) return null;
  const tokens = context.text.trim().replace(/\s+/gu, " ").split(" ");
  if (tokens.length < MIN_RECONSTRUCTION_TOKENS || tokens.length > MAX_RECONSTRUCTION_TOKENS || tokens.some((token) => !SAFE_TOKEN)) return null;
  if (tokens.slice(0, -1).some((token) => /[.,!?;:]$/u.test(token))) return null;
  const normalizedTokens = tokens.map(normalizeReconstructionToken);
  const target = normalizeSavedVocabularyText(item.dutch).normalize("NFC");
  const targetIndexes = normalizedTokens.flatMap((token, index) => token === target ? [index] : []);
  if (targetIndexes.length !== 1 || new Set(normalizedTokens).size !== normalizedTokens.length) return null;
  return { tokens, targetTokenIndex: targetIndexes[0] };
}

export function getSavedContextTokenOrder(reconstruction: SavedContextReconstruction): number[] {
  const indexes = reconstruction.tokens.map((_, index) => index);
  return indexes.length < 2 ? indexes : [...indexes.slice(1), indexes[0]];
}

export function addSavedContextToken(mission: SavedContextMission, tokenIndex: number): SavedContextMission {
  if (!mission.reconstruction || mission.placedTokenIndexes.includes(tokenIndex) || tokenIndex < 0 || tokenIndex >= mission.reconstruction.tokens.length) return mission;
  return { ...mission, placedTokenIndexes: [...mission.placedTokenIndexes, tokenIndex] };
}

export function removeSavedContextToken(mission: SavedContextMission, tokenIndex: number): SavedContextMission {
  return { ...mission, placedTokenIndexes: mission.placedTokenIndexes.filter((index) => index !== tokenIndex) };
}

export function resetSavedContextTokens(mission: SavedContextMission): SavedContextMission {
  return { ...mission, placedTokenIndexes: [] };
}

export function checkSavedContextMission(mission: SavedContextMission): "got-it" | "again" | null {
  const reconstruction = mission.reconstruction;
  if (!reconstruction || mission.placedTokenIndexes.length !== reconstruction.tokens.length || new Set(mission.placedTokenIndexes).size !== reconstruction.tokens.length) return null;
  return mission.placedTokenIndexes.every((tokenIndex, position) => tokenIndex === position) ? "got-it" : "again";
}

function normalizeReconstructionToken(token: string): string {
  return token.replace(/[.,!?;:]+$/u, "").normalize("NFC").toLocaleLowerCase();
}
