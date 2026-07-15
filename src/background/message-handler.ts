import {
  isReviewMessage,
  isVocabularyMessage,
  LIST_VOCABULARY_MESSAGE,
  REVIEW_RATE_MESSAGE,
  type BackgroundMessageResponse,
} from "./messages";
import { handleReviewMessage } from "./review-controller";
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
  refreshBadge: () => Promise<void>;
};

export function createBackgroundMessageHandler(
  dependencies: BackgroundMessageHandlerDependencies,
): BackgroundMessageHandler {
  return (message, sendResponse) => {
    if (isReviewMessage(message)) {
      void handleReviewMessage(message, dependencies.reviewCards).then(async (response) => {
        if (message.type === REVIEW_RATE_MESSAGE && response.ok) {
          await dependencies.refreshBadge();
        }
        sendResponse(response);
      });
      return true;
    }

    if (!isVocabularyMessage(message)) {
      return undefined;
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
