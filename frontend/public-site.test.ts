import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readFrontendFile = (name: string) =>
  readFileSync(resolve(process.cwd(), "frontend", name), "utf8");

describe("public website", () => {
  it("restores the original public copy and links to the live Firefox add-on page", () => {
    const homepage = readFrontendFile("index.html");

    expect(homepage).toContain("Learn Dutch while reading.");
    expect(homepage).toContain("Read Dutch with English and Telugu beside you");
    expect(homepage).toContain("Download for Mozilla Firefox");
    expect(homepage).toContain("https://addons.mozilla.org/en-US/firefox/addon/dutchmate/");
  });

  it("routes feedback through GitHub or email without a mailto form submit", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="feedback.html"');
    expect(homepage).toContain("Open a prefilled GitHub issue");

    expect(feedbackPage).toContain("Open a GitHub feedback issue");
    expect(feedbackPage).toContain("https://github.com/mgurramaiproject/dutchmate/issues/new?");
    expect(feedbackPage).not.toContain("<form");
    expect(feedbackPage).not.toContain('action="mailto:');
  });
});
