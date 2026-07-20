import browser from "webextension-polyfill";
import { createLearningClient } from "./learning-client";
import { createSettingsClient } from "./settings-client";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";
import type { DailyFiveSnapshot } from "../vocabulary/daily-five";
import type { LearningItem } from "../vocabulary/learning-record";
import { defaultSettings, type ExtensionSettings } from "../shared/settings";
import type { ReviewSettingsChanges } from "../background/messages";
import "./styles.css";

const content = document.querySelector<HTMLElement>("#popup-content");
const dueBadge = document.querySelector<HTMLElement>("#due-badge");
const settingsButton = document.querySelector<HTMLButtonElement>("#settings-button");
const learningClient = createLearningClient(browser);
const settingsClient = createSettingsClient(browser);
let items: LearningItem[] = [];
let snapshot: DailyFiveSnapshot | null = null;
let settings: ExtensionSettings = defaultSettings;
let screen: "today" | "review" | "settings" = "today";
let revealed = false;
let pending = false;

settingsButton?.addEventListener("click", () => { screen = screen === "settings" ? "today" : "settings"; render(); });
void load();

async function load(continueAfterCompletion = false): Promise<void> {
  try {
    [items, snapshot, settings] = await Promise.all([learningClient.list(), learningClient.getDailyFive(continueAfterCompletion), settingsClient.getSettings()]);
    render();
  } catch (error) {
    renderError(error instanceof Error ? error.message : "Today is unavailable.");
  }
}

function render(): void {
  if (!content) return;
  settingsButton?.toggleAttribute("hidden", screen === "review");
  updateBadge();
  content.replaceChildren(screen === "today" ? renderToday() : screen === "review" ? renderReview() : renderSettings());
}

function renderToday(): HTMLElement {
  const wrapper = section("today-content");
  if (!snapshot) { wrapper.append(eyebrow("Today"), heading("Loading your Daily Five…")); return wrapper; }
  const view = getDailyFiveView(snapshot);
  const completed = view.status === "complete";
  const total = view.total;
  const done = view.completed;
  wrapper.append(eyebrow("Today"), heading(completed ? "Five small wins." : "One calm practice action."), text(completed ? "Your Daily Five is complete. Keep going only if you want to." : total === 0 ? "No review is waiting. A short lesson is a good next step." : "Reveal each answer, then choose Again or Got it."));
  const progress = document.createElement("section");
  progress.className = "daily-five";
  progress.append(text("Daily Five", "section-title"), text(total === 0 ? "Try a lesson when it arrives." : `${done} of ${total} complete`, "body-copy"));
  wrapper.append(progress);
  if (total === 0) {
    wrapper.append(text("Lessons will appear here next. DutchMate will never start one automatically.", "empty-state"));
  } else {
    const action = button(view.actionLabel ?? "Start Daily Five", "button primary-button");
    action.disabled = pending;
    action.addEventListener("click", () => {
      if (completed) void startContinuation();
      else { screen = "review"; revealed = false; render(); content?.focus(); }
    });
    wrapper.append(action);
  }
  wrapper.append(createMasterySummary(), localNote());
  return wrapper;
}

function renderReview(): HTMLElement {
  const wrapper = section("practice-content focused-content");
  const reviewView = snapshot ? getDailyFiveReviewView(snapshot, revealed) : null;
  const task = reviewView?.task;
  const item = task ? items.find((candidate) => candidate.id === task.itemId) : undefined;
  if (!snapshot || !task || !item) { screen = "today"; return renderToday(); }
  const exit = button("Exit review", "exit-button");
  exit.addEventListener("click", () => { screen = "today"; revealed = false; render(); });
  const progress = text(`${task.dimension === "recognition" ? "Recognition" : "Recall"} · ${snapshot.completedTaskIds.length + 1} of ${snapshot.tasks.length}`, "practice-progress");
  const card = section("practice-card");
  const prompt = task.dimension === "recognition" ? item.dutch : item.english ?? item.contexts.at(-1)?.text ?? "Use the context cue";
  card.append(eyebrow(revealed ? "Answer" : task.dimension === "recognition" ? "Read in Dutch" : "Say it in Dutch"), heading(revealed ? item.dutch : prompt));
  if (reviewView?.canSubmitResult) {
    card.append(meaning("Dutch", item.dutch), meaning("English", item.english), meaning("Telugu", item.telugu));
    if (item.contexts.at(-1)) card.append(meaning("Context", item.contexts.at(-1)?.text ?? null));
    const actions = document.createElement("div"); actions.className = "rating-actions";
    for (const result of ["again", "got-it"] as const) { const action = button(result === "again" ? "Again" : "Got it", "button"); action.disabled = pending; action.addEventListener("click", () => void saveResult(item, task.dimension, result)); actions.append(action); }
    card.append(actions);
  } else {
    const reveal = button("Show answer", "button answer-button"); reveal.addEventListener("click", () => { revealed = true; render(); }); card.append(reveal);
  }
  wrapper.append(exit, progress, card, localNote());
  return wrapper;
}

