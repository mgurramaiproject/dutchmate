import { requestContentTranslation } from "./content-translation-request";
import { requestDirectTranslation } from "./direct-translation-request";
import { requestRuntimeTranslation, type RuntimeTranslationExtensionApi } from "./runtime-translation-client";
import {
  requestRuntimeSavedVocabularyList,
  requestRuntimeSaveVocabularyBatch,
  requestRuntimeCreateLearningItem,
  type RuntimeSaveVocabularyBatchResponse,
  type RuntimeSaveVocabularyRequest,
  type RuntimeVocabularyExtensionApi,
} from "./runtime-vocabulary-client";
import type { CreateOrMergeLearningItemInput } from "../vocabulary/learning-record";
import type { MvpLanguageCode, SourceLanguageCode } from "../shared/languages";
import type { ExtensionSettings } from "../shared/settings";
import {
  PersistentTranslationCache,
  type PersistentTranslationCacheStorage,
} from "../translation/persistent-translation-cache";
import { shouldPersistTranslation } from "../translation/persistent-cache-policy";
import type { TranslateMessageResponse } from "./runtime-translation-client";

export type BrowserTarget = "chrome" | "firefox";

type ExtensionStorageApi = {
  storage: {
    local: {
      get(keys: string | string[], callback: (items: Record<string, unknown>) => void): void;
      set(items: Record<string, unknown>, callback?: () => void): void;
    };
  };
  runtime: RuntimeTranslationExtensionApi["runtime"];
};

type RuntimeLookupAdapterDependencies = {
  browserTarget: BrowserTarget;
  chromeDirectTranslationFallbackMs: number;
  directTranslationTimeoutMs: number;
  extensionApi: (RuntimeTranslationExtensionApi & RuntimeVocabularyExtensionApi & ExtensionStorageApi) | undefined;
  getSettings(): ExtensionSettings;
  delay(ms: number): Promise<void>;
};

export function createRuntimeLookupAdapter(
  dependencies: RuntimeLookupAdapterDependencies,
): {
  translate(request: {
    text: string;
    context: "hover" | "selection";
    sourceLanguage: SourceLanguageCode;
    targetLanguage: MvpLanguageCode;
  }): Promise<TranslateMessageResponse>;
  listSavedVocabularyIds(): Promise<Set<string> | undefined>;
  saveVocabularyBatch(
    requests: RuntimeSaveVocabularyRequest[],
  ): Promise<RuntimeSaveVocabularyBatchResponse>;
  saveLearningItem(input: CreateOrMergeLearningItemInput): ReturnType<typeof requestRuntimeCreateLearningItem>;
} {
  let directTranslationCache: PersistentTranslationCache | undefined;

  function getDirectTranslationCache(): PersistentTranslationCache {
    directTranslationCache ??= new PersistentTranslationCache(
      new ContentLocalCacheStorage(dependencies.extensionApi),
      {
        shouldPersist: (request) =>
          shouldPersistTranslation(request, undefined, {
            cacheHoveredWords: dependencies.getSettings().cacheHoveredWords,
          }),
      },
    );

    return directTranslationCache;
  }

  return {
    async translate(request) {
      const settings = dependencies.getSettings();
      return requestContentTranslation(request, {
        browserTarget: dependencies.browserTarget,
        cache: getDirectTranslationCache(),
        extensionApi: dependencies.extensionApi,
        requestDirectTranslation: (directRequest) =>
          requestDirectTranslation(directRequest, {
            providerEndpoint: settings.providerEndpoint,
            providerApiKey: settings.providerApiKey,
            timeoutMs: dependencies.directTranslationTimeoutMs,
          }),
        requestRuntimeTranslation,
        chromeDirectTranslationFallbackMs: dependencies.chromeDirectTranslationFallbackMs,
        delay: dependencies.delay,
      });
    },

    async listSavedVocabularyIds() {
      const response = await requestRuntimeSavedVocabularyList(dependencies.extensionApi);
      if (!response.ok) {
        return undefined;
      }

      return new Set(response.result.entries.map((entry) => entry.id));
    },

    saveVocabularyBatch(requests) {
      return requestRuntimeSaveVocabularyBatch(dependencies.extensionApi, requests);
    },
    saveLearningItem(input) {
      return requestRuntimeCreateLearningItem(dependencies.extensionApi, input);
    },
  };
}

class ContentLocalCacheStorage implements PersistentTranslationCacheStorage {
  constructor(private readonly api: ExtensionStorageApi | undefined) {}

  async get(key: string): Promise<unknown> {
    if (!this.api) {
      return undefined;
    }

    return new Promise((resolve) => {
      this.api?.storage.local.get(key, (items) => {
        if (this.api?.runtime.lastError) {
          resolve(undefined);
          return;
        }

        resolve(items[key]);
      });
    });
  }

  async set(key: string, value: unknown): Promise<void> {
    if (!this.api) {
      return;
    }

    return new Promise((resolve) => {
      this.api?.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }
}
