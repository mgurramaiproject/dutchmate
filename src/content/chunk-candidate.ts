import { normalizeSavedVocabularyText } from "../vocabulary/saved-vocabulary";

export const MAX_CHUNK_LENGTH = 80;

export type ChunkCandidate = { normalizedDutch: string; tokenCount: number };

export function getChunkCandidate(text: string): ChunkCandidate | null {
  if (/\r|\n/u.test(text) || /[.!?。！？]/u.test(text)) return null;
  const normalizedDutch = normalizeSavedVocabularyText(text);
  if (normalizedDutch.length > MAX_CHUNK_LENGTH) return null;
  const tokens = normalizedDutch.match(/(?:['’])?[\p{Letter}\p{Number}][\p{Letter}\p{Number}'’-]*/gu) ?? [];
  if (tokens.length < 2 || tokens.length > 8 || tokens.join(" ") !== normalizedDutch.replace(/[’]/gu, "'")) return null;
  return { normalizedDutch, tokenCount: tokens.length };
}
