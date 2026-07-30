export const MAIN_CLAUSE_NO_INVERSION = "MAIN_CLAUSE_NO_INVERSION" as const;

export type MisconceptionCode = typeof MAIN_CLAUSE_NO_INVERSION;
export type MisconceptionDefinition = {
  code: MisconceptionCode;
  learnerDescription: string;
  scope: string;
  packId: "contrast.main_clause_inversion";
  sourceExerciseIds: readonly string[];
};

export const misconceptionRegistry: Record<MisconceptionCode, MisconceptionDefinition> = {
  [MAIN_CLAUSE_NO_INVERSION]: {
    code: MAIN_CLAUSE_NO_INVERSION,
    learnerDescription: "When a time phrase starts the sentence, put the finite verb before the subject.",
    scope: "A controlled time-first simple main clause with an authored subject-before-finite-verb distractor.",
    packId: "contrast.main_clause_inversion",
    sourceExerciseIds: ["contrast-choose-time-first", "contrast-repair-time-first"],
  },
};

export function getMisconceptionDefinition(code: string): MisconceptionDefinition | undefined {
  return misconceptionRegistry[code as MisconceptionCode];
}

export function isRegisteredMisconceptionSource(code: string, packId: string, exerciseId: string): boolean {
  const definition = getMisconceptionDefinition(code);
  return definition?.packId === packId && definition.sourceExerciseIds.includes(exerciseId);
}
