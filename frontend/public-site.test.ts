import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readFrontendFile = (name: string) =>
  readFileSync(resolve(process.cwd(), "frontend", name), "utf8");

describe("public website", () => {
  it("positions DutchMate as a Firefox-first early learning companion", () => {
    const homepage = readFrontendFile("index.html");

    expect(homepage).toContain("Firefox soft launch");
    expect(homepage).toContain("early learning companion");
    expect(homepage).toContain("Dutch, English, and Telugu");
  });

  it("offers one feedback intake through direct email and a website form", () => {
    const homepage = readFrontendFile("index.html");
    const feedbackPage = readFrontendFile("feedback.html");

    expect(homepage).toContain('href="mailto:dutchmate.project@gmail.com');
    expect(homepage).toContain('href="feedback.html"');

    expect(feedbackPage).toContain("<form");
    expect(feedbackPage).toContain('action="mailto:dutchmate.project@gmail.com"');
    expect(feedbackPage).toContain('name="message"');
    expect(feedbackPage).toContain("same review workflow");
  });
});
