import {
  REVIEW_CLEAR_MESSAGE,
  REVIEW_EXPORT_MESSAGE,
  REVIEW_IMPORT_MESSAGE,
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  type ReviewSettingsChanges,
  type ReviewMessage,
  type ReviewMessageResponse,
  type SettingsMessage,
  type SettingsMessageResponse,
} from "../background/messages";
import type { ExtensionSettings } from "../shared/settings";
import type { ReviewCard } from "../vocabulary/review-cards";
import type { VocabularyBackup } from "../vocabulary/vocabulary-backup";

export type PopupSettingsRuntimeApi = {
  runtime: {
    sendMessage(message: SettingsMessage | ReviewMessage): Promise<SettingsMessageResponse | ReviewMessageResponse>;
  };
};

export type SettingsClient = {
  getSettings(): Promise<ExtensionSettings>;
  updateSettings(changes: Partial<ReviewSettingsChanges>): Promise<ExtensionSettings>;
  exportVocabulary(): Promise<VocabularyBackup>;
  importVocabulary(document: string): Promise<{ importedCount: number; totalCount: number }>;
  clearVocabulary(): Promise<void>;
};

export function createSettingsClient(extensionApi: PopupSettingsRuntimeApi): SettingsClient {
  return {
    async getSettings() {
      const response = await extensionApi.runtime.sendMessage({ type: REVIEW_SETTINGS_MESSAGE });
      return getSettingsFromResponse(response);
    },
    async updateSettings(changes) {
      const response = await extensionApi.runtime.sendMessage({
        type: REVIEW_SETTINGS_UPDATE_MESSAGE,
        payload: changes,
      });
      return getSettingsFromResponse(response);
    },
    async exportVocabulary() {
      const response = await extensionApi.runtime.sendMessage({ type: REVIEW_EXPORT_MESSAGE });
      if (isSuccessfulResponse(response) && "backup" in response.result) {
        return response.result.backup as VocabularyBackup;
      }
      throw new Error(getResponseError(response, "Vocabulary export is unavailable."));
    },
    async importVocabulary(document) {
      const response = await extensionApi.runtime.sendMessage({
        type: REVIEW_IMPORT_MESSAGE,
        payload: { document },
      });
      if (!isImportedResponse(response)) {
        throw new Error(getResponseError(response, "Vocabulary import failed."));
      }
      return {
        importedCount: response.result.importedCount,
        totalCount: response.result.totalCount,
      };
    },
    async clearVocabulary() {
      const response = await extensionApi.runtime.sendMessage({ type: REVIEW_CLEAR_MESSAGE });
      if (
        !isSuccessfulResponse(response) ||
        !("cleared" in response.result) ||
        response.result.cleared !== true
      ) {
        throw new Error(getResponseError(response, "Vocabulary could not be cleared."));
      }
    },
  };
}

function getSettingsFromResponse(
  response: SettingsMessageResponse | ReviewMessageResponse,
): ExtensionSettings {
  if (response.ok && "settings" in response.result) {
    return response.result.settings;
  }

  throw new Error("error" in response ? response.error : "Settings are unavailable.");
}

function isSuccessfulResponse(response: unknown): response is { ok: true; result: Record<string, unknown> } {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "result" in response &&
    typeof response.result === "object" &&
    response.result !== null
  );
}

function isImportedResponse(response: unknown): response is {
  ok: true;
  result: { cards: ReviewCard[]; importedCount: number; totalCount: number };
} {
  return (
    isSuccessfulResponse(response) &&
    Array.isArray(response.result.cards) &&
    typeof response.result.importedCount === "number" &&
    typeof response.result.totalCount === "number"
  );
}

function getResponseError(response: unknown, fallback: string): string {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === false &&
    "error" in response &&
    typeof response.error === "string"
  ) ? response.error : fallback;
}
