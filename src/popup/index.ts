import browser from "webextension-polyfill";
import { createReviewClient } from "./review-client";
import { getLearnSummaryView, type LearnSummaryView } from "./learn-summary";
import {
  advancePracticeSession,
  createPracticeSession,
  getCurrentPracticeCard,
  revealPracticeAnswer,
  getPracticePrompt,
  type PracticeSessionState,
} from "./practice-session";
import type { ReviewCard, ReviewCardSummary, ReviewRating } from "../vocabulary/review-cards";
import {
  defaultSettings,
  type ExtensionSettings,
} from "../shared/settings";
import type { ReviewSettingsChanges } from "../background/messages";
import { createSettingsClient } from "./settings-client";
import { serializeVocabularyBackup } from "../vocabulary/vocabulary-backup";
import { getPopupTabForKey, type PopupTab } from "./tab-navigation";
import "./styles.css";

const content = document.querySelector<HTMLElement>("#popup-content");
const dueBadge = document.querySelector<HTMLElement>("#due-badge");
const learnTab = document.querySelector<HTMLButtonElement>("#learn-tab");
const settingsTab = document.querySelector<HTMLButtonElement>("#settings-tab");
const reviewClient = createReviewClient(browser);
const settingsClient = createSettingsClient(browser);
let activeTab: PopupTab = "learn";
let summary: ReviewCardSummary | null = null;
let practiceSession: PracticeSessionState | null = null;
let practicePending = false;
let ratingPending = false;
let vocabularyActionPending = false;
let vocabularyActionNotice: { message: string; kind: "success" | "error" } | null = null;
let settings: ExtensionSettings = defaultSettings;

const practiceModeLabel: Record<PracticeSessionState["mode"], string> = {
  due: "Due review",
  new: "New word",
  all: "All words",
};
const practiceModeDescription: Record<PracticeSessionState["mode"], string> = {
  due: "Review your due words.",
  new: "Practice your new words.",
  all: "Review all your words.",
};

learnTab?.addEventListener("click", () => activateTab("learn"));

settingsTab?.addEventListener("click", () => activateTab("settings"));

for (const [tab, button] of [["learn", learnTab], ["settings", settingsTab]] as const) {
  button?.addEventListener("keydown", (event) => {
    const nextTab = getPopupTabForKey(tab, event.key);
    if (!nextTab) {
      return;
    }

    event.preventDefault();
    activateTab(nextTab);
    document.querySelector<HTMLButtonElement>(`#${nextTab}-tab`)?.focus();
  });
}

render();
void loadSummary();
void loadSettings();

function activateTab(tab: PopupTab): void {
  activeTab = tab;
  if (tab === "learn") {
    practiceSession = null;
    void loadSummary();
  }
  render();
}

async function loadSettings(): Promise<void> {
  settings = await settingsClient.getSettings();
  render();
}

async function loadSummary(): Promise<void> {
  try {
    summary = await reviewClient.getSummary();
  } catch (error) {
    renderError(error instanceof Error ? error.message : "Review summary is unavailable.");
    return;
  }

  render();
}

function render(): void {
  if (!content) {
    return;
  }

  updateTabs();
  updateBadge();
  content.replaceChildren(activeTab === "learn" ? renderLearn() : renderSettings());
}

