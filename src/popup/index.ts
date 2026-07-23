import browser from "webextension-polyfill";
import { createLearningClient } from "./learning-client";
import { createSettingsClient } from "./settings-client";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";
import { getSavedShelfView, type SavedShelfSort } from "./saved-shelf-view";
import { getPopupTabForKey } from "./tab-navigation";
import type { DailyFiveSnapshot } from "../vocabulary/daily-five";
import { LEARNING_RECORD_STORAGE_KEY, type LearningItem, type LessonProgress } from "../vocabulary/learning-record";
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
const savedTab = document.querySelector<HTMLButtonElement>("#saved-tab");
const learningClient = createLearningClient(browser);
const settingsClient = createSettingsClient(browser);
let items: LearningItem[] = [];
let snapshot: DailyFiveSnapshot | null = null;
let rhythm: LearningRhythm | null = null;
let settings: ExtensionSettings = defaultSettings;
let screen: "today" | "lessons" | "saved" | "lesson" | "review" | "settings" = "today";
let lessonSession: LessonSession | null = null;
let lessonProgressById: Record<string, LessonProgress | null> = {};
let lessonsError: string | null = null;
let revealed = false;
let pending = false;
let activityPeriod: "week" | "month" | "year" = "week";
let activityOffset = 0;
let savedSort: SavedShelfSort = "newest";
let savedLoading = true;
let savedError: string | null = null;
let expandedSavedItemId: string | null = null;

settingsButton?.addEventListener("click", () => { screen = screen === "settings" ? "today" : "settings"; render(); });
todayTab?.addEventListener("click", () => { screen = "today"; render(); });
lessonsTab?.addEventListener("click", () => { screen = "lessons"; render(); });
savedTab?.addEventListener("click", () => { screen = "saved"; render(); });
primaryNavigation?.addEventListener("keydown", (event) => {
  if (screen !== "today" && screen !== "lessons" && screen !== "saved") return;
  const target = getPopupTabForKey(screen, event.key);
  if (!target) return;
  event.preventDefault();
  screen = target;
  render();
  ({ today: todayTab, lessons: lessonsTab, saved: savedTab }[target])?.focus();
});
browser.storage.onChanged?.addListener((changes, areaName) => {
  if (areaName === "local" && LEARNING_RECORD_STORAGE_KEY in changes) void loadSaved();
});
void loadSaved();
void load();

async function load(continueAfterCompletion = false): Promise<void> {
  try {
    [snapshot, rhythm, settings] = await Promise.all([learningClient.getDailyFive(continueAfterCompletion), learningClient.getRhythm(), settingsClient.getSettings()]);
    try {
      lessonProgressById = Object.fromEntries(await Promise.all(lessonCatalog.lessons.map(async (lesson) => [lesson.id, await learningClient.getLessonProgress(lesson.id)] as const)));
      lessonsError = null;
    } catch (error) { lessonsError = error instanceof Error ? error.message : "Lessons are unavailable."; }
    render();
  } catch (error) {
    renderError(error instanceof Error ? error.message : "Today is unavailable.");
  }
}

async function loadSaved(): Promise<void> {
  savedLoading = true;
  savedError = null;
  render();
  try {
    const nextItems = await learningClient.list();
    items = nextItems;
    if (expandedSavedItemId && !nextItems.some((item) => item.id === expandedSavedItemId)) expandedSavedItemId = null;
  } catch (error) {
    savedError = error instanceof Error ? error.message : "Saved items could not be loaded.";
  } finally {
    savedLoading = false;
    render();
  }
}

function render(): void {
  if (!content) return;
  if (screen !== "saved") expandedSavedItemId = null;
  const focused = screen === "review" || screen === "lesson";
  settingsButton?.toggleAttribute("hidden", focused);
  primaryNavigation?.toggleAttribute("hidden", focused);
  content.classList.toggle("today-panel", screen === "today");
  todayTab?.classList.toggle("is-active", screen === "today"); todayTab?.setAttribute("aria-selected", String(screen === "today")); todayTab?.setAttribute("tabindex", screen === "today" ? "0" : "-1");
  lessonsTab?.classList.toggle("is-active", screen === "lessons"); lessonsTab?.setAttribute("aria-selected", String(screen === "lessons")); lessonsTab?.setAttribute("tabindex", screen === "lessons" ? "0" : "-1");
  savedTab?.classList.toggle("is-active", screen === "saved"); savedTab?.setAttribute("aria-selected", String(screen === "saved")); savedTab?.setAttribute("tabindex", screen === "saved" ? "0" : "-1");
  content?.setAttribute("aria-labelledby", screen === "lessons" ? "lessons-tab" : screen === "saved" ? "saved-tab" : "today-tab");
  updateBadge();
  content.replaceChildren(screen === "today" ? renderToday() : screen === "lessons" ? renderLessons() : screen === "saved" ? renderSaved() : screen === "lesson" ? renderLesson() : screen === "review" ? renderReview() : renderSettings());
}

