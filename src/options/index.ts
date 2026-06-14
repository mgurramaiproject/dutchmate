import browser from "webextension-polyfill";
import {
  defaultSettings,
  readSettings,
  validateProviderEndpoint,
  validateHoverDelayMs,
  validateMaxSelectionLength,
  type ExtensionSettings,
  type HoverTranslationMode,
} from "../shared/settings";
import { MVP_LANGUAGES, getMvpLanguageCode, getSourceLanguageCode } from "../shared/languages";
import { getCachedWordCount } from "./cache-summary";
import "./styles.css";

const PERSISTENT_TRANSLATION_CACHE_KEY = "dutchmate.translationCache.v1";

const form = document.querySelector<HTMLFormElement>("#options-form");
const isEnabled = document.querySelector<HTMLInputElement>("#is-enabled");
const translateOnHover = document.querySelector<HTMLInputElement>("#translate-on-hover");
const translateOnSelection = document.querySelector<HTMLInputElement>("#translate-on-selection");
const hoverTranslationMode = document.querySelector<HTMLSelectElement>("#hover-translation-mode");
const hoverDelayMs = document.querySelector<HTMLInputElement>("#hover-delay-ms");
const maxSelectionLength = document.querySelector<HTMLInputElement>("#max-selection-length");
const hoverDelayValue = document.querySelector<HTMLOutputElement>("#hover-delay-value");
const maxSelectionLengthValue = document.querySelector<HTMLOutputElement>("#max-selection-length-value");
const sourceLanguage = document.querySelector<HTMLSelectElement>("#source-language");
const targetLanguage = document.querySelector<HTMLSelectElement>("#target-language");
const translateToOtherMvpLanguages = document.querySelector<HTMLInputElement>(
  "#translate-to-other-mvp-languages",
);
const providerEndpoint = document.querySelector<HTMLInputElement>("#provider-endpoint");
const providerApiKey = document.querySelector<HTMLInputElement>("#provider-api-key");
const testEndpoint = document.querySelector<HTMLButtonElement>("#test-endpoint");
const cacheCount = document.querySelector<HTMLSpanElement>("#cache-count");
const clearCache = document.querySelector<HTMLButtonElement>("#clear-cache");
const status = document.querySelector<HTMLParagraphElement>("#status");
let statusTimer: number | undefined;

renderLanguageOptions();
void restoreSettings();
void refreshCacheCount();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  void saveSettings();
});

testEndpoint?.addEventListener("click", () => {
  void testProviderEndpoint();
});

clearCache?.addEventListener("click", () => {
  void clearTranslationCache();
});

hoverDelayMs?.addEventListener("input", updateTuningValueLabels);
maxSelectionLength?.addEventListener("input", updateTuningValueLabels);

async function restoreSettings(): Promise<void> {
  const settings = await readSettings();

  if (sourceLanguage) {
    sourceLanguage.value = settings.sourceLanguage;
  }

  if (targetLanguage) {
    targetLanguage.value = settings.targetLanguage;
  }

  if (translateToOtherMvpLanguages) {
    translateToOtherMvpLanguages.checked = settings.translateToOtherMvpLanguages;
  }

  if (isEnabled) {
    isEnabled.checked = settings.isEnabled;
  }

  if (translateOnHover) {
    translateOnHover.checked = settings.translateOnHover;
  }

  if (translateOnSelection) {
    translateOnSelection.checked = settings.translateOnSelection;
  }

  if (hoverTranslationMode) {
    hoverTranslationMode.value = settings.hoverTranslationMode;
  }

  if (hoverDelayMs) {
    hoverDelayMs.value = settings.hoverDelayMs.toString();
  }

  if (maxSelectionLength) {
    maxSelectionLength.value = settings.maxSelectionLength.toString();
  }

  updateTuningValueLabels();

  if (providerEndpoint) {
    providerEndpoint.value = settings.providerEndpoint;
  }

  if (providerApiKey) {
    providerApiKey.value = settings.providerApiKey;
  }
}

