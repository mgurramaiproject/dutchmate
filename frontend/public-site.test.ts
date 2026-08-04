import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const readFrontendFile = (name: string) =>
  readFileSync(resolve(process.cwd(), "frontend", name), "utf8");

describe("public website", () => {
  it("publishes the current learner story and honest browser availability", () => {
    const homepage = readFrontendFile("index.html");

    expect(homepage).toContain("Build 0.4.1 · Store updates coming soon");
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
    expect(homepage).toContain("assets/chrome-logo.svg");
    expect(homepage).toContain("assets/firefox-logo.svg");
    expect(homepage).toContain("assets/edge-logo.svg");
    expect(homepage).toContain("assets/safari-logo.svg");
    expect(homepage).toContain('id="edge-availability"');
    expect(homepage).toContain('id="safari-availability"');
    expect(homepage).toContain("Edge support is coming soon.");
    expect(homepage).toContain("Safari support is coming soon.");
    expect(homepage).toContain('id="edge-status" role="status" hidden');
    expect(homepage).toContain('id="safari-status" role="status" hidden');
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
    expect(existsSync(resolve(process.cwd(), "frontend", "assets", "safari-logo.svg"))).toBe(true);
  });

  it("supports public sharing plus private feedback without repo-dependent links", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="feedback.html"');
    expect(homepage).toContain("Share DutchMate with friends and family.");
    expect(homepage).toContain("Review on Chrome or Firefox");
    expect(homepage).toContain("Firefox Add-ons");
    expect(homepage).toContain("https://chromewebstore.google.com/detail/kafimmaagcjmcpajmfneabhebblobgeo");
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
    expect(feedbackPage).toContain("Share on X");
    expect(feedbackPage).toContain("url=https%3A%2F%2Fdutchmate-frontend.onrender.com%2F");
    expect(feedbackPage).toContain('href="https://x.com/dutchmate_addon"');
    expect(feedbackPage).toContain("Follow DutchMate on X");

    for (const pageName of ["index.html", "feedback.html", "privacy-policy.html"]) {
      expect(readFrontendFile(pageName)).not.toMatch(/mailto:|dutchmate\.project@gmail\.com/i);
    }

    expect(feedbackPage).not.toContain("github.com/mgurramaiproject/dutchmate/issues/new");
  });

  it("shows the Edge coming-soon message without navigation", () => {
    class FakeElement {
      hidden = true;
    }

    class FakeButton extends FakeElement {
      attributes = new Map<string, string>();
      listeners = new Map<string, () => void>();

      addEventListener(type: string, listener: () => void) {
        this.listeners.set(type, listener);
      }

      setAttribute(name: string, value: string) {
        this.attributes.set(name, value);
      }

      click() {
        this.listeners.get("click")?.();
      }
    }

    const edgeButton = new FakeButton();
    const edgeStatus = new FakeElement();
    const safariButton = new FakeButton();
    const safariStatus = new FakeElement();
    const document = {
      querySelector(selector: string) {
        if (selector === "#edge-availability") return edgeButton;
        if (selector === "#edge-status") return edgeStatus;
        if (selector === "#safari-availability") return safariButton;
        if (selector === "#safari-status") return safariStatus;
        return null;
      },
    };

    runInNewContext(readFileSync(resolve(process.cwd(), "frontend", "007-showcase-gallery.js"), "utf8"), {
      document,
      HTMLButtonElement: FakeButton,
      HTMLElement: FakeElement,
      HTMLDialogElement: class {},
    });

    edgeButton.click();
    safariButton.click();

    expect(edgeButton.attributes.get("aria-expanded")).toBe("true");
    expect(edgeStatus.hidden).toBe(false);
    expect(safariButton.attributes.get("aria-expanded")).toBe("true");
    expect(safariStatus.hidden).toBe(false);
  });
});