function renderSaved(): HTMLElement {
  const wrapper = section("saved-content");
  const view = getSavedShelfView(items, { sort: savedSort, expandedItemId: expandedSavedItemId, loading: savedLoading, error: savedError });
  const header = document.createElement("div");
  header.className = "saved-head";
  header.append(eyebrow("Your collection"), heading("Saved"));
  wrapper.append(header);
  if (view.status === "loading") { wrapper.append(text("Loading your saved vocabulary…")); return wrapper; }
  if (view.status === "error") {
    const retry = button("Try again", "button primary-button");
    retry.addEventListener("click", () => void loadSaved());
    wrapper.append(heading("Saved items are unavailable."), text(view.message), retry);
    return wrapper;
  }
  if (view.status === "empty") {
    const lessons = button("Choose a lesson", "button primary-button");
    lessons.addEventListener("click", () => { screen = "lessons"; render(); });
    wrapper.append(heading("Nothing saved yet."), text("Words and meaningful chunks you intentionally keep will appear here."), lessons);
    return wrapper;
  }
  const controls = document.createElement("div");
  controls.className = "saved-sort";
  controls.append(text(`${view.count} saved item${view.count === 1 ? "" : "s"}`, "sort-label"));
  for (const [sort, label] of [["newest", "Newest"], ["alphabetical", "A–Z"]] as const) {
    const control = button(label, `sort-button${view.sort === sort ? " is-active" : ""}`);
    control.setAttribute("aria-pressed", String(view.sort === sort));
    control.addEventListener("click", () => { savedSort = sort; render(); });
    controls.append(control);
  }
  wrapper.append(controls);
  const shelf = document.createElement("div");
  shelf.className = "saved-shelf";
  for (const item of view.items) {
    const card = document.createElement("article");
    card.className = `saved-item${item.expanded ? " is-expanded" : ""}`;
    const row = button("", "saved-row");
    row.setAttribute("aria-expanded", String(item.expanded));
    if (item.expanded) row.setAttribute("aria-controls", `saved-detail-${item.shelfNumber}`);
    row.addEventListener("click", () => { expandedSavedItemId = item.expanded ? null : item.id; render(); });
    const number = document.createElement("span"); number.className = "shelf-number"; number.textContent = String(item.shelfNumber);
    const copy = document.createElement("div"); copy.className = "saved-word";
    const dutch = document.createElement("h2"); dutch.textContent = item.dutch;
    const helpers = document.createElement("div"); helpers.className = "saved-helpers";
    helpers.append(helperMeaning("EN", item.english), helperMeaning("TE", item.telugu));
    copy.append(dutch, helpers);
    const mastery = document.createElement("span"); mastery.className = "saved-mastery"; mastery.textContent = item.mastery;
    row.append(number, copy, mastery);
    card.append(row);
    if (item.expanded && item.details) {
      const detail = document.createElement("div");
      detail.id = `saved-detail-${item.shelfNumber}`;
      detail.className = "saved-detail";
      if (item.details.source) detail.append(text(item.details.source, "saved-source"));
      if (item.details.context) detail.append(text(item.details.context, "saved-context"));
      const options = button("Open Options", "saved-options-link");
      options.addEventListener("click", () => void browser.runtime.openOptionsPage());
      detail.append(options);
      card.append(detail);
    }
    shelf.append(card);
  }
  wrapper.append(shelf);
  return wrapper;
}

