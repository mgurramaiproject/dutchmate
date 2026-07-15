import { describe, expect, it } from "vitest";
import {
  createVocabularyBackup,
  parseVocabularyBackup,
  serializeVocabularyBackup,
  type VocabularyBackup,
} from "./vocabulary-backup";
import type { ReviewCard } from "./review-cards";

describe("vocabulary backups", () => {
  it("serializes a versioned document containing canonical cards only", () => {
    const card = reviewCard({
      english: "house",
      telugu: "ఇల్లు",
      pageContext: "Een huis staat daar.",
      dueAt: 5_000,
      lastReviewedAt: 4_000,
      lastRating: "good",
      reviewCount: 1,
    });

    expect(createVocabularyBackup([card], 10_000)).toEqual({
      format: "dutchmate-vocabulary-backup",
      version: 1,
      exportedAt: 10_000,
      cards: [card],
    });
    expect(serializeVocabularyBackup([card], 10_000)).toBe(`${JSON.stringify({
      format: "dutchmate-vocabulary-backup",
      version: 1,
      exportedAt: 10_000,
      cards: [card],
    }, null, 2)}\n`);
    expect(serializeVocabularyBackup([card])).not.toContain("providerApiKey");
  });

  it("parses a valid backup and rejects malformed or unsupported documents", () => {
    const backup = createVocabularyBackup([reviewCard()], 10_000);

    expect(parseVocabularyBackup(JSON.stringify(backup))).toEqual(backup);
    expect(() => parseVocabularyBackup("not json")).toThrow(
      "This vocabulary file is not valid JSON.",
    );
    expect(() => parseVocabularyBackup(JSON.stringify({ ...backup, version: 2 }))).toThrow(
      "This vocabulary file is not a supported DutchMate backup.",
    );
    expect(() => parseVocabularyBackup(JSON.stringify({ ...backup, cards: [{ id: "bad" }] }))).toThrow(
      "This vocabulary file contains an invalid review card.",
    );
  });
});

function reviewCard(overrides: Partial<ReviewCard> = {}): ReviewCard {
  return {
    id: "nl\u001fhuis",
    dutch: "huis",
    english: null,
    telugu: null,
    pageContext: null,
    createdAt: 1_000,
    updatedAt: 1_000,
    dueAt: null,
    lastReviewedAt: null,
    lastRating: null,
    reviewCount: 0,
    ...overrides,
  };
}