async function saveSettings(): Promise<void> {
  const endpoint = providerEndpoint?.value.trim() || "";
  const hoverDelayValue = readNumberInput(hoverDelayMs, defaultSettings.hoverDelayMs);
  const maxSelectionLengthValue = readNumberInput(
    maxSelectionLength,
    defaultSettings.maxSelectionLength,
  );
  const endpointError = validateProviderEndpoint(endpoint);
  const hoverDelayError = validateHoverDelayMs(hoverDelayValue);
  const selectionLengthError = validateMaxSelectionLength(maxSelectionLengthValue);

  if (endpointError) {
    showStatus(endpointError, "error");
    providerEndpoint?.focus();
    return;
  }

  if (hoverDelayError) {
    showStatus(hoverDelayError, "error");
    hoverDelayMs?.focus();
    return;
  }

  if (selectionLengthError) {
    showStatus(selectionLengthError, "error");
    maxSelectionLength?.focus();
    return;
  }

  const settings: ExtensionSettings = {
    isEnabled: isEnabled?.checked ?? defaultSettings.isEnabled,
    translateOnHover: translateOnHover?.checked ?? defaultSettings.translateOnHover,
    translateOnSelection: translateOnSelection?.checked ?? defaultSettings.translateOnSelection,
    hoverTranslationMode: getHoverTranslationMode(
      hoverTranslationMode?.value,
      defaultSettings.hoverTranslationMode,
    ),
    hoverDelayMs: hoverDelayValue,
    maxSelectionLength: maxSelectionLengthValue,
    sourceLanguage: getSourceLanguageCode(sourceLanguage?.value, defaultSettings.sourceLanguage),
    targetLanguage: getMvpLanguageCode(targetLanguage?.value, defaultSettings.targetLanguage),
    translateToOtherMvpLanguages:
      translateToOtherMvpLanguages?.checked ?? defaultSettings.translateToOtherMvpLanguages,
    providerEndpoint: endpoint,
    providerApiKey: providerApiKey?.value.trim() || "",
  };

  await browser.storage.sync.set(settings);
  showStatus("Saved", "success");
}

async function refreshCacheCount(): Promise<void> {
  if (!cacheCount) {
    return;
  }

  const storedCache = await browser.storage.local.get(PERSISTENT_TRANSLATION_CACHE_KEY);
  const count = getCachedWordCount(storedCache[PERSISTENT_TRANSLATION_CACHE_KEY]);
  cacheCount.textContent = `Cached words: ${count}`;
}

async function clearTranslationCache(): Promise<void> {
  setClearCacheButtonBusy(true);

  try {
    await browser.storage.local.remove(PERSISTENT_TRANSLATION_CACHE_KEY);
    await refreshCacheCount();
    showStatus("Translation cache cleared", "success");
  } catch (error) {
    showStatus(
      `Could not clear cache: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
      4000,
    );
  } finally {
    setClearCacheButtonBusy(false);
  }
}

function getHoverTranslationMode(
  value: string | undefined,
  fallback: HoverTranslationMode,
): HoverTranslationMode {
  return value === "word" || value === "sentence" ? value : fallback;
}

function readNumberInput(input: HTMLInputElement | null, fallback: number): number {
  if (!input) {
    return fallback;
  }

  return Number(input.value);
}

function updateTuningValueLabels(): void {
  if (hoverDelayValue) {
    hoverDelayValue.value = `${readNumberInput(hoverDelayMs, defaultSettings.hoverDelayMs)} ms`;
  }

  if (maxSelectionLengthValue) {
    maxSelectionLengthValue.value = `${readNumberInput(
      maxSelectionLength,
      defaultSettings.maxSelectionLength,
    )} chars`;
  }
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
      sourceLanguage: getSourceLanguageCode(sourceLanguage?.value, defaultSettings.sourceLanguage),
      targetLanguage: getMvpLanguageCode(targetLanguage?.value, defaultSettings.targetLanguage),
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

function renderLanguageOptions(): void {
  if (sourceLanguage) {
    const autoOption = document.createElement("option");
    autoOption.value = "auto";
    autoOption.textContent = "Auto";

    sourceLanguage.replaceChildren(
      autoOption,
      ...MVP_LANGUAGES.map((language) => {
        const option = document.createElement("option");
        option.value = language.code;
        option.textContent = language.label;
        return option;
      }),
    );
  }

  if (!targetLanguage) {
    return;
  }

  targetLanguage.replaceChildren(
    ...MVP_LANGUAGES.map((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = language.label;
      return option;
    }),
  );
}

function setTestButtonBusy(isBusy: boolean): void {
  if (!testEndpoint) {
    return;
  }

  testEndpoint.disabled = isBusy;
  testEndpoint.textContent = isBusy ? "Testing..." : "Test endpoint";
}

function setClearCacheButtonBusy(isBusy: boolean): void {
  if (!clearCache) {
    return;
  }

  clearCache.disabled = isBusy;
  clearCache.textContent = isBusy ? "Clearing..." : "Clear translation cache";
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
