import browser from "webextension-polyfill";
import {
  defaultSettings,
  readSettings,
  validateProviderEndpoint,
  type ExtensionSettings,
} from "../shared/settings";
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
  const settings = await readSettings();

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
  const endpoint = providerEndpoint?.value.trim() || "";
  const endpointError = validateProviderEndpoint(endpoint);

  if (endpointError) {
    showStatus(endpointError, "error");
    providerEndpoint?.focus();
    return;
  }

  const settings: ExtensionSettings = {
    targetLanguage: targetLanguage?.value || defaultSettings.targetLanguage,
    providerEndpoint: endpoint,
    providerApiKey: providerApiKey?.value.trim() || "",
  };

  await browser.storage.sync.set(settings);
  showStatus("Saved", "success");
}

function showStatus(message: string, tone: "success" | "error"): void {
  if (!status) {
    return;
  }

  status.dataset.tone = tone;
  status.textContent = message;
  window.setTimeout(() => {
    status.textContent = "";
    delete status.dataset.tone;
  }, 1800);
}
