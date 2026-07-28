import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(import.meta.dirname, "../..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("release docs consistency", () => {
  it("defines a public release gate for the current release baseline", () => {
    const manualTesting = readRepoFile("docs/release/manual-testing.md");

    expect(manualTesting).toContain("## Public Release Gate");
    expect(manualTesting).toContain("real hosted backend");
    expect(manualTesting).toContain(
      "Save action appears only for successful selected single-word translations.",
    );
    expect(manualTesting).toContain(
      "After a timeout, unreachable backend, or busy response, the next hover or selection still works normally.",
    );
  });

  it("keeps the soft-launch support path consistent across release docs", () => {
    const releasePlaybook = readRepoFile("docs/release/browser-release-playbook.md");
    const storeDisclosure = readRepoFile("docs/release/store-disclosure-draft.md");

    for (const file of [releasePlaybook, storeDisclosure]) {
      expect(file).toContain("dutchmate.project@gmail.com");
      expect(file).toContain("single feedback intake");
    }

    expect(releasePlaybook).toContain("soft Firefox launch");
  });

  it("documents LearnLoop's local-data boundary and learner validation", () => {
    const manualTesting = readRepoFile("docs/release/manual-testing.md");
    const privacyPolicy = readRepoFile("docs/release/privacy-policy.md");
    const storeDisclosure = readRepoFile("docs/release/store-disclosure-draft.md");
    const releaseNotes = readRepoFile("docs/release/notes/v0.4.0.md");

    expect(manualTesting).toContain("## LearnLoop Release Checks");
    expect(manualTesting).toContain("## Voluntary Learner Validation Protocol");
    expect(privacyPolicy).toContain("learning items");
    expect(privacyPolicy).toContain("capped page contexts");
    expect(privacyPolicy).toContain("lesson progress");
    expect(storeDisclosure).toContain("learning items");
    expect(storeDisclosure).toContain("translation cache entries");
    expect(releaseNotes).toContain("Daily Five");
  });

  it("documents the 009 engineering gate without overstating human validation", () => {
    const validation = readRepoFile("docs/features/009-proficiency-path-validation.md");

    for (const heading of ["## Automated engineering evidence", "## Popup accessibility evidence", "## Encounter Coaching evidence", "## Privacy and safe-failure boundary", "## Independent human validation handoff"]) {
      expect(validation).toContain(heading);
    }
    expect(validation).toContain("6–10 target learners");
    expect(validation).toContain("2–7 days");
    expect(validation).toContain("does not claim Dutch proficiency");
    expect(validation).toContain("T08 / #89");
  });

  it("keeps the 009 human-validation packet data-minimizing and honest", () => {
    const validation = readRepoFile("docs/features/009-proficiency-path-human-validation.md");

    for (const heading of ["## Reviewer record", "## Browser evidence", "## Learner pilot", "## Decision record"]) {
      expect(validation).toContain(heading);
    }
    expect(validation).toContain("No participant data belongs in git");
    expect(validation).toContain("release / revise");
    expect(validation).toContain("Human validation passed with accepted limitations");
  });
});
