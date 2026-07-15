import browser from "webextension-polyfill";
import { createReviewSummaryClient } from "./review-client";
import { getLearnSummaryView, type LearnSummaryView } from "./learn-summary";
import type { ReviewCardSummary } from "../vocabulary/review-cards";
import "./styles.css";

type PopupTab = "learn" | "settings";

const content = document.querySelector<HTMLElement>("#popup-content");
const dueBadge = document.querySelector<HTMLElement>("#due-badge");
const learnTab = document.querySelector<HTMLButtonElement>("#learn-tab");
const settingsTab = document.querySelector<HTMLButtonElement>("#settings-tab");
const summaryClient = createReviewSummaryClient(browser);
let activeTab: PopupTab = "learn";
let summary: ReviewCardSummary | null = null;

learnTab?.addEventListener("click", () => {
  activeTab = "learn";
  render();
});

settingsTab?.addEventListener("click", () => {
  activeTab = "settings";
  render();
});

render();
void loadSummary();

async function loadSummary(): Promise<void> {
  try {
    summary = await summaryClient.getSummary();
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
  actions.append(...view.actions.map((action) => createReviewAction(action.label, action.enabled)));

  wrapper.append(intro, stats, recent, actions, createLocalNote());
  return wrapper;
}

function renderSettings(): HTMLElement {
  const wrapper = document.createElement("section");
  wrapper.className = "settings-content";
  wrapper.append(
    createEyebrow("Study preferences"),
    createHeading("Your study desk"),
    createText("Settings will be available in the next vocabulary review slice."),
    createInfoRow("Learning language", "Dutch"),
    createInfoRow("Helper languages", "English + Telugu"),
    createLocalNote(),
  );
  return wrapper;
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
  const list = document.createElement("div");
  list.className = "recent-list";

  for (const card of cards) {
    const row = document.createElement("div");
    row.className = "recent-row";

    const dutch = document.createElement("strong");
    dutch.textContent = card.dutch;
    const meanings = document.createElement("span");
    meanings.textContent = `English: ${card.english} · Telugu: ${card.telugu}`;
    row.append(dutch, meanings);
    list.append(row);
  }

  return list;
}

function createReviewAction(label: string, hasCards: boolean): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = label;
  button.disabled = !hasCards;
  button.title = hasCards ? "Review sessions are coming next." : "Save a word to enable this action.";
  return button;
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
  return createText(text, "heading");
}

function createSectionTitle(text: string): HTMLElement {
  return createText(text, "section-title");
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
  }
}

function updateBadge(): void {
  if (!dueBadge) {
    return;
  }

  const due = summary?.due ?? 0;
  dueBadge.hidden = due === 0;
  dueBadge.textContent = String(due);
}
