import { describe, expect, it } from "vitest";
import {
  CLEAR_VOCABULARY_MESSAGE,
  DELETE_VOCABULARY_MESSAGE,
  isReviewMessage,
  isSettingsMessage,
  isVocabularyMessage,
  LIST_VOCABULARY_MESSAGE,
  SAVE_VOCABULARY_BATCH_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
  REVIEW_SUMMARY_MESSAGE,
  REVIEW_NEW_QUEUE_MESSAGE,
  REVIEW_RATE_MESSAGE,
  REVIEW_EXPORT_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_CLEAR_MESSAGE,
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
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
    expect(isReviewMessage({ type: REVIEW_NEW_QUEUE_MESSAGE })).toBe(true);
    expect(isReviewMessage({ type: REVIEW_EXPORT_MESSAGE })).toBe(true);
    expect(isReviewMessage({ type: REVIEW_CLEAR_MESSAGE })).toBe(true);
    expect(
      isReviewMessage({
        type: REVIEW_IMPORT_MESSAGE,
        payload: { document: "{}" },
      }),
    ).toBe(true);
    expect(isSettingsMessage({ type: REVIEW_SETTINGS_MESSAGE })).toBe(true);
    expect(
      isSettingsMessage({
        type: REVIEW_SETTINGS_UPDATE_MESSAGE,
        payload: { dailyReviewBadge: false, cardDirection: "helpers-to-dutch" },
      }),
    ).toBe(true);
    expect(
      isReviewMessage({
        type: REVIEW_RATE_MESSAGE,
        payload: { id: "nl\u001fhuis", rating: "good" },
      }),
    ).toBe(true);
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

  it("rejects invalid review ratings", () => {
    expect(
      isReviewMessage({
        type: REVIEW_RATE_MESSAGE,
        payload: { id: "nl\u001fhuis", rating: "soon" },
      }),
    ).toBe(false);
  });

  it("rejects imports without a JSON document", () => {
    expect(isReviewMessage({ type: REVIEW_IMPORT_MESSAGE, payload: {} })).toBe(false);
  });

  it("rejects settings outside the review preference contract", () => {
    expect(
      isSettingsMessage({
        type: REVIEW_SETTINGS_UPDATE_MESSAGE,
        payload: { providerApiKey: "secret" },
      }),
    ).toBe(false);
  });
});
