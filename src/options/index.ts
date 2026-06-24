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
import {
  applyLanguageRoleSelection,
  normalizeLanguageRoles,
  type LanguageRole,
  type LanguageRoleSettings,
} from "../shared/language-roles";
import { MVP_LANGUAGES, getMvpLanguageCode, getSourceLanguageCode } from "../shared/languages";
import { getCachedWordCount } from "./cache-summary";
import { createSavedVocabularyClient } from "./saved-vocabulary-client";
import { shouldRefreshSavedVocabulary, type StorageChange } from "./saved-vocabulary-refresh";
import type { SavedVocabularyEntry } from "../vocabulary/saved-vocabulary";
import "./styles.css";

const PERSISTENT_TRANSLATION_CACHE_KEY = "dutchmate.translationCache.v1";

const form = document.querySelector<HTMLFormElement>("#options-form");
const isEnabled = document.querySelector<HTMLInputElement>("#is-enabled");
const translateOnHover = document.querySelector<HTMLInputElement>("#translate-on-hover");
const translateOnSelection = document.querySelector<HTMLInputElement>("#translate-on-selection");
const cacheHoveredWords = document.querySelector<HTMLInputElement>("#cache-hovered-words");
const hoverTranslationModes = document.querySelectorAll<HTMLInputElement>(
  'input[name="hoverTranslationMode"]',
);
const hoverDelayMs = document.querySelector<HTMLInputElement>("#hover-delay-ms");
const maxSelectionLength = document.querySelector<HTMLInputElement>("#max-selection-length");
const hoverDelayValue = document.querySelector<HTMLOutputElement>("#hover-delay-value");
const maxSelectionLengthValue = document.querySelector<HTMLOutputElement>("#max-selection-length-value");
const learningLanguage = document.querySelector<HTMLSelectElement>("#learning-language");
const nativeLanguage = document.querySelector<HTMLSelectElement>("#native-language");
const bridgeLanguage = document.querySelector<HTMLSelectElement>("#bridge-language");
let providerEndpoint: HTMLInputElement | null = null;
let providerApiKey: HTMLInputElement | null = null;
let testEndpoint: HTMLButtonElement | null = null;
const cacheCount = document.querySelector<HTMLSpanElement>("#cache-count");
const clearCache = document.querySelector<HTMLButtonElement>("#clear-cache");
const vocabularyCount = document.querySelector<HTMLSpanElement>("#vocabulary-count");
const vocabularyEmpty = document.querySelector<HTMLParagraphElement>("#vocabulary-empty");
const vocabularyList = document.querySelector<HTMLUListElement>("#vocabulary-list");
const refreshVocabulary = document.querySelector<HTMLButtonElement>("#refresh-vocabulary");
const clearVocabulary = document.querySelector<HTMLButtonElement>("#clear-vocabulary");
const status = document.querySelector<HTMLParagraphElement>("#status");
let statusTimer: number | undefined;
let currentLanguageRoles: LanguageRoleSettings = normalizeLanguageRoles(undefined);
const vocabularyClient = createSavedVocabularyClient(browser);

renderAdvancedLocalTesting();
renderLanguageOptions();
void restoreSettings();
void refreshCacheCount();
void refreshSavedVocabulary();
browser.storage.onChanged.addListener(handleStorageChanged);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  void saveSettings();
});

clearCache?.addEventListener("click", () => {
  void clearTranslationCache();
});

clearVocabulary?.addEventListener("click", () => {
  void clearSavedVocabulary();
});

refreshVocabulary?.addEventListener("click", () => {
  void refreshSavedVocabulary({ showSuccessStatus: true });
});

hoverDelayMs?.addEventListener("input", updateTuningValueLabels);
maxSelectionLength?.addEventListener("input", updateTuningValueLabels);
learningLanguage?.addEventListener("change", () => {
  updateLanguageRoleSelection("learningLanguage", learningLanguage.value);
});
nativeLanguage?.addEventListener("change", () => {
  updateLanguageRoleSelection("nativeLanguage", nativeLanguage.value);
});
bridgeLanguage?.addEventListener("change", () => {
  updateLanguageRoleSelection("bridgeLanguage", bridgeLanguage.value);
});

