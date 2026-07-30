import { describe, expect, it } from "vitest";
import { getMisconceptionDefinition, isRegisteredMisconceptionSource, MAIN_CLAUSE_NO_INVERSION, misconceptionRegistry } from "./misconceptions";

describe("controlled misconception registry", () => {
  it("defines a narrow reviewed source for the pilot code", () => {
    expect(misconceptionRegistry[MAIN_CLAUSE_NO_INVERSION]).toMatchObject({
      code: MAIN_CLAUSE_NO_INVERSION,
      packId: "contrast.main_clause_inversion",
      sourceExerciseIds: ["contrast-choose-time-first", "contrast-repair-time-first"],
    });
    expect(getMisconceptionDefinition(MAIN_CLAUSE_NO_INVERSION)?.learnerDescription).toContain("finite verb");
    expect(isRegisteredMisconceptionSource(MAIN_CLAUSE_NO_INVERSION, "contrast.main_clause_inversion", "contrast-choose-time-first")).toBe(true);
  });

  it("does not allow arbitrary exercises or packs to emit the code", () => {
    expect(isRegisteredMisconceptionSource(MAIN_CLAUSE_NO_INVERSION, "contrast.main_clause_inversion", "contrast-rebuild-appointment")).toBe(false);
    expect(isRegisteredMisconceptionSource(MAIN_CLAUSE_NO_INVERSION, "a0-yes-no-inversion", "inversion-order-je")).toBe(false);
    expect(getMisconceptionDefinition("UNKNOWN_CODE")).toBeUndefined();
  });
});
