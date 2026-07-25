import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readFrontendFile = (name: string) =>
  readFileSync(resolve(process.cwd(), "frontend", name), "utf8");

describe("public website", () => {
  it("publishes the 0.4.0 public copy and links to the live Firefox add-on page", () => {
    const homepage = readFrontendFile("index.html");

    expect(homepage).toContain("Release 0.4.0 · Now available for Firefox");
    expect(homepage).toContain("Read Dutch. Build your vocabulary from the web.");
    expect(homepage).toContain("Install DutchMate free");
    expect(homepage).toContain("No account or subscription");
    expect(homepage).toContain("007-showcase-040-14-browser-popup.png");
    expect(homepage).toContain("https://addons.mozilla.org/en-US/firefox/addon/dutchmate/");
  });

  it("ships every feature-prefixed 0.4.0 showcase asset without old screenshot references", () => {
    const homepage = readFrontendFile("index.html");
    const assetNames = [
      "007-showcase-040-01-today.png",
      "007-showcase-040-02-lessons.png",
      "007-showcase-040-03-saved.png",
      "007-showcase-040-04-today-month.png",
      "007-showcase-040-05-today-year.png",
      "007-showcase-040-06-lessons-inside.png",
      "007-showcase-040-07-saved-item.png",
      "007-showcase-040-08-nl-to-en-te.png",
      "007-showcase-040-09-nl-item-saved.png",
      "007-showcase-040-10-en-to-nl-te.png",
      "007-showcase-040-11-en-item-saved.png",
      "007-showcase-040-12-te-to-nl-en.png",
      "007-showcase-040-13-te-item-saved.png",
      "007-showcase-040-14-browser-popup.png",
    ];

    for (const assetName of assetNames) {
      expect(existsSync(resolve(process.cwd(), "frontend", "assets", "screenshots", assetName))).toBe(true);
      expect(homepage).toContain(`assets/screenshots/${assetName}`);
    }

    expect(homepage).not.toContain("dutchmate-firefox-");
    expect(homepage).not.toContain("homepage-hover-translation.png");
  });

  it("supports public sharing plus private feedback without repo-dependent links", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="feedback.html"');
    expect(homepage).toContain("Share DutchMate with friends and family.");
    expect(homepage).toContain("Review on Firefox");
    expect(homepage).toContain("Share on X");
    expect(homepage).toContain("twitter.com/intent/tweet");
    expect(homepage).toContain("https://forms.gle/9KSsqfE1NNZcPEaaA");

    expect(homepage).not.toContain('<a href="#privacy">Privacy</a>');

    expect(feedbackPage).toContain("Open feedback form");
    expect(feedbackPage).toContain("https://forms.gle/9KSsqfE1NNZcPEaaA");
    expect(feedbackPage).toContain("Email us");
    expect(feedbackPage).toContain("Review on Firefox");
    expect(feedbackPage).toContain("Share on X");
    expect(feedbackPage).not.toContain("github.com/mgurramaiproject/dutchmate/issues/new");
  });
});
