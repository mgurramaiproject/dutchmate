import {
  isReviewMessage,
  isLearningMessage,
  isSettingsMessage,
  isVocabularyMessage,
  CLEAR_VOCABULARY_MESSAGE,
  LIST_VOCABULARY_MESSAGE,
  REVIEW_CLEAR_MESSAGE,
  REVIEW_DELETE_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_RATE_MESSAGE,
  type BackgroundMessageResponse,
} from "./messages";
import { handleLearningMessage } from "./learning-controller";
import type { LearningRecordStore } from "../vocabulary/learning-record";
import { handleReviewMessage } from "./review-controller";
import { handleSettingsMessage, type ReviewSettingsProvider } from "./settings-controller";
import { handleVocabularyMessage } from "./vocabulary-controller";
import type { ReviewCardStore } from "../vocabulary/review-cards";
import type { SavedVocabularyStore } from "../vocabulary/saved-vocabulary";

export type BackgroundMessageHandler = (
  message: unknown,
  sendResponse: (response: BackgroundMessageResponse) => void,
) => true | undefined;

export type BackgroundMessageHandlerDependencies = {
  savedVocabulary: SavedVocabularyStore;
  reviewCards: ReviewCardStore;
  learningRecords?: LearningRecordStore;
  reviewSettings?: ReviewSettingsProvider;
  refreshBadge: () => Promise<void>;
};

export function createBackgroundMessageHandler(
  dependencies: BackgroundMessageHandlerDependencies,
): BackgroundMessageHandler {
  return (message, sendResponse) => {
    if (isLearningMessage(message) && dependencies.learningRecords) {
      void handleLearningMessage(message, dependencies.learningRecords).then(async (response) => {
        if (response.ok && message.type !== "dutchmate.learning.list" && message.type !== "dutchmate.learning.summary" && message.type !== "dutchmate.learning.rhythm" && message.type !== "dutchmate.learning.export" && message.type !== "dutchmate.learning.dailyFive") await dependencies.refreshBadge();
        sendResponse(response);
      });
      return true;
    }
    if (isSettingsMessage(message) && dependencies.reviewSettings) {
      void handleSettingsMessage(message, dependencies.reviewSettings).then(async (response) => {
        if (response.ok) {
          await dependencies.refreshBadge();
        }
        sendResponse(response);
      });
      return true;
    }

    if (isReviewMessage(message)) {
      void handleReviewMessage(message, dependencies.reviewCards).then(async (response) => {
        if (
          (message.type === REVIEW_RATE_MESSAGE ||
            message.type === REVIEW_IMPORT_MESSAGE ||
            message.type === REVIEW_CLEAR_MESSAGE ||
            message.type === REVIEW_DELETE_MESSAGE) &&
          response.ok
        ) {
          if (dependencies.learningRecords && (message.type === REVIEW_CLEAR_MESSAGE || message.type === REVIEW_DELETE_MESSAGE)) {
            if (message.type === REVIEW_CLEAR_MESSAGE) await dependencies.learningRecords.clear();
            else await dependencies.learningRecords.delete(message.payload.id);
          }
          await dependencies.refreshBadge();
        }
        sendResponse(response);
      });
      return true;
    }

    if (!isVocabularyMessage(message)) {
      return undefined;
    }

    if (message.type === CLEAR_VOCABULARY_MESSAGE) {
      void dependencies.reviewCards.clear().then(
        async () => {
          await dependencies.learningRecords?.clear();
          void dependencies.refreshBadge().then(() => {
            sendResponse({ ok: true, result: { cleared: true } });
          });
        },
        () => {
          sendResponse({ ok: false, error: "Saved vocabulary is unavailable." });
        },
      );
      return true;
    }

    void handleVocabularyMessage(message, dependencies.savedVocabulary).then(async (response) => {
      if (response.ok && message.type !== LIST_VOCABULARY_MESSAGE) {
        await dependencies.refreshBadge();
      }
      sendResponse(response);
    });
    return true;
  };
}
