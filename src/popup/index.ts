import browser from "webextension-polyfill";
import { createLearningClient } from "./learning-client";
import { createSettingsClient } from "./settings-client";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";
import type { DailyFiveSnapshot } from "../vocabulary/daily-five";
import type { LearningItem, LessonProgress } from "../vocabulary/learning-record";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import { defaultSettings, type ExtensionSettings } from "../shared/settings";
import type { ReviewSettingsChanges } from "../background/messages";
import { lessonCatalog, type Lesson } from "../lessons/catalog";
import { advanceLessonPractice as advanceLessonPracticeState, advanceLessonStage, createLessonSession, getLessonCandidateChoices, getLessonsAvailabilityView, resumeLessonSession, revealLessonLine, revealLessonPractice, toggleLessonCandidate, type LessonSession } from "./lesson-session";
import "./styles.css";

const content = document.querySelector<HTMLElement>("#popup-content");
const dueBadge = document.querySelector<HTMLElement>("#due-badge");
const settingsButton = document.querySelector<HTMLButtonElement>("#settings-button");
const primaryNavigation = document.querySelector<HTMLElement>("#primary-navigation");
const todayTab = document.querySelector<HTMLButtonElement>("#today-tab");
const lessonsTab = document.querySelector<HTMLButtonElement>("#lessons-tab");
const learningClient = createLearningClient(browser);
const settingsClient = createSettingsClient(browser);
let items: LearningItem[] = [];
let snapshot: DailyFiveSnapshot | null = null;
let rhythm: LearningRhythm | null = null;
let settings: ExtensionSettings = defaultSettings;
let screen: "today" | "lessons" | "lesson" | "review" | "settings" = "today";
let lessonSession: LessonSession | null = null;
let lessonProgressById: Record<string, LessonProgress | null> = {};
let lessonsError: string | null = null;
let revealed = false;
let pending = false;

settingsButton?.addEventListener("click", () => { screen = screen === "settings" ? "today" : "settings"; render(); });
todayTab?.addEventListener("click", () => { screen = "today"; render(); });
lessonsTab?.addEventListener("click", () => { screen = "lessons"; render(); });
void load();

async function load(continueAfterCompletion = false): Promise<void> {
  try {
    [items, snapshot, rhythm, settings] = await Promise.all([learningClient.list(), learningClient.getDailyFive(continueAfterCompletion), learningClient.getRhythm(), settingsClient.getSettings()]);
    try {
      lessonProgressById = Object.fromEntries(await Promise.all(lessonCatalog.lessons.map(async (lesson) => [lesson.id, await learningClient.getLessonProgress(lesson.id)] as const)));
      lessonsError = null;
    } catch (error) { lessonsError = error instanceof Error ? error.message : "Lessons are unavailable."; }
    render();
  } catch (error) {
    renderError(error instanceof Error ? error.message : "Today is unavailable.");
  }
}

function render(): void {
  if (!content) return;
  const focused = screen === "review" || screen === "lesson";
  settingsButton?.toggleAttribute("hidden", focused);
  primaryNavigation?.toggleAttribute("hidden", focused);
  todayTab?.classList.toggle("is-active", screen === "today"); todayTab?.setAttribute("aria-selected", String(screen === "today")); todayTab?.setAttribute("tabindex", screen === "today" ? "0" : "-1");
  lessonsTab?.classList.toggle("is-active", screen === "lessons"); lessonsTab?.setAttribute("aria-selected", String(screen === "lessons")); lessonsTab?.setAttribute("tabindex", screen === "lessons" ? "0" : "-1");
  content?.setAttribute("aria-labelledby", screen === "lessons" ? "lessons-tab" : "today-tab");
  updateBadge();
  content.replaceChildren(screen === "today" ? renderToday() : screen === "lessons" ? renderLessons() : screen === "lesson" ? renderLesson() : screen === "review" ? renderReview() : renderSettings());
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
  if (rhythm) wrapper.append(renderRhythm(rhythm));
  wrapper.append(createMasterySummary(), localNote());
  return wrapper;
}

function renderRhythm(current: LearningRhythm): HTMLElement {
  const section = document.createElement("section");
  section.className = "learning-rhythm";
  section.append(text("This week", "section-title"));
  const days = document.createElement("div");
  days.className = "rhythm-days";
  for (const day of current.week) {
    const dot = document.createElement("span");
    dot.className = `rhythm-day ${day.status}`;
    dot.tabIndex = 0;
    dot.setAttribute("aria-label", `${new Date(day.dayStartAt).toLocaleDateString(undefined, { weekday: "short" })}: ${day.status === "active" ? "active" : day.status === "grace" ? "grace day" : "rest day"}`);
    days.append(dot);
  }
  section.append(days);
  if (current.resetCopy) section.append(text(current.resetCopy, "body-copy"));
  for (const milestone of current.milestones) section.append(text(milestone.label, "body-copy milestone"));
  return section;
}

