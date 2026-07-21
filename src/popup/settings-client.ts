import {
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  type ReviewSettingsChanges,
  type SettingsMessage,
  type SettingsMessageResponse,
} from "../background/messages";
import type { ExtensionSettings } from "../shared/settings";

export type PopupSettingsRuntimeApi = {
  runtime: {
    sendMessage(message: SettingsMessage): Promise<SettingsMessageResponse>;
  };
};

export type SettingsClient = {
  getSettings(): Promise<ExtensionSettings>;
  updateSettings(changes: Partial<ReviewSettingsChanges>): Promise<ExtensionSettings>;
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
  };
}

function getSettingsFromResponse(
  response: SettingsMessageResponse,
): ExtensionSettings {
  if (response.ok && "settings" in response.result) {
    return response.result.settings;
  }

  throw new Error("error" in response ? response.error : "Settings are unavailable.");
}
