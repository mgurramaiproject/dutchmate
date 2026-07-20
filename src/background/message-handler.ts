import { isLearningMessage, isSettingsMessage, type BackgroundMessageResponse } from "./messages";
import { handleLearningMessage } from "./learning-controller";
import type { LearningRecordStore } from "../vocabulary/learning-record";
import { handleSettingsMessage, type ReviewSettingsProvider } from "./settings-controller";
import type { ReviewCardStore } from "../vocabulary/review-cards";
import type { SavedVocabularyStore } from "../vocabulary/saved-vocabulary";

export type BackgroundMessageHandler = (
  message: unknown,
  sendResponse: (response: BackgroundMessageResponse) => void,
) => true | undefined;

export type BackgroundMessageHandlerDependencies = {
  savedVocabulary?: SavedVocabularyStore;
  reviewCards?: ReviewCardStore;
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

    return undefined;
  };
}