function renderSettings(): HTMLElement {
  const wrapper = section("settings-content");
  wrapper.append(eyebrow("Settings"), heading("Review preferences"), toggle("Show page context", settings.showExampleSentence, (checked) => void saveSettings({ showExampleSentence: checked })), toggle("Daily review badge", settings.dailyReviewBadge, (checked) => void saveSettings({ dailyReviewBadge: checked })), text("Other extension settings are available in Options.", "local-note"));
  const options = button("Open Options page", "button"); options.addEventListener("click", () => void browser.runtime.openOptionsPage()); wrapper.append(options); return wrapper;
}

async function saveResult(item: LearningItem, dimension: "recognition" | "recall", result: "again" | "got-it"): Promise<void> {
  if (pending) return;
  pending = true; render();
  try {
    const response = await learningClient.recordDailyFiveResult(item.id, dimension, result);
    items = items.map((candidate) => candidate.id === item.id ? response.item : candidate);
    snapshot = response.snapshot; revealed = false;
    if (snapshot.goalCompleted) screen = "today";
    render();
  } catch (error) { renderError(error instanceof Error ? error.message : "Your result could not be saved."); }
  finally { pending = false; }
}

async function startContinuation(): Promise<void> { pending = true; render(); await load(true); pending = false; if (snapshot?.tasks.length) { screen = "review"; revealed = false; render(); content?.focus(); } }
async function saveSettings(changes: Partial<ReviewSettingsChanges>): Promise<void> { settings = await settingsClient.updateSettings(changes); render(); }

function createMasterySummary(): HTMLElement {
  const states = ["new", "learning", "familiar", "strong"] as const;
  const summary = section("mastery");
  for (const label of ["Recognition", "Recall"] as const) { const key = label.toLowerCase() as "recognition" | "recall"; const count = items.filter((item) => item[key].state !== "new").length; const state = [...states].reverse().find((candidate) => items.some((item) => item[key].state === candidate)) ?? "new"; const block = document.createElement("div"); block.append(text(`${label} · ${state}`, "section-title"), text(`${count} item${count === 1 ? "" : "s"} practised`, "body-copy")); summary.append(block); }
  return summary;
}
function updateBadge(): void { if (!dueBadge) return; const due = settings.dailyReviewBadge ? items.filter((item) => [item.recognition, item.recall].some((mastery) => mastery.attemptCount > 0 && mastery.dueAt !== null && mastery.dueAt <= Date.now())).length : 0; dueBadge.hidden = due === 0; dueBadge.textContent = String(due); dueBadge.setAttribute("aria-label", `${due} items due for review`); }
function renderError(message: string): void { if (!content) return; content.replaceChildren(eyebrow("Today unavailable"), heading("Your practice could not load."), text(message)); }
function section(className: string): HTMLElement { const element = document.createElement("section"); element.className = className; return element; }
function button(label: string, className: string): HTMLButtonElement { const element = document.createElement("button"); element.type = "button"; element.className = className; element.textContent = label; return element; }
function eyebrow(value: string): HTMLElement { return text(value, "eyebrow"); }
function heading(value: string): HTMLElement { const element = document.createElement("h1"); element.className = "heading"; element.textContent = value; return element; }
function text(value: string, className = "body-copy"): HTMLElement { const element = document.createElement("p"); element.className = className; element.textContent = value; return element; }
function meaning(label: string, value: string | null): HTMLElement { const row = section("meaning-row"); const name = document.createElement("strong"); name.textContent = label; const content = document.createElement("span"); content.textContent = value ?? "unavailable"; row.append(name, content); return row; }
function toggle(labelText: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement { const label = document.createElement("label"); label.className = "setting-control"; const textNode = document.createElement("strong"); textNode.textContent = labelText; const input = document.createElement("input"); input.type = "checkbox"; input.checked = checked; input.addEventListener("change", () => onChange(input.checked)); label.append(textNode, input); return label; }
function localNote(): HTMLElement { return text("Local learning only. No account required.", "local-note"); }
