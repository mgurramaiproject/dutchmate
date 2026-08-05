import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readFrontendFile = (name: string) =>
  readFileSync(resolve(process.cwd(), "frontend", name), "utf8");

describe("public website", () => {
  it("publishes the current learner story and honest browser availability", () => {
    const homepage = readFrontendFile("index.html");

    expect(homepage).toContain("Build 0.5.1 · Edge listing now live");
    expect(homepage).toContain("Read Dutch. Keep the words that matter.");
    expect(homepage).toContain("Daily Five, Lessons, and Verb Journeys");
    expect(homepage).toContain("Practise Dutch grammar");
    expect(homepage).toContain("Follow verb conjugations");
    expect(homepage).toContain("Build sentences");
    expect(homepage).toContain("Grow useful vocabulary");
    expect(homepage).toContain("No account or subscription");
    expect(homepage).toContain("007-showcase-040-14-browser-popup.png");
    expect(homepage).toContain('id="screenshot-lightbox"');
    expect(homepage).toContain('src="007-showcase-gallery.js" defer');
    expect(homepage).toContain("https://chromewebstore.google.com/detail/kafimmaagcjmcpajmfneabhebblobgeo");
    expect(homepage).toContain("https://addons.mozilla.org/en-US/firefox/addon/dutchmate/");
    expect(homepage).toContain("https://microsoftedge.microsoft.com/addons/detail/dutchmate/plobaccfjjbpfekjomnmmidlmjjdecme");
    expect(homepage).toContain("assets/chrome-logo.svg");
    expect(homepage).toContain("assets/firefox-logo.svg");
    expect(homepage).toContain("assets/edge-logo.svg");
    expect(homepage).toContain("Chrome, Firefox, and Edge listings are live.");
    expect(homepage).not.toContain("data-coming-soon-browser");
    expect(homepage).not.toContain("Edge support is coming soon.");
    expect(homepage).not.toContain("Safari");
    expect(homepage).not.toContain("Release 0.4.0");
    expect(homepage).not.toContain("Now available for Firefox");
    expect(homepage).not.toContain("Install the Firefox extension");
  });

  it("ships every existing showcase asset without replacing the retained gallery", () => {
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
    expect(existsSync(resolve(process.cwd(), "frontend", "assets", "chrome-logo.svg"))).toBe(true);
    expect(existsSync(resolve(process.cwd(), "frontend", "assets", "edge-logo.svg"))).toBe(true);
  });

  it("supports public sharing plus private feedback without repo-dependent links", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="feedback.html"');
    expect(homepage).toContain("Share DutchMate with friends and family.");
    expect(homepage).toContain("Review on Chrome, Firefox, or Edge");
    expect(homepage).toContain("Firefox Add-ons");
    expect(homepage).toContain("https://chromewebstore.google.com/detail/kafimmaagcjmcpajmfneabhebblobgeo");
    expect(homepage).toContain("https://microsoftedge.microsoft.com/addons/detail/dutchmate/plobaccfjjbpfekjomnmmidlmjjdecme");
    expect(homepage).toContain("Share on X");
    expect(homepage).toContain("twitter.com/intent/tweet");
    expect(homepage).toContain("url=https%3A%2F%2Fdutchmate-frontend.onrender.com%2F");
    expect(homepage).toContain('href="https://x.com/dutchmate_addon"');
    expect(homepage).toContain("Follow @dutchmate_addon");
    expect(homepage).toContain("https://forms.gle/9KSsqfE1NNZcPEaaA");

    expect(homepage).not.toContain('<a href="#privacy">Privacy</a>');

    expect(feedbackPage).toContain("Open feedback form");
    expect(feedbackPage).toContain("https://forms.gle/9KSsqfE1NNZcPEaaA");
    expect(feedbackPage).toContain("Contact form");
    expect(feedbackPage).toContain("Review on Chrome");
    expect(feedbackPage).toContain("Review on Firefox");
    expect(feedbackPage).toContain("Review on Edge");
    expect(feedbackPage).toContain("https://microsoftedge.microsoft.com/addons/detail/dutchmate/plobaccfjjbpfekjomnmmidlmjjdecme");
    expect(feedbackPage).toContain("Share on X");
    expect(feedbackPage).toContain("url=https%3A%2F%2Fdutchmate-frontend.onrender.com%2F");
    expect(feedbackPage).toContain('href="https://x.com/dutchmate_addon"');
    expect(feedbackPage).toContain("Follow DutchMate on X");

    for (const pageName of ["index.html", "feedback.html", "privacy-policy.html"]) {
      expect(readFrontendFile(pageName)).not.toMatch(/mailto:|dutchmate\.project@gmail\.com/i);
    }

    expect(feedbackPage).not.toContain("github.com/mgurramaiproject/dutchmate/issues/new");
  });

});