function renderLessons(): HTMLElement {
  const wrapper = section("lessons-content");
  wrapper.append(eyebrow("Lessons"), heading("Practical Dutch, one small story at a time."), text("Bundled and human-reviewed for Dutch, English, and Telugu learners."));
  const availability = getLessonsAvailabilityView(lessonsError);
  if (availability.unavailable) { const retry = button(availability.retryLabel!, "button primary-button"); retry.addEventListener("click", () => void load()); wrapper.append(heading("Lessons are unavailable."), text(availability.message!), retry); return wrapper; }
  for (const lessonDefinition of lessonCatalog.lessons) {
    const lesson = section("lesson-card");
    const lessonProgress = lessonProgressById[lessonDefinition.id] ?? null;
    lesson.append(text(lessonDefinition.pathway.replaceAll("-", " "), "practice-progress"), heading(lessonDefinition.title), text(`${lessonDefinition.durationMinutes} minutes · ${lessonDefinition.pattern}`));
    const completedLesson = lessonProgress?.completedAt !== null && lessonProgress !== null;
    if (completedLesson) lesson.append(text("Completed · replay any time without changing saved progress.", "practice-progress"));
    const start = button(completedLesson ? "Replay lesson" : lessonProgress ? "Resume lesson" : "Start lesson", "button primary-button"); start.addEventListener("click", () => void startLesson(lessonDefinition)); lesson.append(start);
    wrapper.append(lesson);
  }
  wrapper.append(localNote()); return wrapper;
}

function renderLesson(): HTMLElement {
  const session = lessonSession;
  if (!session) { screen = "lessons"; return renderLessons(); }
  const wrapper = section("lesson-content focused-content");
  const exit = button("Exit lesson", "exit-button"); exit.addEventListener("click", () => { lessonSession = null; screen = "lessons"; render(); });
  const rail = document.createElement("div"); rail.className = "lesson-rail";
  for (const stage of ["read", "notice", "practise", "keep"] as const) rail.append(text(stage, `lesson-stage${session.stage === stage || (stage === "keep" && session.stage === "replay") ? " active" : ""}`));
  wrapper.append(exit, rail);
  if (session.stage === "read" || session.stage === "replay") wrapper.append(renderLessonStory(session, session.stage === "read"));
  if (session.stage === "notice") wrapper.append(renderLessonNotice(session));
  if (session.stage === "practise") wrapper.append(renderLessonPractice(session));
  if (session.stage === "keep") wrapper.append(renderLessonKeep(session));
  return wrapper;
}

function renderLessonStory(session: LessonSession, allowHelp: boolean): HTMLElement {
  const story = section("lesson-story"); story.append(eyebrow(session.stage === "read" ? "Read the situation" : "Replay"), heading(session.lesson.title));
  session.lesson.lines.forEach((line, index) => { const row = section("story-line"); row.append(text(line.dutch, "story-dutch")); if (allowHelp && session.revealedLineIndexes.includes(index)) row.append(text(`English: ${line.english}`), text(`Telugu: ${line.telugu}`, "helper-copy")); else if (allowHelp) { const help = button("Show line help", "line-help"); help.addEventListener("click", () => { lessonSession = revealLessonLine(session, index); render(); }); row.append(help); } story.append(row); });
  const next = button(session.stage === "read" ? "Notice the pattern" : "Choose what to keep", "button primary-button"); next.addEventListener("click", () => void advanceLesson(session)); story.append(next); return story;
}

