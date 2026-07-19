import {
  REVIEW_SETTINGS_MESSAGE,
  REVIEW_SETTINGS_UPDATE_MESSAGE,
  type ReviewSettingsChanges,
  type SettingsMessage,
  type SettingsMessageResponse,
} from "./messages";
import type { ExtensionSettings } from "../shared/settings";

export type ReviewSettingsProvider = {
  read(): Promise<ExtensionSettings>;
  update(changes: Partial<ReviewSettingsChanges>): Promise<ExtensionSettings>;
};

export async function handleSettingsMessage(
  message: SettingsMessage,
  provider: ReviewSettingsProvider,
): Promise<SettingsMessageResponse> {
  try {
    const settings =
      message.type === REVIEW_SETTINGS_MESSAGE
        ? await provider.read()
        : await provider.update(message.payload);
    return { ok: true, result: { settings } };
  } catch {
    return { ok: false, error: "Review settings are unavailable." };
  }
}
