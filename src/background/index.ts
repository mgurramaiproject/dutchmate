import {
  isReviewMessage,
  isTranslateMessage,
  isVocabularyMessage,
  type BackgroundMessageResponse,
  type TranslateMessageResponse,
} from "./messages";
import { LocalCacheStorage, type LocalCacheExtensionApi } from "./local-cache-storage";
import { readProviderSettings, type BackgroundExtensionApi } from "./settings-adapter";
import { handleVocabularyMessage } from "./vocabulary-controller";
import { handleReviewMessage } from "./review-controller";
import { PersistentTranslationCache } from "../translation/persistent-translation-cache";
import { TranslationCache } from "../translation/translation-cache";
import { TranslationService } from "../translation/translation-service";
import { getTranslationErrorMessage } from "./translation-error-message";
import { SavedVocabularyStore } from "../vocabulary/saved-vocabulary";
import { ReviewCardStore } from "../vocabulary/review-cards";

const MAX_CACHE_ENTRIES = 100;

type BackgroundRuntimeApi = BackgroundExtensionApi & LocalCacheExtensionApi & {
  runtime: {
    lastError?: { message?: string };
    onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response: BackgroundMessageResponse) => void,
        ) => true | undefined,
      ): void;
    };
  };
};

const extensionGlobal = globalThis as typeof globalThis & {
  browser?: BackgroundRuntimeApi;
  chrome?: BackgroundRuntimeApi;
};
const extensionApi = extensionGlobal.chrome ?? extensionGlobal.browser;
const localStorage = new LocalCacheStorage(extensionApi);
const translationService = new TranslationService(
  () => readProviderSettings(extensionApi),
  new TranslationCache(MAX_CACHE_ENTRIES),
  new PersistentTranslationCache(localStorage),
);
const savedVocabularyStore = new SavedVocabularyStore(localStorage);
const reviewCardStore = new ReviewCardStore(savedVocabularyStore, localStorage);

extensionApi?.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (isReviewMessage(message)) {
    void handleReviewMessage(message, reviewCardStore).then(sendResponse);
    return true;
  }

  if (!isTranslateMessage(message)) {
    if (!isVocabularyMessage(message)) {
      return undefined;
    }

    void handleVocabularyMessage(message, savedVocabularyStore).then(sendResponse);
    return true;
  }

  void handleTranslate(message.payload).then(sendResponse);
  return true;
});

async function handleTranslate(
  request: Parameters<TranslationService["translate"]>[0],
): Promise<TranslateMessageResponse> {
  try {
    const result = await translationService.translate(request);
    return { ok: true, result };
  } catch (error) {
    return {
      ok: false,
      error: getTranslationErrorMessage(error),
    };
  }
}