function renderLearn(): HTMLElement {
  if (practiceSession) {
    return renderPractice(practiceSession);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "learn-content";

  if (!summary) {
    wrapper.append(createEyebrow("Daily review"), createHeading("Loading your words..."));
    return wrapper;
  }

  const view = getLearnSummaryView(summary);

  const intro = document.createElement("section");
  intro.className = "summary-intro";
  intro.append(
    createEyebrow("Daily review"),
    createHeading(view.heading),
    createText(view.description),
  );

  const stats = document.createElement("div");
  stats.className = "stats";
  stats.append(...view.stats.map((stat) => createStat(stat.value, stat.label)));

  const recent = document.createElement("section");
  recent.className = "section";
  recent.append(createSectionTitle("Recently saved"));
  recent.append(view.emptyMessage ? createEmptyState(view.emptyMessage) : createRecentList(view.recent));

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(...view.actions.map(createReviewAction));

  wrapper.append(intro, stats, recent, actions, createLocalNote());
  return wrapper;
}

function renderPractice(session: PracticeSessionState): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "practice-content";

  if (session.completed) {
    wrapper.append(
      createEyebrow(`${getPracticeModeLabel(session.mode)} complete`),
      createHeading("That is a good set."),
      createText("Your ratings are saved locally. Review again when the cards are due."),
    );
    const backButton = createButton("Back to Learn", "button practice-back");
    backButton.addEventListener("click", () => {
      practiceSession = null;
      void loadSummary();
    });
    wrapper.append(backButton);
    return wrapper;
  }

  const card = getCurrentPracticeCard(session);
  if (!card) {
    return wrapper;
  }

  const progress = createText(`Card ${session.currentIndex + 1} of ${session.queue.length}`, "practice-progress");
  const cardSection = document.createElement("section");
  cardSection.className = "practice-card";
  const prompt = getPracticePrompt(card, settings.cardDirection);
  cardSection.append(
    createEyebrow(session.revealed ? "Answer" : prompt.label),
    createHeading(session.revealed ? card.dutch : prompt.value ?? "unavailable"),
  );

  if (session.revealed) {
    cardSection.append(createMeaningRow("Dutch", card.dutch));
    cardSection.append(createMeaningRow("English", card.english));
    cardSection.append(createMeaningRow("Telugu", card.telugu));
    if (settings.showExampleSentence && card.pageContext) {
      cardSection.append(createMeaningRow("Page context", card.pageContext));
    }

    const ratings = document.createElement("div");
    ratings.className = "rating-actions";
    for (const rating of ["again", "hard", "good", "easy"] as const) {
      const button = createButton(rating[0].toUpperCase() + rating.slice(1), "button");
      button.disabled = ratingPending;
      button.addEventListener("click", () => void rateCurrentCard(rating));
      ratings.append(button);
    }
    cardSection.append(ratings);
  } else {
    const answerButton = createButton("Show Answer", "button answer-button");
    answerButton.addEventListener("click", () => {
      practiceSession = revealPracticeAnswer(session);
      render();
    });
    cardSection.append(answerButton);
  }

  wrapper.append(progress, cardSection, createLocalNote());
  return wrapper;
}

function renderSettings(): HTMLElement {
  const wrapper = document.createElement("section");
  wrapper.className = "settings-content";
  wrapper.append(
    createEyebrow("Study preferences"),
    createHeading("Your study desk"),
    createInfoRow("Learning language", "Dutch"),
    createInfoRow("Helper languages", "English + Telugu"),
    createSettingToggle(
      "Auto-save selected words",
      "Save eligible single words after a successful selection.",
      settings.autoSaveSelectedWords,
      (checked) => void saveReviewSettings({ autoSaveSelectedWords: checked }),
    ),
    createSettingToggle(
      "Show example sentence",
      "Display stored page context on review cards.",
      settings.showExampleSentence,
      (checked) => void saveReviewSettings({ showExampleSentence: checked }),
    ),
    createSettingToggle(
      "Daily review badge",
      "Show the number of reviewed cards due today.",
      settings.dailyReviewBadge,
      (checked) => void saveReviewSettings({ dailyReviewBadge: checked }),
    ),
    createDirectionSetting(),
    createVocabularyActions(),
    ...(vocabularyActionNotice
      ? [createText(vocabularyActionNotice.message, `settings-notice ${vocabularyActionNotice.kind}`)]
      : []),
    createLocalNote(),
  );
  return wrapper;
}

function createVocabularyActions(): HTMLElement {
  const actions = document.createElement("section");
  actions.className = "settings-actions";

  const exportButton = createButton("Export vocabulary", "button");
  exportButton.disabled = vocabularyActionPending;
  exportButton.addEventListener("click", () => void exportVocabulary());

  const importButton = createButton("Import vocabulary", "button");
  importButton.disabled = vocabularyActionPending;
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json,.json";
  fileInput.hidden = true;
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    fileInput.value = "";
    if (file) {
      void importVocabulary(file);
    }
  });
  importButton.addEventListener("click", () => fileInput.click());

  const clearButton = createButton("Clear vocabulary", "button danger-button");
  clearButton.disabled = vocabularyActionPending;
  clearButton.addEventListener("click", () => {
    if (window.confirm("Clear all local vocabulary and review data? This cannot be undone.")) {
      void clearVocabulary();
    }
  });

  actions.append(exportButton, importButton, clearButton, fileInput);
  return actions;
}

