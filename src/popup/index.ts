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
import { createSettingsClient } from "./settings-client";
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
  recent.append(createSectionTitle(view.recentLabel));
  if (view.emptyMessage) {
    recent.append(createEmptyState(view.emptyMessage));
  } else {
    recent.append(createRecentList(view.recent));
    recent.append(createVocabularyManagerButton("View all saved words"));
  }

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
    createEyebrow("Extension settings"),
    createHeading("Change settings in Options"),
    createText(
      "Choose languages, saving behavior, review preferences, and translation settings on the Options page.",
    ),
    createOptionsButton("Open Options page"),
    createLocalNote(),
  );
  return wrapper;
}

function createVocabularyManagerButton(label: string): HTMLButtonElement {
  const button = createButton(label, "button vocabulary-link");
  button.addEventListener("click", () => {
    void browser.runtime.openOptionsPage();
  });
  return button;
}

function createOptionsButton(label: string): HTMLButtonElement {
  const button = createButton(label, "button options-button");
  button.addEventListener("click", () => {
    void browser.runtime.openOptionsPage();
  });
  return button;
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