function renderToday(): HTMLElement {
  const wrapper = section(`today-content brief-today ${activityPeriod === "week" ? "today-week" : "calendar-focus"}`);
  if (!snapshot) { wrapper.append(eyebrow("Today"), heading("Loading your Daily Five…")); return wrapper; }
  if (savedError && items.length === 0) {
    const retry = button("Try again", "button primary-button");
    retry.addEventListener("click", () => void loadSaved());
    wrapper.append(eyebrow("Today unavailable"), heading("Your learning record could not load."), text(savedError), retry);
    return wrapper;
  }
  const view = getDailyFiveView(snapshot);
  const completed = view.status === "complete";
  const total = view.total;
  const done = view.completed;
  const hasNoVocabulary = total === 0 && items.length === 0;
  const nextAction = section("next-action");
  const actionCopy = completed ? text("Your Daily Five is complete. Keep going only if you want to.", "body-copy completion-copy") : text(total === 0 ? "Choose a short practical story. DutchMate will never start one automatically." : "Practise five useful words. Start now.");
  nextAction.append(eyebrow(total === 0 ? "Ready when you are" : `Ready now · about ${Math.max(1, total - done) * 1} min`), heading(completed ? "Five small wins." : total === 0 ? "A lesson is ready." : "Start your Daily Five."), actionCopy);
  if (total === 0) {
    const lessons = button("Choose a lesson", "button primary-button");
    lessons.addEventListener("click", () => { screen = "lessons"; render(); });
    nextAction.append(lessons);
  } else {
    const action = button(completed ? "Review 5 more" : view.actionLabel ?? "Start Daily Five", "button primary-button");
    action.disabled = pending;
    action.addEventListener("click", () => {
      if (completed) void startContinuation();
      else { screen = "review"; revealed = false; render(); content?.focus(); }
    });
    nextAction.append(action);
  }
  nextAction.append(text(total === 0 ? "Practical Dutch · 3–5 min" : `${done} of ${total} today`, "action-meta"));
  wrapper.append(nextAction);
  const inProgress = lessonCatalog.lessons.find((lesson) => {
    const progress = lessonProgressById[lesson.id];
    return progress && progress.completedAt === null;
  });
  if (rhythm) wrapper.append(renderRhythm(rhythm));
  const secondaryActions = document.createElement("div");
  secondaryActions.className = "secondary-actions";
  if (inProgress) {
    const continueLesson = button("Continue lesson", "button secondary-button");
    continueLesson.addEventListener("click", () => void startLesson(inProgress));
    secondaryActions.append(continueLesson);
  }
  if (hasNoVocabulary && !inProgress) {
    const startLesson = button("Start a lesson", "button secondary-button");
    startLesson.addEventListener("click", () => { screen = "lessons"; render(); });
    const review = button("Review", "button secondary-button");
    const reviewHint = text("Save vocabulary before you can review.", "empty-review-hint");
    reviewHint.id = "empty-review-hint";
    reviewHint.hidden = true;
    reviewHint.setAttribute("role", "status");
    review.setAttribute("aria-controls", reviewHint.id);
    review.setAttribute("aria-expanded", "false");
    review.addEventListener("click", () => { reviewHint.hidden = false; review.setAttribute("aria-expanded", "true"); });
    secondaryActions.append(startLesson, review, reviewHint);
  }
  if (completed) {
    const reviewMore = button("Review more", "button secondary-button");
    reviewMore.addEventListener("click", () => void startContinuation());
    secondaryActions.append(reviewMore);
  }
  if (secondaryActions.childElementCount) wrapper.append(secondaryActions);
  return wrapper;
}