async function restoreSettings(): Promise<void> {
  const settings = await readSettings();
  currentLanguageRoles = normalizeLanguageRoles({
    learningLanguage: settings.learningLanguage,
    nativeLanguage: settings.nativeLanguage,
    bridgeLanguage: settings.bridgeLanguage,
  });
  syncLanguageRoleInputs();

  if (isEnabled) {
    isEnabled.checked = settings.isEnabled;
  }

  if (translateOnHover) {
    translateOnHover.checked = settings.translateOnHover;
  }

  if (translateOnSelection) {
    translateOnSelection.checked = settings.translateOnSelection;
  }

  if (cacheHoveredWords) {
    cacheHoveredWords.checked = settings.cacheHoveredWords;
  }

  setHoverTranslationMode(settings.hoverTranslationMode);

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
  const currentSettings = await readSettings();
  const endpoint = providerEndpoint
    ? providerEndpoint.value.trim()
    : currentSettings.providerEndpoint;
  const hoverDelayValue = readNumberInput(hoverDelayMs, defaultSettings.hoverDelayMs);
  const maxSelectionLengthValue = readNumberInput(
    maxSelectionLength,
    defaultSettings.maxSelectionLength,
  );
  const endpointError = validateProviderEndpoint(endpoint);
  const hoverDelayError = validateHoverDelayMs(hoverDelayValue);
  const selectionLengthError = validateMaxSelectionLength(maxSelectionLengthValue);
  const languageRoles = normalizeLanguageRoles(currentLanguageRoles);

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
    cacheHoveredWords: cacheHoveredWords?.checked ?? defaultSettings.cacheHoveredWords,
    hoverTranslationMode: getHoverTranslationMode(
      getSelectedHoverTranslationMode(),
      defaultSettings.hoverTranslationMode,
    ),
    hoverDelayMs: hoverDelayValue,
    maxSelectionLength: maxSelectionLengthValue,
    sourceLanguage: getSourceLanguageCode("auto", defaultSettings.sourceLanguage),
    targetLanguage: languageRoles.bridgeLanguage,
    translateToOtherMvpLanguages: true,
    learningLanguage: languageRoles.learningLanguage,
    nativeLanguage: languageRoles.nativeLanguage,
    bridgeLanguage: languageRoles.bridgeLanguage,
    providerEndpoint: endpoint,
    providerApiKey: providerApiKey ? providerApiKey.value.trim() : currentSettings.providerApiKey,
  };

  await browser.storage.sync.set(settings);
  showStatus("Saved", "success");
}

function renderAdvancedLocalTesting(): void {
  if (!__ENABLE_LOCAL_TESTING_OPTIONS__ || !form) {
    return;
  }

  const details = document.createElement("details");
  details.className = "advanced-settings";

  const summary = document.createElement("summary");
  summary.textContent = "Advanced local testing";

  const fieldset = document.createElement("fieldset");

  const note = document.createElement("p");
  note.className = "settings-note";
  note.textContent = "Optional local backend override for development and support testing.";

  const endpointLabel = document.createElement("label");
  endpointLabel.textContent = "Provider endpoint";
  providerEndpoint = document.createElement("input");
  providerEndpoint.id = "provider-endpoint";
  providerEndpoint.name = "providerEndpoint";
  providerEndpoint.type = "url";
  providerEndpoint.placeholder = "https://dutchmate-backend.onrender.com/translate";
  endpointLabel.append(providerEndpoint);

  const apiKeyLabel = document.createElement("label");
  apiKeyLabel.textContent = "Provider API key";
  providerApiKey = document.createElement("input");
  providerApiKey.id = "provider-api-key";
  providerApiKey.name = "providerApiKey";
  providerApiKey.type = "password";
  providerApiKey.placeholder = "Optional for local testing";
  apiKeyLabel.append(providerApiKey);

  const actions = document.createElement("div");
  actions.className = "form-actions";
  testEndpoint = document.createElement("button");
  testEndpoint.id = "test-endpoint";
  testEndpoint.type = "button";
  testEndpoint.className = "secondary-button";
  testEndpoint.textContent = "Test endpoint";
  testEndpoint.addEventListener("click", () => {
    void testProviderEndpoint();
  });
  actions.append(testEndpoint);

  fieldset.append(note, endpointLabel, apiKeyLabel, actions);
  details.append(summary, fieldset);
  form.insertBefore(details, form.querySelector("#privacy-section"));
}

async function refreshCacheCount(): Promise<void> {
  if (!cacheCount) {
    return;
  }

  const storedCache = await browser.storage.local.get(PERSISTENT_TRANSLATION_CACHE_KEY);
  const count = getCachedWordCount(storedCache[PERSISTENT_TRANSLATION_CACHE_KEY]);
  cacheCount.textContent = `Cached words: ${count}`;
}

