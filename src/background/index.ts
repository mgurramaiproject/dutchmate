import { isTranslateMessage, type TranslateMessageResponse } from "./messages";
import { readProviderSettings, type BackgroundExtensionApi } from "./settings-adapter";
import { TranslationCache } from "../translation/translation-cache";
import { TranslationService } from "../translation/translation-service";

const MAX_CACHE_ENTRIES = 100;

type BackgroundRuntimeApi = BackgroundExtensionApi & {
  runtime: {
    lastError?: { message?: string };
    onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response: TranslateMessageResponse) => void,
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
const translationService = new TranslationService(
  () => readProviderSettings(extensionApi),
  new TranslationCache(MAX_CACHE_ENTRIES),
);

extensionApi?.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isTranslateMessage(message)) {
    return undefined;
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
      error: `Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
