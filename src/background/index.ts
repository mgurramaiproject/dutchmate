import {
  isTranslateMessage,
  type BackgroundMessageResponse,
  type TranslateMessageResponse,
} from "./messages";
import { LocalCacheStorage, type LocalCacheExtensionApi } from "./local-cache-storage";
import {
  readExtensionSettings,
  readProviderSettings,
  type BackgroundExtensionApi,
} from "./settings-adapter";
import { createBackgroundMessageHandler } from "./message-handler";
import { mergeSettings } from "../shared/settings";
import { PersistentTranslationCache } from "../translation/persistent-translation-cache";
import { TranslationCache } from "../translation/translation-cache";
import { TranslationService } from "../translation/translation-service";
import { getTranslationErrorMessage } from "./translation-error-message";
import { LearningRecordStore } from "../vocabulary/learning-record";
import { updateReviewBadge, type ReviewBadgeExtensionApi } from "./review-badge";

const MAX_CACHE_ENTRIES = 100;

type BackgroundRuntimeApi = BackgroundExtensionApi & LocalCacheExtensionApi & {
  action?: ReviewBadgeExtensionApi["action"];
  storage: BackgroundExtensionApi["storage"] & LocalCacheExtensionApi["storage"] & {
    onChanged?: {
      addListener(callback: (changes: Record<string, { newValue?: unknown }>, areaName: string) => void): void;
    };
  };
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
  new PersistentTranslationCache(localStorage, {
    readPolicy: async () => {
      const settings = await readExtensionSettings(extensionApi);
      return {
        cacheHoveredWords: settings.cacheHoveredWords,
        cacheSelectedWords: settings.cacheSelectedWords,
      };
    },
  }),
);
const learningRecordStore = new LearningRecordStore(localStorage);
const reviewSettings = {
  read: () => readExtensionSettings(extensionApi),
  async update(changes: Parameters<typeof mergeSettings>[1]) {
    const settings = mergeSettings(await readExtensionSettings(extensionApi), changes);
    if (extensionApi?.storage.sync.set) {
      await new Promise<void>((resolve) => extensionApi.storage.sync.set?.(changes, resolve));
    }
    return settings;
  },
};

async function refreshReviewBadge(): Promise<void> {
  try {
    const settings = await readExtensionSettings(extensionApi);
    await updateReviewBadge(extensionApi, learningRecordStore, settings.dailyReviewBadge);
  } catch {
    // Badge refresh must not make vocabulary or review mutations fail.
  }
}

const handleBackgroundMessage = createBackgroundMessageHandler({
  learningRecords: learningRecordStore,
  reviewSettings,
  refreshBadge: refreshReviewBadge,
});

extensionApi?.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (handleBackgroundMessage(message, sendResponse)) {
    return true;
  }

  if (!isTranslateMessage(message)) {
    return undefined;
  }

  void handleTranslate(message.payload).then(sendResponse);
  return true;
});

extensionApi?.storage.onChanged?.addListener((_changes, areaName) => {
  if (areaName === "sync") {
    void refreshReviewBadge();
  }
});

void refreshReviewBadge();

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
