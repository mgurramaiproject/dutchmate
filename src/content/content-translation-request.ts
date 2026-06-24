import type { TranslationRequest, TranslationResult } from "../translation/provider";
import type { PersistentTranslationCache } from "../translation/persistent-translation-cache";
import type {
  RuntimeTranslationExtensionApi,
  TranslateMessageResponse,
} from "./runtime-translation-client";

export type BrowserTarget = "chrome" | "firefox";

export type ContentTranslationRequestDependencies = {
  browserTarget: BrowserTarget;
  cache: Pick<PersistentTranslationCache, "get" | "set">;
  extensionApi: RuntimeTranslationExtensionApi | undefined;
  requestDirectTranslation(request: TranslationRequest): Promise<TranslateMessageResponse>;
  requestRuntimeTranslation(
    extensionApi: RuntimeTranslationExtensionApi | undefined,
    request: TranslationRequest,
  ): Promise<TranslateMessageResponse>;
  chromeDirectTranslationFallbackMs: number;
  delay(ms: number): Promise<void>;
};

export async function requestContentTranslation(
  request: TranslationRequest,
  dependencies: ContentTranslationRequestDependencies,
): Promise<TranslateMessageResponse> {
  const cachedResult = await dependencies.cache.get(request);

  if (cachedResult) {
    return {
      ok: true,
      result: cachedResult,
    };
  }

  const response =
    dependencies.browserTarget === "chrome"
      ? await requestChromeTranslation(request, dependencies)
      : await dependencies.requestRuntimeTranslation(dependencies.extensionApi, request);

  await cacheTranslationResponse(request, response, dependencies.cache);
  return response;
}

async function requestChromeTranslation(
  request: TranslationRequest,
  dependencies: ContentTranslationRequestDependencies,
): Promise<TranslateMessageResponse> {
  await dependencies.delay(dependencies.chromeDirectTranslationFallbackMs);
  return dependencies.requestDirectTranslation(request);
}

async function cacheTranslationResponse(
  request: TranslationRequest,
  response: TranslateMessageResponse,
  cache: Pick<PersistentTranslationCache, "set">,
): Promise<void> {
  if (!response.ok) {
    return;
  }

  await cache.set(request, response.result);
}

export function createMemoryCache(
  initial: TranslationResult | null = null,
): Pick<PersistentTranslationCache, "get" | "set"> & { stored: TranslationResult | null } {
  const state = {
    stored: initial,
  };

  return {
    get: async () => state.stored,
    set: async (_request, result) => {
      state.stored = result;
    },
    get stored() {
      return state.stored;
    },
  };
}