function renderLessonNotice(session: LessonSession): HTMLElement { const panel = section("lesson-story"); panel.append(eyebrow("Notice"), heading(session.lesson.pattern), text(session.lesson.patternExplanation)); for (const line of session.lesson.lines) { const row = document.createElement("p"); row.className = "story-dutch"; const start = line.dutch.indexOf(session.lesson.patternText); if (start < 0) row.textContent = line.dutch; else { row.append(line.dutch.slice(0, start), highlightedPattern(session.lesson.patternText), line.dutch.slice(start + session.lesson.patternText.length)); } panel.append(row); } const next = button("Practise", "button primary-button"); next.addEventListener("click", () => void advanceLesson(session)); panel.append(next); return panel; }
function renderLessonPractice(session: LessonSession): HTMLElement { const prompt = session.lesson.practice[session.practiceIndex]; const candidate = session.lesson.candidates.find((item) => item.id === prompt.candidateId)!; const panel = section("practice-card"); panel.append(eyebrow(session.practiceRevealed ? "Answer" : prompt.dimension === "recognition" ? "Read in Dutch" : "Say it in Dutch"), heading(session.practiceRevealed ? candidate.dutch : prompt.dimension === "recognition" ? candidate.dutch : candidate.english)); if (!session.practiceRevealed) { const reveal = button("Show answer", "button answer-button"); reveal.addEventListener("click", () => { lessonSession = revealLessonPractice(session); render(); }); panel.append(reveal); } else { panel.append(meaning("Dutch", candidate.dutch), meaning("English", candidate.english), meaning("Telugu", candidate.telugu)); const actions = document.createElement("div"); actions.className = "rating-actions"; for (const result of ["again", "got-it"] as const) { const action = button(result === "again" ? "Again" : "Got it", "button"); action.addEventListener("click", () => void saveLessonPractice(session, result)); actions.append(action); } panel.append(actions); } return panel; }
function renderLessonKeep(session: LessonSession): HTMLElement { const panel = section("lesson-story"); panel.append(eyebrow("Keep"), heading("Choose what to keep for review.")); for (const candidate of getLessonCandidateChoices(session, items)) { const label = document.createElement("label"); label.className = "candidate-choice"; const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = candidate.checked; checkbox.addEventListener("change", () => { lessonSession = toggleLessonCandidate(session, candidate.id); render(); }); label.append(checkbox, text(candidate.dutch)); if (candidate.alreadySaved) label.append(text("Already saved", "already-saved")); panel.append(label); } const keep = button(`Keep ${session.selectedCandidateIds.length} for review`, "button primary-button"); keep.disabled = pending; keep.addEventListener("click", () => void keepLessonCandidates(session)); panel.append(keep); return panel; }
async function startLesson(lesson: Lesson): Promise<void> { try { let lessonProgress = await learningClient.getLessonProgress(lesson.id); if (!lessonProgress) lessonProgress = await learningClient.saveLessonProgress(lesson.id, "read"); lessonProgressById = { ...lessonProgressById, [lesson.id]: lessonProgress }; lessonSession = resumeLessonSession(lesson, lessonProgress); screen = "lesson"; render(); content?.focus(); } catch (error) { lessonsError = error instanceof Error ? error.message : "This lesson is unavailable."; screen = "lessons"; render(); } }
async function advanceLesson(session: LessonSession): Promise<void> { const next = advanceLessonStage(session); pending = true; render(); try { const lessonProgress = await learningClient.saveLessonProgress(next.lesson.id, next.stage); lessonProgressById = { ...lessonProgressById, [next.lesson.id]: lessonProgress }; lessonSession = next; } catch (error) { renderError(error instanceof Error ? error.message : "Lesson progress could not be saved."); } finally { pending = false; render(); } }
async function saveLessonPractice(session: LessonSession, result: "again" | "got-it"): Promise<void> { const next = advanceLessonPracticeState(session, result); if (next.stage !== "replay") { lessonSession = next; render(); return; } pending = true; render(); try { const lessonProgress = await learningClient.saveLessonProgress(next.lesson.id, next.stage); lessonProgressById = { ...lessonProgressById, [next.lesson.id]: lessonProgress }; lessonSession = next; } catch (error) { renderError(error instanceof Error ? error.message : "Lesson progress could not be saved."); } finally { pending = false; render(); } }
async function keepLessonCandidates(session: LessonSession): Promise<void> { pending = true; render(); try { const kept = await learningClient.keepLessonCandidates(session.lesson.id, session.selectedCandidateIds, session.practiceEvidence); items = [...items.filter((item) => !kept.some((saved) => saved.id === item.id)), ...kept]; rhythm = await learningClient.getRhythm(); const lessonProgress = await learningClient.getLessonProgress(session.lesson.id); lessonProgressById = { ...lessonProgressById, [session.lesson.id]: lessonProgress }; lessonSession = null; screen = "lessons"; render(); } catch (error) { renderError(error instanceof Error ? error.message : "Your lesson choices could not be saved."); } finally { pending = false; } }

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
    snapshot = response.snapshot; rhythm = await learningClient.getRhythm(); revealed = false;
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
function highlightedPattern(value: string): HTMLElement { const mark = document.createElement("mark"); mark.className = "pattern-highlight"; mark.textContent = value; return mark; }
function toggle(labelText: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement { const label = document.createElement("label"); label.className = "setting-control"; const textNode = document.createElement("strong"); textNode.textContent = labelText; const input = document.createElement("input"); input.type = "checkbox"; input.checked = checked; input.addEventListener("change", () => onChange(input.checked)); label.append(textNode, input); return label; }
function localNote(): HTMLElement { return text("Local learning only. No account required.", "local-note"); }