async function refreshSavedVocabulary(options: { showSuccessStatus?: boolean } = {}): Promise<void> {
  if (!vocabularyCount || !vocabularyEmpty || !vocabularyList) {
    return;
  }

  setRefreshVocabularyButtonBusy(true);

  try {
    const entries = await vocabularyClient.list();
    renderSavedVocabulary(entries);

    if (options.showSuccessStatus) {
      showStatus("Saved vocabulary refreshed", "success");
    }
  } catch (error) {
    showStatus(
      `Could not load saved vocabulary: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
      4000,
    );
  } finally {
    setRefreshVocabularyButtonBusy(false);
  }
}

function handleStorageChanged(changes: Record<string, StorageChange>, areaName: string): void {
  if (!shouldRefreshSavedVocabulary(changes, areaName)) {
    return;
  }

  void refreshSavedVocabulary();
}

function setRefreshVocabularyButtonBusy(isBusy: boolean): void {
  if (!refreshVocabulary) {
    return;
  }

  refreshVocabulary.disabled = isBusy;
  refreshVocabulary.textContent = isBusy ? "…" : "↻";
}

function renderSavedVocabulary(entries: SavedVocabularyEntry[]): void {
  if (!vocabularyCount || !vocabularyEmpty || !vocabularyList) {
    return;
  }

  vocabularyCount.textContent = `Saved words: ${getUniqueSavedVocabularyWordCount(entries)}`;
  vocabularyEmpty.hidden = entries.length > 0;
  vocabularyList.hidden = entries.length === 0;
  vocabularyList.replaceChildren(...entries.map(createVocabularyListItem));
}

function createVocabularyListItem(entry: SavedVocabularyEntry): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "vocabulary-item";

  const text = document.createElement("span");
  text.className = "vocabulary-text";
  text.textContent = entry.text;

  const translation = document.createElement("span");
  translation.className = "vocabulary-translation";
  translation.textContent = entry.translatedText;

  const meta = document.createElement("span");
  meta.className = "vocabulary-meta";
  meta.textContent = `${formatLanguage(entry.detectedSourceLanguage ?? entry.sourceLanguage)} -> ${formatLanguage(entry.targetLanguage)}`;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "secondary-button compact-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    void deleteSavedVocabularyEntry(entry.id, deleteButton);
  });

  item.append(text, translation, meta, deleteButton);
  return item;
}

async function deleteSavedVocabularyEntry(
  id: string,
  deleteButton: HTMLButtonElement,
): Promise<void> {
  deleteButton.disabled = true;
  deleteButton.textContent = "Deleting...";

  try {
    await vocabularyClient.delete(id);
    await refreshSavedVocabulary();
    showStatus("Saved word deleted", "success");
  } catch (error) {
    showStatus(
      `Could not delete saved word: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
      4000,
    );
    deleteButton.disabled = false;
    deleteButton.textContent = "Delete";
  }
}

async function clearSavedVocabulary(): Promise<void> {
  setClearVocabularyButtonBusy(true);

  try {
    await vocabularyClient.clear();
    await refreshSavedVocabulary();
    showStatus("Saved vocabulary cleared", "success");
  } catch (error) {
    showStatus(
      `Could not clear saved vocabulary: ${error instanceof Error ? error.message : "Unknown error"}`,
      "error",
      4000,
    );
  } finally {
    setClearVocabularyButtonBusy(false);
  }
}

function getUniqueSavedVocabularyWordCount(entries: SavedVocabularyEntry[]): number {
  return new Set(entries.map((entry) => entry.normalizedText)).size;
}

function formatLanguage(languageCode: string): string {
  return MVP_LANGUAGES.find((language) => language.code === languageCode)?.label ?? languageCode;
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

function setHoverTranslationMode(mode: HoverTranslationMode): void {
  hoverTranslationModes.forEach((input) => {
    input.checked = input.value === mode;
  });
}

function getSelectedHoverTranslationMode(): string | undefined {
  return Array.from(hoverTranslationModes).find((input) => input.checked)?.value;
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
      sourceLanguage: getSourceLanguageCode("auto", defaultSettings.sourceLanguage),
      targetLanguage: currentLanguageRoles.bridgeLanguage,
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
  const options = MVP_LANGUAGES.map((language) => {
    const option = document.createElement("option");
    option.value = language.code;
    option.textContent = language.label;
    return option;
  });

  learningLanguage?.replaceChildren(...options.map((option) => option.cloneNode(true)));
  nativeLanguage?.replaceChildren(...options.map((option) => option.cloneNode(true)));
  bridgeLanguage?.replaceChildren(...options.map((option) => option.cloneNode(true)));
}

function updateLanguageRoleSelection(role: LanguageRole, selectedValue: string): void {
  currentLanguageRoles = applyLanguageRoleSelection(
    currentLanguageRoles,
    role,
    getMvpLanguageCode(selectedValue, currentLanguageRoles[role]),
  );
  syncLanguageRoleInputs();
}

function syncLanguageRoleInputs(): void {
  if (learningLanguage) {
    learningLanguage.value = currentLanguageRoles.learningLanguage;
  }

  if (nativeLanguage) {
    nativeLanguage.value = currentLanguageRoles.nativeLanguage;
  }

  if (bridgeLanguage) {
    bridgeLanguage.value = currentLanguageRoles.bridgeLanguage;
  }
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

function setClearVocabularyButtonBusy(isBusy: boolean): void {
  if (!clearVocabulary) {
    return;
  }

  clearVocabulary.disabled = isBusy;
  clearVocabulary.textContent = isBusy ? "Clearing..." : "Clear saved words";
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