function renderRhythm(current: LearningRhythm): HTMLElement {
  const section = document.createElement("section");
  section.className = "learning-rhythm calendar-card";
  const header = document.createElement("div");
  header.className = "section-head";
  const title = document.createElement("strong");
  title.textContent = activityPeriod === "week" ? "This week" : activityPeriod === "month" ? "This month" : "This year";
  header.append(title);
  const periodTabs = document.createElement("div");
  periodTabs.className = "period-tabs history-controls";
  const thisWeek = button("This Week", "period-tab this-week-tab");
  thisWeek.setAttribute("aria-pressed", String(activityPeriod === "week" && activityOffset === 0));
  thisWeek.addEventListener("click", () => { activityPeriod = "week"; activityOffset = 0; render(); });
  periodTabs.append(thisWeek);
  for (const period of ["week", "month", "year"] as const) {
    const tab = button(period, `period-tab${activityPeriod === period ? " is-active" : ""}`);
    tab.setAttribute("aria-pressed", String(activityPeriod === period));
    tab.addEventListener("click", () => { activityPeriod = period; activityOffset = 0; render(); });
    periodTabs.append(tab);
  }
  header.append(periodTabs);
  section.append(header);
  const controls = document.createElement("div");
  controls.className = "period-controls";
  const previous = button("Previous period", "period-control");
  previous.setAttribute("aria-label", `Previous ${activityPeriod}`);
  previous.addEventListener("click", () => { activityOffset -= 1; render(); });
  const next = button("Next period", "period-control");
  next.setAttribute("aria-label", `Next ${activityPeriod}`);
  next.addEventListener("click", () => { activityOffset += 1; render(); });
  controls.append(previous, text(activityLabel(activityPeriod, activityOffset), "period-label"), next);
  section.append(controls);
  const days = document.createElement("div");
  days.className = "rhythm-days";
  if (activityPeriod === "week") days.classList.add("week-grid");
  else if (activityPeriod === "month") { days.classList.add("heatmap", "heatmap-month"); section.append(createMonthWeekdays()); }
  else days.classList.add("heatmap", "heatmap-year");
  if (activityPeriod === "year") section.append(createYearMonthLabels(new Date().getFullYear() + activityOffset));
  const activityByDay = new Map(current.activity.map((day) => [day.dayStartAt, day]));
  for (const dayStartAt of activityDays(activityPeriod, activityOffset)) {
    const activity = activityByDay.get(dayStartAt);
    const day = current.week.find((candidate) => candidate.dayStartAt === dayStartAt);
    const status = day?.status ?? (activity ? "active" : "idle");
    const total = activityTotalValue(activity);
    const intensity = total !== null && total >= 4 ? " high" : "";
    const isToday = isLocalToday(dayStartAt);
    const dot = button("", `rhythm-day ${status}${intensity}${isToday ? " is-today" : ""}`);
    const label = new Date(dayStartAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const counts = activity ? activityDescription(activity) : `0 reviews, 0 saved items, 0 lessons${status === "grace" ? " · grace day" : ""}`;
    const description = `${label}: ${counts}${isToday ? " · Today" : ""}`;
    dot.setAttribute("aria-label", description);
    dot.title = description;
    dot.dataset.dayStart = String(dayStartAt);
    if (activityPeriod === "week") {
      dot.append(heatmapDate(dayStartAt), activityTotal(activity));
    }
    if (activityPeriod === "month") {
      if (new Date(dayStartAt).getDate() === 1) dot.style.gridColumnStart = String(((new Date(dayStartAt).getDay() + 6) % 7) + 1);
      dot.append(heatmapDate(dayStartAt), activityTotal(activity));
    }
    days.append(dot);
  }
  section.append(days);
  section.append(createHeatmapLegend());
  return section;
}

function heatmapDate(dayStartAt: number): HTMLElement {
  const date = document.createElement("span");
  date.className = "heatmap-date";
  date.textContent = String(new Date(dayStartAt).getDate());
  return date;
}

function isLocalToday(dayStartAt: number): boolean {
  const date = new Date(dayStartAt);
  const today = new Date();
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
}

function activityTotal(activity: LearningRhythm["activity"][number] | undefined): HTMLElement {
  const total = document.createElement("span");
  total.className = "activity-total";
  const value = activityTotalValue(activity);
  total.textContent = value === null ? "–" : `${value}${activity && hasUnknownActivityCount(activity) ? "+" : ""}`;
  return total;
}

function activityDescription(activity: LearningRhythm["activity"][number]): string {
  return [
    activity.reviews === null ? "review count unavailable" : `${activity.reviews} review${activity.reviews === 1 ? "" : "s"}`,
    activity.saved === null ? "saved-item count unavailable" : `${activity.saved} saved item${activity.saved === 1 ? "" : "s"}`,
    activity.lessons === null ? activity.lessonAdditions ? `${activity.lessonAdditions} new lesson${activity.lessonAdditions === 1 ? "" : "s"}; historical lesson count unavailable` : "lesson count unavailable" : `${activity.lessons} lesson${activity.lessons === 1 ? "" : "s"}`,
  ].join(", ");
}

function activityTotalValue(activity: LearningRhythm["activity"][number] | undefined): number | null {
  if (!activity) return 0;
  const counts = [activity.reviews, activity.saved, activity.lessons, activity.lessons === null ? activity.lessonAdditions ?? 0 : null].filter((count): count is number => count !== null);
  return counts.length > 0 ? counts.reduce((total, count) => total + count, 0) : null;
}

function hasUnknownActivityCount(activity: LearningRhythm["activity"][number]): boolean {
  return activity.reviews === null || activity.saved === null || activity.lessons === null;
}

function renderLessons(): HTMLElement {
  const wrapper = section("lessons-content");
  wrapper.append(eyebrow("12 small practical stories"), heading("Lessons"), text("Choose a situation. Each lesson is 3–5 minutes."));
  const availability = getLessonsAvailabilityView(lessonsError);
  if (availability.unavailable) { const retry = button(availability.retryLabel!, "button primary-button"); retry.addEventListener("click", () => void load()); wrapper.append(heading("Lessons are unavailable."), text(availability.message!), retry); return wrapper; }
  let lessonNumber = 0;
  const library = section("lesson-library");
  for (const lessonDefinition of lessonCatalog.lessons) {
    lessonNumber += 1;
    const lesson = button("", "lesson-card lesson-row");
    const lessonProgress = lessonProgressById[lessonDefinition.id] ?? null;
    const [level, ...title] = lessonDefinition.title.split(" · ");
    const completedLesson = lessonProgress?.completedAt !== null && lessonProgress !== null;
    const status = completedLesson ? "Completed" : lessonProgress ? "In progress" : "Ready";
    lesson.classList.toggle("resume-row", status === "In progress");
    const copy = document.createElement("span");
    copy.className = "lesson-copy";
    const titleNode = document.createElement("strong");
    titleNode.textContent = title.join(" · ");
    const meta = document.createElement("small");
    meta.textContent = `${lessonDefinition.pathway.replaceAll("-", " ")} · ${status === "In progress" ? "Notice · 3 min left" : status}`;
    copy.append(titleNode, meta);
    lesson.append(text(String(lessonNumber).padStart(2, "0"), "lesson-number"), copy, text(`(${level})`, "level"));
    lesson.addEventListener("click", () => void startLesson(lessonDefinition));
    library.append(lesson);
  }
  wrapper.append(library);
  wrapper.append(localNote()); return wrapper;
}

function createMonthWeekdays(): HTMLElement {
  const weekdays = document.createElement("div");
  weekdays.className = "month-weekdays";
  for (const label of ["M", "T", "W", "T", "F", "S", "S"]) {
    const weekday = document.createElement("span");
    weekday.textContent = label;
    weekdays.append(weekday);
  }
  return weekdays;
}

function createHeatmapLegend(): HTMLElement {
  const legend = document.createElement("div");
  legend.className = "heatmap-legend";
  legend.append(text("Less", "legend-label"));
  for (const level of ["idle", "grace", "active", "high"] as const) {
    const swatch = document.createElement("span");
    swatch.className = `heatmap-swatch ${level}`;
    swatch.setAttribute("aria-hidden", "true");
    legend.append(swatch);
  }
  legend.append(text("More", "legend-label"));
  return legend;
}

function createYearMonthLabels(year: number): HTMLElement {
  const labels = document.createElement("div");
  labels.className = "year-month-labels";
  const firstDay = new Date(year, 0, 1);
  for (const month of [0, 3, 6, 9]) {
    const label = document.createElement("span");
    label.textContent = new Date(year, month, 1).toLocaleDateString(undefined, { month: "short" });
    const dayOffset = Math.round((new Date(year, month, 1).getTime() - firstDay.getTime()) / 86_400_000);
    label.style.gridColumnStart = String(Math.floor((firstDay.getDay() + dayOffset) / 7) + 1);
    labels.append(label);
  }
  return labels;
}

function activityDays(period: "week" | "month" | "year", offset: number): number[] {
  const anchor = new Date();
  if (period === "week") {
    const monday = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - ((anchor.getDay() + 6) % 7) + (offset * 7));
    return Array.from({ length: 7 }, (_, index) => localDay(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)));
  }
  if (period === "month") { const date = new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1); return Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, index) => localDay(new Date(date.getFullYear(), date.getMonth(), index + 1))); }
  const year = anchor.getFullYear() + offset;
  return Array.from({ length: Math.round((new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime()) / 86_400_000) }, (_, index) => localDay(new Date(year, 0, index + 1)));
}
function activityLabel(period: "week" | "month" | "year", offset: number): string { const anchor = new Date(); if (period === "week") return offset === 0 ? "Last 7 days" : `${offset > 0 ? "+" : ""}${offset} week${Math.abs(offset) === 1 ? "" : "s"}`; if (period === "month") return new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" }); return String(anchor.getFullYear() + offset); }
function localDay(date: Date): number { return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); }

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
    updateBadge();
    snapshot = response.snapshot; rhythm = await learningClient.getRhythm(); revealed = false;
    if (snapshot.goalCompleted) screen = "today";
    pending = false;
    render();
  } catch (error) { pending = false; renderError(error instanceof Error ? error.message : "Your result could not be saved."); }
}