async function exportVocabulary(): Promise<void> {
  if (vocabularyActionPending) {
    return;
  }

  vocabularyActionPending = true;
  vocabularyActionNotice = null;
  render();
  try {
    const backup = await settingsClient.exportVocabulary();
    const blob = new Blob([serializeVocabularyBackup(backup.cards, backup.exportedAt)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dutchmate-vocabulary-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    vocabularyActionNotice = { message: "Vocabulary backup exported.", kind: "success" };
  } catch (error) {
    vocabularyActionNotice = {
      message: error instanceof Error ? error.message : "Vocabulary export is unavailable.",
      kind: "error",
    };
  } finally {
    vocabularyActionPending = false;
    render();
  }
}

async function importVocabulary(file: File): Promise<void> {
  if (vocabularyActionPending) {
    return;
  }

  vocabularyActionPending = true;
  vocabularyActionNotice = null;
  render();
  try {
    await settingsClient.importVocabulary(await file.text());
    await loadSummary();
    vocabularyActionNotice = { message: "Vocabulary backup imported.", kind: "success" };
  } catch (error) {
    vocabularyActionNotice = {
      message: error instanceof Error ? error.message : "Vocabulary import failed.",
      kind: "error",
    };
  } finally {
    vocabularyActionPending = false;
    render();
  }
}

async function clearVocabulary(): Promise<void> {
  if (vocabularyActionPending) {
    return;
  }

  vocabularyActionPending = true;
  vocabularyActionNotice = null;
  render();
  try {
    await settingsClient.clearVocabulary();
    await loadSummary();
    vocabularyActionNotice = { message: "Local vocabulary cleared.", kind: "success" };
  } catch (error) {
    vocabularyActionNotice = {
      message: error instanceof Error ? error.message : "Vocabulary could not be cleared.",
      kind: "error",
    };
  } finally {
    vocabularyActionPending = false;
    render();
  }
}

function createSettingToggle(
  labelText: string,
  description: string,
  checked: boolean,
  onChange: (checked: boolean) => void,
): HTMLElement {
  const label = document.createElement("label");
  label.className = "setting-control";

  const copy = document.createElement("span");
  copy.className = "setting-copy";
  const title = document.createElement("strong");
  title.textContent = labelText;
  const note = document.createElement("small");
  note.textContent = description;
  copy.append(title, note);

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  label.append(copy, input);
  return label;
}

function createDirectionSetting(): HTMLElement {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "direction-setting";
  const legend = document.createElement("legend");
  legend.textContent = "Card direction";
  fieldset.append(legend);

  for (const option of [
    { value: "dutch-to-helpers" as const, label: "Dutch to helpers" },
    { value: "helpers-to-dutch" as const, label: "Helpers to Dutch" },
  ]) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "card-direction";
    input.value = option.value;
    input.checked = settings.cardDirection === option.value;
    input.addEventListener("change", () => {
      if (input.checked) {
        void saveReviewSettings({ cardDirection: option.value });
      }
    });
    label.append(input, document.createTextNode(option.label));
    fieldset.append(label);
  }

  return fieldset;
}

async function saveReviewSettings(changes: Partial<ReviewSettingsChanges>): Promise<void> {
  settings = await settingsClient.updateSettings(changes);
  render();
}

function renderError(message: string): void {
  if (!content) {
    return;
  }

  const error = document.createElement("section");
  error.className = "error-state";
  error.append(createEyebrow("Review unavailable"), createHeading("Your words could not load."), createText(message));
  content.replaceChildren(error);
}

function createRecentList(cards: LearnSummaryView["recent"]): HTMLElement {
  const table = document.createElement("table");
  table.className = "recent-table";
  table.setAttribute("aria-label", "Recently saved vocabulary");

  const headerRow = table.createTHead().insertRow();
  for (const label of ["Dutch", "English", "Telugu"]) {
    const header = document.createElement("th");
    header.scope = "col";
    header.textContent = label;
    headerRow.append(header);
  }

  const body = table.createTBody();

  for (const card of cards) {
    const row = body.insertRow();
    for (const value of [card.dutch, card.english, card.telugu ?? "unavailable"]) {
      const cell = row.insertCell();
      cell.textContent = value;
    }
  }

  return table;
}

function createReviewAction(action: LearnSummaryView["actions"][number]): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = action.label;
  button.disabled = !action.enabled || practicePending;
  button.title = action.enabled ? practiceModeDescription[action.mode] : "Save a word to enable this action.";
  if (action.enabled) {
    button.addEventListener("click", () => void startPractice(action.mode));
  }
  return button;
}

