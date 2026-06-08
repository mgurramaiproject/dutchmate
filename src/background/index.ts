import {
  PlaceholderTranslationProvider,
  type TranslationRequest,
  type TranslationResult,
} from "../translation/provider";

const TRANSLATE_MESSAGE = "hoverTranslate.translate";
const MAX_CACHE_ENTRIES = 100;
const defaultSettings: ExtensionSettings = {
  targetLanguage: "en",
  providerEndpoint: "",
  providerApiKey: "",
};

type ExtensionSettings = {
  targetLanguage: string;
  providerEndpoint: string;
  providerApiKey: string;
};

type TranslateMessage = {
  type: typeof TRANSLATE_MESSAGE;
  payload: TranslationRequest;
};

type TranslateMessageResponse =
  | {
      ok: true;
      result: TranslationResult;
    }
  | {
      ok: false;
      error: string;
    };

type ExtensionRuntimeApi = {
  storage: {
    sync: {
      get(defaults: ExtensionSettings, callback: (settings: Partial<ExtensionSettings>) => void): void;
    };
  };
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
  browser?: ExtensionRuntimeApi;
  chrome?: ExtensionRuntimeApi;
};
const extensionApi = extensionGlobal.chrome ?? extensionGlobal.browser;
const placeholderProvider = new PlaceholderTranslationProvider();
const translationCache = new Map<string, TranslationResult>();

extensionApi?.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isTranslateMessage(message)) {
    return undefined;
  }

  void translate(message.payload).then(sendResponse);
  return true;
});

async function translate(request: TranslationRequest): Promise<TranslateMessageResponse> {
  try {
    const settings = await readSettings();
    const result = settings.providerEndpoint
      ? await translateWithEndpoint(request, settings)
      : await placeholderProvider.translate(request);

    return { ok: true, result };
  } catch (error) {
    return {
      ok: false,
      error: `Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

function isTranslateMessage(message: unknown): message is TranslateMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === TRANSLATE_MESSAGE &&
    "payload" in message
  );
}

async function translateWithEndpoint(
  request: TranslationRequest,
  settings: ExtensionSettings,
): Promise<TranslationResult> {
  const cacheKey = getCacheKey(request);
  const cachedResult = translationCache.get(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (settings.providerApiKey) {
    headers.Authorization = `Bearer ${settings.providerApiKey}`;
  }

  const response = await fetch(settings.providerEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Provider returned ${response.status}`);
  }

  const payload = await response.json();
  const translatedText = getTranslatedText(payload);

  if (!translatedText) {
    throw new Error("Provider response is missing translatedText");
  }

  const result: TranslationResult = {
    translatedText,
    providerName: "custom-endpoint",
  };

  rememberTranslation(cacheKey, result);
  return result;
}

function getTranslatedText(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "translatedText" in payload &&
    typeof payload.translatedText === "string"
  ) {
    return payload.translatedText;
  }

  return null;
}

function getCacheKey(request: TranslationRequest): string {
  return `${request.targetLanguage}:${request.context}:${request.text}`;
}

function rememberTranslation(cacheKey: string, result: TranslationResult): void {
  if (translationCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = translationCache.keys().next().value;

    if (oldestKey) {
      translationCache.delete(oldestKey);
    }
  }

  translationCache.set(cacheKey, result);
}

async function readSettings(): Promise<ExtensionSettings> {
  if (!extensionApi) {
    return defaultSettings;
  }

  return new Promise((resolve) => {
    extensionApi.storage.sync.get(defaultSettings, (stored) => {
      if (extensionApi.runtime.lastError) {
        resolve(defaultSettings);
        return;
      }

      resolve({
        targetLanguage: getStringSetting(stored.targetLanguage, defaultSettings.targetLanguage),
        providerEndpoint: getStringSetting(stored.providerEndpoint, defaultSettings.providerEndpoint),
        providerApiKey: getStringSetting(stored.providerApiKey, defaultSettings.providerApiKey),
      });
    });
  });
}

function getStringSetting(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
