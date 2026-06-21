import type { TooltipContext } from "./tooltip-request-state";

const TRANSLATE_MESSAGE = "hoverTranslate.translate";
const DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS = 7000;

export type TranslateMessageResponse =
  | {
      ok: true;
      result: {
        translatedText: string;
        providerName: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

export type RuntimeTranslationExtensionApi = {
  runtime: {
    lastError?: { message?: string };
    sendMessage(
      message: unknown,
      callback: (response?: unknown) => void,
    ): void;
  };
};

export type RuntimeTranslationRequest = {
  text: string;
  context: TooltipContext;
  sourceLanguage: string;
  targetLanguage: string;
};

export function requestRuntimeTranslation(
  extensionApi: RuntimeTranslationExtensionApi | undefined,
  request: RuntimeTranslationRequest,
  timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS,
): Promise<TranslateMessageResponse> {
  if (!extensionApi) {
    return Promise.resolve({
      ok: false,
      error: "Extension runtime is unavailable.",
    });
  }

  return new Promise((resolve) => {
    let isSettled = false;
    const timeout = globalThis.setTimeout(() => {
      settle({
        ok: false,
        error: "Translation request timed out before the extension background worker responded.",
      });
    }, timeoutMs);

    const settle = (response: TranslateMessageResponse): void => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      globalThis.clearTimeout(timeout);
      resolve(response);
    };

    extensionApi.runtime.sendMessage(
      {
        type: TRANSLATE_MESSAGE,
        payload: {
          text: request.text,
          sourceLanguage: request.sourceLanguage,
          targetLanguage: request.targetLanguage,
          context: request.context,
        },
      },
      (response) => {
        if (extensionApi.runtime.lastError) {
          settle({
            ok: false,
            error: extensionApi.runtime.lastError.message ?? "Translation request failed.",
          });
          return;
        }

        settle(
          isTranslateMessageResponse(response)
            ? response
            : { ok: false, error: "No translation response received." },
        );
      },
    );
  });
}

function isTranslateMessageResponse(response: unknown): response is TranslateMessageResponse {
  if (typeof response !== "object" || response === null || !("ok" in response)) {
    return false;
  }

  if (response.ok === false) {
    return "error" in response && typeof response.error === "string";
  }

  return (
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null &&
    "translatedText" in response.result &&
    typeof response.result.translatedText === "string" &&
    "providerName" in response.result &&
    typeof response.result.providerName === "string"
  );
}
