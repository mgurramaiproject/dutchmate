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
});
