import { describe, expect, it } from "vitest";
import { getReliablePageContext, MAX_PAGE_CONTEXT_LENGTH } from "./page-context";

describe("page context", () => {
  it("keeps the sentence containing the selected word", () => {
    expect(getReliablePageContext("Een oud huis staat daar. Een boom groeit verder.", "huis")).toBe(
      "Een oud huis staat daar.",
    );
  });

  it("caps long reliable sentences locally", () => {
    const sentence = `${"Een huis ".repeat(40)}staat daar.`;
    expect(getReliablePageContext(sentence, "huis")).toHaveLength(MAX_PAGE_CONTEXT_LENGTH);
  });

  it("keeps the selected word inside a capped context window", () => {
    const sentence = `${"Een lange aanloop ".repeat(30)}huis staat daar.`;
    const context = getReliablePageContext(sentence, "huis");

    expect(context).toContain("huis");
    expect(context).toHaveLength(MAX_PAGE_CONTEXT_LENGTH);
  });

  it("omits context when a reliable sentence cannot be found", () => {
    expect(getReliablePageContext("een huis zonder einde", "huis")).toBeNull();
    expect(getReliablePageContext("Een oud huis staat daar.", "het huis")).toBeNull();
  });
});
