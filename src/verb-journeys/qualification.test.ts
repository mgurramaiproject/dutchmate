import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { verbJourneyPack, verbJourneyPacks, validateVerbJourneyPack, validateVerbJourneyRegistry } from "./content";
import { getVerbPracticeQuestions, getVerbPracticeQuestion, validateVerbPracticeContent } from "./practice";

const featureSources = [
  path.join(import.meta.dirname, "content.ts"),
  path.join(import.meta.dirname, "practice.ts"),
  path.join(import.meta.dirname, "learning.ts"),
  path.join(import.meta.dirname, "saved-link.ts"),
  path.join(import.meta.dirname, "../popup/index.ts"),
];
const popupHtml = readFileSync(path.join(import.meta.dirname, "../popup/index.html"), "utf8");
const popupStyles = readFileSync(path.join(import.meta.dirname, "../popup/styles.css"), "utf8");
const popupSource = readFileSync(path.join(import.meta.dirname, "../popup/index.ts"), "utf8");

describe("Feature 015 release qualification", () => {
  it("keeps the authored werken pack complete and structurally valid", () => {
    expect(validateVerbJourneyPack(verbJourneyPack)).toEqual([]);
    expect(verbJourneyPack.dutchForms).toHaveLength(8);
    expect(verbJourneyPack.englishComparison).toHaveLength(12);
    expect(verbJourneyPack.journeys.filter((journey) => journey.kind === "core")).toHaveLength(3);
    expect(verbJourneyPack.journeys.filter((journey) => journey.kind === "core").every((journey) => journey.story.length > 0 && journey.notice)).toBe(true);
  });

  it("qualifies every authored pack and every zijn journey as playable", () => {
    expect(validateVerbJourneyRegistry()).toEqual([]);
    const zijn = verbJourneyPacks.find((pack) => pack.verb.id === "verb.zijn");
    expect(zijn?.journeys).toHaveLength(6);
    expect(zijn?.journeys.every((journey) => journey.story.length === 5 && journey.notice && journey.targetSkills.length > 0)).toBe(true);
    const coreQuestionCounts = zijn?.journeys.map((journey) => getVerbPracticeQuestions(journey.id as never).filter((question) => question.phase !== "repair").length) ?? [];
    expect(coreQuestionCounts).toEqual([5, 5, 5, 5, 5, 5]);
  });

  it("keeps the practice contract at five core questions and two repairs", () => {
    expect(validateVerbPracticeContent()).toEqual([]);
    const questions = getVerbPracticeQuestions();
    const repairIds = new Set(questions.flatMap((question) => question.repairIds ?? []));

    expect(questions).toHaveLength(5);
    expect(new Set(questions.map((question) => question.exerciseFamily))).toHaveLength(5);
    expect(repairIds.size).toBeLessThanOrEqual(2);
    expect([...repairIds].every((id) => getVerbPracticeQuestion(id)?.phase === "repair")).toBe(true);
  });

  it("keeps the journey local and click-only", () => {
    const source = featureSources.map((file) => readFileSync(file, "utf8")).join("\n");

    expect(source).not.toMatch(/\b(audio|speech|SpeechSynthesis|MediaRecorder|fetch|XMLHttpRequest|WebSocket|LLM)\b/i);
  });

  it("keeps the popup contract compact, navigable, and recoverable", () => {
    expect(popupHtml.match(/id="(?:today|lessons|saved)-tab"/g)).toHaveLength(3);
    expect(popupHtml.match(/<svg\b/g)).toHaveLength(3);
    expect(popupStyles).toContain("width: 390px;");
    expect(popupStyles).toContain("height: 600px;");
    expect(popupStyles).toContain("button:focus-visible");
    expect(popupStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(popupSource).toContain("renderWithRecovery(content");
    expect(popupSource).toContain('number: "01"');
    expect(popupSource).toContain('number: "04"');
  });
});
