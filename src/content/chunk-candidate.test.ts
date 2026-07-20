import { describe, expect, it } from "vitest";
import { getChunkCandidate } from "./chunk-candidate";

describe("getChunkCandidate", () => {
  it.each(["goede morgen", "  goede   morgen  ", "'s avonds thuis", "café aan de gracht"])('accepts %s', (text) => {
    expect(getChunkCandidate(text)).toMatchObject({ normalizedDutch: text.trim().replace(/\s+/g, " ").toLowerCase() });
  });
  it.each(["huis", "een twee drie vier vijf zes zeven acht negen", "een zin.", "een\ntwee", "x".repeat(81)])('rejects %s', (text) => {
    expect(getChunkCandidate(text)).toBeNull();
  });
});
