import type { GrammarPattern } from "./content";
import type { GrammarRecord } from "./learning";
import type { GrammarPatternId } from "../lessons/catalog";

export type GrammarProgressLabel = "Not started" | "Introduced" | "Practising" | "Applied";

export function getGrammarProgressLabel(record: GrammarRecord | null | undefined): GrammarProgressLabel {
  if (!record) return "Not started";
  return record.state === "introduced" ? "Introduced" : record.state === "practising" ? "Practising" : "Applied";
}

export function getNextFoundationPattern(patterns: readonly GrammarPattern[], records: Partial<Record<GrammarPatternId, GrammarRecord>>): GrammarPattern | null {
  return patterns.find((pattern) => records[pattern.id]?.state !== "applied") ?? null;
}
