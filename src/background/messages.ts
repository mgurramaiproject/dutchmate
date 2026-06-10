import type { TranslationRequest, TranslationResult } from "../translation/provider";

export const TRANSLATE_MESSAGE = "hoverTranslate.translate";

export type TranslateMessage = {
  type: typeof TRANSLATE_MESSAGE;
  payload: TranslationRequest;
};

export type TranslateMessageResponse =
  | {
      ok: true;
      result: TranslationResult;
    }
  | {
      ok: false;
      error: string;
    };

export function isTranslateMessage(message: unknown): message is TranslateMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === TRANSLATE_MESSAGE &&
    "payload" in message
  );
}

