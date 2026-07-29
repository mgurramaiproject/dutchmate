import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(path.join(import.meta.dirname, "index.html"), "utf8");
const script = readFileSync(path.join(import.meta.dirname, "index.ts"), "utf8");
const styles = readFileSync(path.join(import.meta.dirname, "styles.css"), "utf8");

describe("Options form contract", () => {
  it("puts Languages before Behavior and keeps the existing sections", () => {
    const sections = [...html.matchAll(/<section[^>]*aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
    expect(sections).toEqual([
      "languages-heading",
      "behavior-heading",
      "study-preferences-heading",
      "tuning-heading",
      "saved-vocabulary-heading",
      "privacy-heading",
    ]);
  });

  it("locks fixed language, tuning, and study-preference controls", () => {
    expect(html).toContain('id="native-language" name="nativeLanguage"');
    expect(html).toContain('id="bridge-language" name="bridgeLanguage"');
    expect(html).toContain('id="hover-translation-mode-word" name="hoverTranslationMode" type="radio" value="word" checked disabled');
    expect(html).toContain('id="hover-translation-mode-sentence" name="hoverTranslationMode" type="radio" value="sentence" disabled');
    expect(html).toContain('<fieldset class="locked-settings" disabled');
  });

  it("keeps saved numbering and the bottom-save reminder visible when dirty", () => {
    expect(html).toContain('<div id="save-reminder" class="save-reminder"');
    expect(html).toContain('<th scope="col">#</th>');
    expect(script).toContain("const shelfNumberById = new Map(sortSavedItems(items, \"oldest\")");
    expect(script).toContain('saveButton.textContent = value ? "Save changes" : "Save";');
    expect(styles).toContain("form.is-dirty .form-actions");
  });
});