async function startContinuation(): Promise<void> { pending = true; render(); await load(true); pending = false; if (snapshot?.tasks.length) { screen = "review"; revealed = false; render(); content?.focus(); } }
async function saveSettings(changes: Partial<ReviewSettingsChanges>): Promise<void> { settings = await settingsClient.updateSettings(changes); render(); }

function createMasterySummary(): HTMLElement {
  const states = ["new", "learning", "familiar", "strong"] as const;
  const summary = section("mastery");
  for (const label of ["Recognition", "Recall"] as const) { const key = label.toLowerCase() as "recognition" | "recall"; const count = items.filter((item) => item[key].state !== "new").length; const state = [...states].reverse().find((candidate) => items.some((item) => item[key].state === candidate)) ?? "new"; const block = document.createElement("div"); block.append(text(`${label} · ${state}`, "section-title"), text(`${count} item${count === 1 ? "" : "s"} practised`, "body-copy")); summary.append(block); }
  return summary;
}
function updateBadge(): void { if (!dueBadge) return; const due = settings.dailyReviewBadge ? items.filter((item) => [item.recognition, item.recall].some((mastery) => mastery.attemptCount > 0 && mastery.dueAt !== null && mastery.dueAt <= Date.now())).length : 0; const label = `${due} saved item${due === 1 ? "" : "s"} still ha${due === 1 ? "s" : "ve"} one or more due recognition or recall reviews. Today shows up to five at a time.`; dueBadge.hidden = due === 0; dueBadge.textContent = String(due); dueBadge.setAttribute("aria-label", label); dueBadge.title = label; }
function renderError(message: string): void { if (!content) return; content.replaceChildren(eyebrow("Today unavailable"), heading("Your practice could not load."), text(message)); }
function section(className: string): HTMLElement { const element = document.createElement("section"); element.className = className; return element; }
function button(label: string, className: string): HTMLButtonElement { const element = document.createElement("button"); element.type = "button"; element.className = className; element.textContent = label; return element; }
function eyebrow(value: string): HTMLElement { return text(value, "eyebrow"); }
function heading(value: string): HTMLElement { const element = document.createElement("h1"); element.className = "heading"; element.textContent = value; return element; }
function text(value: string, className = "body-copy"): HTMLElement { const element = document.createElement("p"); element.className = className; element.textContent = value; return element; }
function helperMeaning(label: string, value: string): HTMLElement { const helper = document.createElement("span"); const name = document.createElement("b"); name.textContent = label; const meaning = document.createElement("span"); meaning.textContent = value; if (value === "unavailable") meaning.className = "meaning-unavailable"; helper.append(name, meaning); return helper; }
function meaning(label: string, value: string | null): HTMLElement { const row = section("meaning-row"); const name = document.createElement("strong"); name.textContent = label; const content = document.createElement("span"); content.textContent = value ?? "unavailable"; row.append(name, content); return row; }
function highlightedPattern(value: string): HTMLElement { const mark = document.createElement("mark"); mark.className = "pattern-highlight"; mark.textContent = value; return mark; }
function toggle(labelText: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement { const label = document.createElement("label"); label.className = "setting-control"; const textNode = document.createElement("strong"); textNode.textContent = labelText; const input = document.createElement("input"); input.type = "checkbox"; input.checked = checked; input.addEventListener("change", () => onChange(input.checked)); label.append(textNode, input); return label; }
function localNote(): HTMLElement { return text("Local learning only. No account required.", "local-note"); }
