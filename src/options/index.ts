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
const testEndpoint = document.querySelector<HTMLButtonElement>("#test-endpoint");
const status = document.querySelector<HTMLParagraphElement>("#status");
let statusTimer: number | undefined;

void restoreSettings();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  void saveSettings();
});

testEndpoint?.addEventListener("click", () => {
  void testProviderEndpoint();
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

async function testProviderEndpoint(): Promise<void> {
  const endpoint = providerEndpoint?.value.trim() || "";
  const endpointError = validateProviderEndpoint(endpoint);

  if (!endpoint) {
    showStatus("Enter a provider endpoint to test.", "error");
    providerEndpoint?.focus();
    return;
  }

  if (endpointError) {
    showStatus(endpointError, "error");
    providerEndpoint?.focus();
    return;
  }

  setTestButtonBusy(true);
  showStatus("Testing endpoint...", "neutral", 0);

  try {
    const translatedText = await requestEndpointTest(endpoint, providerApiKey?.value.trim() || "");
    showStatus(`Endpoint OK: ${translatedText}`, "success", 4000);
  } catch (error) {
    showStatus(
      `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
      4000,
    );
  } finally {
    setTestButtonBusy(false);
  }
}

async function requestEndpointTest(endpoint: string, apiKey: string): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      text: "bonjour",
      sourceLanguage: "auto",
      targetLanguage: targetLanguage?.value || defaultSettings.targetLanguage,
      context: "selection",
    }),
  });

  if (!response.ok) {
    throw new Error(`Provider returned ${response.status}`);
  }

  const payload = await response.json();

  if (
    typeof payload === "object" &&
    payload !== null &&
    "translatedText" in payload &&
    typeof payload.translatedText === "string"
  ) {
    return payload.translatedText;
  }

  throw new Error("Provider response is missing translatedText");
}

function setTestButtonBusy(isBusy: boolean): void {
  if (!testEndpoint) {
    return;
  }

  testEndpoint.disabled = isBusy;
  testEndpoint.textContent = isBusy ? "Testing..." : "Test endpoint";
}

function showStatus(
  message: string,
  tone: "success" | "error" | "neutral",
  timeoutMs = 1800,
): void {
  if (!status) {
    return;
  }

  status.dataset.tone = tone;
  status.textContent = message;
  window.clearTimeout(statusTimer);

  if (timeoutMs === 0) {
    return;
  }

  statusTimer = window.setTimeout(() => {
    status.textContent = "";
    delete status.dataset.tone;
  }, timeoutMs);
}
