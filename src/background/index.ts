import {
  PlaceholderTranslationProvider,
  type TranslationRequest,
} from "../translation/provider";

const TRANSLATE_MESSAGE = "hoverTranslate.translate";

type TranslateMessage = {
  type: typeof TRANSLATE_MESSAGE;
  payload: TranslationRequest;
};

type TranslateMessageResponse =
  | {
      ok: true;
      result: Awaited<ReturnType<PlaceholderTranslationProvider["translate"]>>;
    }
  | {
      ok: false;
      error: string;
    };

type ExtensionRuntimeApi = {
  runtime: {
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
const provider = new PlaceholderTranslationProvider();

extensionApi?.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isTranslateMessage(message)) {
    return undefined;
  }

  void translate(message.payload).then(sendResponse);
  return true;
});

async function translate(request: TranslationRequest): Promise<TranslateMessageResponse> {
  try {
    const result = await provider.translate(request);
    return {
      ok: true,
      result,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Translation failed",
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
