import { describe, expect, it } from "vitest";
import {
  CLEAR_VOCABULARY_MESSAGE,
  DELETE_VOCABULARY_MESSAGE,
  isReviewMessage,
  isVocabularyMessage,
  LIST_VOCABULARY_MESSAGE,
  SAVE_VOCABULARY_BATCH_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
} from "./messages";

const saveMessage = {
  type: SAVE_VOCABULARY_MESSAGE,
  payload: {
    text: "huis",
    sourceLanguage: "auto",
    detectedSourceLanguage: "nl",
    targetLanguage: "en",
    translatedText: "house",
    providerName: "test",
  },
};

describe("isVocabularyMessage", () => {
  it("accepts valid vocabulary messages", () => {
    expect(isVocabularyMessage(saveMessage)).toBe(true);
    expect(
      isVocabularyMessage({
        type: SAVE_VOCABULARY_BATCH_MESSAGE,
        payload: {
          entries: [
            saveMessage.payload,
            {
              ...saveMessage.payload,
              targetLanguage: "te",
              translatedText: "ఇల్లు",
            },
          ],
        },
      }),
    ).toBe(true);
    expect(isVocabularyMessage({ type: LIST_VOCABULARY_MESSAGE })).toBe(true);
    expect(
      isVocabularyMessage({
        type: DELETE_VOCABULARY_MESSAGE,
        payload: { id: "nl\u001fhuis\u001fen" },
      }),
    ).toBe(true);
    expect(isVocabularyMessage({ type: CLEAR_VOCABULARY_MESSAGE })).toBe(true);
    expect(isReviewMessage({ type: REVIEW_SUMMARY_MESSAGE })).toBe(true);
  });

  it("rejects invalid save payloads", () => {
    expect(
      isVocabularyMessage({
        ...saveMessage,
        payload: {
          ...saveMessage.payload,
          targetLanguage: "fr",
        },
      }),
    ).toBe(false);
    expect(
      isVocabularyMessage({
        ...saveMessage,
        payload: {
          ...saveMessage.payload,
          translatedText: undefined,
        },
      }),
    ).toBe(false);
    expect(
      isVocabularyMessage({
        type: SAVE_VOCABULARY_BATCH_MESSAGE,
        payload: {
          entries: [],
        },
      }),
    ).toBe(false);
    expect(
      isVocabularyMessage({
        type: SAVE_VOCABULARY_BATCH_MESSAGE,
        payload: {
          entries: [
            {
              ...saveMessage.payload,
              targetLanguage: "fr",
            },
          ],
        },
      }),
    ).toBe(false);
  });

  it("rejects invalid delete payloads", () => {
    expect(
      isVocabularyMessage({
        type: DELETE_VOCABULARY_MESSAGE,
        payload: {},
      }),
    ).toBe(false);
  });
});
