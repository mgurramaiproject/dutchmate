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

  it("supports public sharing plus private feedback without repo-dependent links", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="feedback.html"');
    expect(homepage).toContain("Rate on Firefox Add-ons");
    expect(homepage).toContain("Share on X");
    expect(homepage).toContain("twitter.com/intent/tweet");

    expect(feedbackPage).toContain("Email feedback privately");
    expect(feedbackPage).toContain("Rate on Firefox Add-ons");
    expect(feedbackPage).toContain("Share on X");
    expect(feedbackPage).not.toContain("github.com/mgurramaiproject/dutchmate/issues/new");
  });
});