function createButton(text: string, className: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  return button;
}

function createMeaningRow(label: string, value: string | null): HTMLElement {
  const row = document.createElement("div");
  row.className = "meaning-row";
  const name = document.createElement("strong");
  name.textContent = label;
  const meaning = document.createElement("span");
  meaning.textContent = value ?? "unavailable";
  if (!value) {
    meaning.className = "meaning-unavailable";
  }
  row.append(name, meaning);
  return row;
}

async function startPractice(mode: LearnSummaryView["actions"][number]["mode"]): Promise<void> {
  if (practicePending) {
    return;
  }

  practicePending = true;
  render();
  let errorMessage: string | null = null;
  try {
    const queue = await getPracticeQueue(mode);
    practiceSession = createPracticeSession(queue, mode);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : `${getPracticeModeLabel(mode)} is unavailable.`;
  } finally {
    practicePending = false;
    errorMessage ? renderError(errorMessage) : render();
  }
}

function getPracticeModeLabel(mode: PracticeSessionState["mode"]): string {
  return practiceModeLabel[mode];
}

function getPracticeQueue(mode: PracticeSessionState["mode"]): Promise<ReviewCard[]> {
  if (mode === "new") {
    return reviewClient.getNewQueue();
  }
  if (mode === "due") {
    return reviewClient.getDueQueue();
  }
  return reviewClient.getAllQueue();
}

async function rateCurrentCard(rating: ReviewRating): Promise<void> {
  if (!practiceSession || practiceSession.completed || ratingPending) {
    return;
  }

  const card = getCurrentPracticeCard(practiceSession);
  if (!card) {
    return;
  }

  ratingPending = true;
  render();
  let errorMessage: string | null = null;
  try {
    const reviewedCard = await reviewClient.rateCard(card.id, rating);
    practiceSession = advancePracticeSession(practiceSession, reviewedCard);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Your rating could not be saved.";
  } finally {
    ratingPending = false;
    errorMessage ? renderError(errorMessage) : render();
  }
}

function createStat(value: number, label: string): HTMLElement {
  const stat = document.createElement("div");
  stat.className = "stat";
  const number = document.createElement("strong");
  number.textContent = String(value);
  const caption = document.createElement("span");
  caption.className = "stat-label";
  caption.textContent = label;
  stat.append(number, caption);
  return stat;
}

function createInfoRow(label: string, value: string): HTMLElement {
  const row = document.createElement("div");
  row.className = "info-row";
  const name = document.createElement("strong");
  name.textContent = label;
  const setting = document.createElement("span");
  setting.textContent = value;
  row.append(name, setting);
  return row;
}

function createEmptyState(message: string): HTMLElement {
  return createText(message, "empty-state");
}

function createLocalNote(): HTMLElement {
  return createText("Local vocabulary only. No account required.", "local-note");
}

function createEyebrow(text: string): HTMLElement {
  return createText(text, "eyebrow");
}

function createHeading(text: string): HTMLElement {
  const heading = document.createElement("h1");
  heading.className = "heading";
  heading.textContent = text;
  return heading;
}

function createSectionTitle(text: string): HTMLElement {
  const heading = document.createElement("h2");
  heading.className = "section-title";
  heading.textContent = text;
  return heading;
}

function createText(text: string, className = "body-copy"): HTMLElement {
  const element = document.createElement("p");
  element.className = className;
  element.textContent = text;
  return element;
}

function updateTabs(): void {
  for (const [tab, button] of [["learn", learnTab], ["settings", settingsTab]] as const) {
    const isActive = activeTab === tab;
    button?.classList.toggle("is-active", isActive);
    button?.setAttribute("aria-selected", String(isActive));
    if (button) {
      button.tabIndex = isActive ? 0 : -1;
    }
  }
  content?.setAttribute("aria-labelledby", activeTab === "learn" ? "learn-tab" : "settings-tab");
}

function updateBadge(): void {
  if (!dueBadge) {
    return;
  }

  const due = settings.dailyReviewBadge ? summary?.due ?? 0 : 0;
  dueBadge.hidden = due === 0;
  dueBadge.textContent = String(due);
  dueBadge.setAttribute("aria-label", `${due} ${due === 1 ? "word" : "words"} due for review`);
}
