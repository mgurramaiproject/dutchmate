import browser from "webextension-polyfill";
import { defaultSettings, type ExtensionSettings } from "../shared/settings";
import "./styles.css";

const form = document.querySelector<HTMLFormElement>("#options-form");
const targetLanguage = document.querySelector<HTMLSelectElement>("#target-language");
const providerEndpoint = document.querySelector<HTMLInputElement>("#provider-endpoint");
const providerApiKey = document.querySelector<HTMLInputElement>("#provider-api-key");
const status = document.querySelector<HTMLParagraphElement>("#status");

void restoreSettings();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  void saveSettings();
});

async function restoreSettings(): Promise<void> {
  const stored = await browser.storage.sync.get(defaultSettings);
  const settings = stored as ExtensionSettings;

  if (targetLanguage) {
    targetLanguage.value = settings.targetLanguage;
  }

  if (providerEndpoint) {
    providerEndpoint.value = settings.providerEndpoint;
  }

  if (providerApiKey) {
    providerApiKey.value = settings.providerApiKey;
  }
}

async function saveSettings(): Promise<void> {
  const settings: ExtensionSettings = {
    targetLanguage: targetLanguage?.value || defaultSettings.targetLanguage,
    providerEndpoint: providerEndpoint?.value.trim() || "",
    providerApiKey: providerApiKey?.value.trim() || "",
  };

  await browser.storage.sync.set(settings);
  showStatus("Saved");
}

function showStatus(message: string): void {
  if (!status) {
    return;
  }

  status.textContent = message;
  window.setTimeout(() => {
    status.textContent = "";
  }, 1800);
}

