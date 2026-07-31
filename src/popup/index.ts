import browser from "webextension-polyfill";
import { createLearningClient } from "./learning-client";
import { createSettingsClient } from "./settings-client";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";
import { getSavedContextViews, getSavedShelfView, type SavedContextView, type SavedShelfSort } from "./saved-shelf-view";
import { getPopupTabForKey } from "./tab-navigation";
import type { ContrastDailyFiveTask, DailyFiveSnapshot, GrammarDailyFiveTask } from "../vocabulary/daily-five";
import { LEARNING_RECORD_STORAGE_KEY, serializeLearningBackup, type LearningContext, type LearningItem, type LessonProgress } from "../vocabulary/learning-record";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import { defaultSettings, type ExtensionSettings } from "../shared/settings";
import type { ReviewSettingsChanges } from "../background/messages";
import { lessonCatalog, type GrammarPatternId, type Lesson } from "../lessons/catalog";
import { advanceLessonPractice as advanceLessonPracticeState, advanceLessonPracticeExercise, advanceLessonStage, advanceLessonTransfer, checkLessonPracticeExercise, checkLessonTransfer, createLessonSession, filterLessons, getLessonAvailability, getLessonCandidateChoices, getLessonsAvailabilityView, resumeLessonSession, revealLessonLine, revealLessonPractice, selectLessonPracticeExerciseAnswer, selectLessonTransferAnswer, toggleLessonCandidate, toggleLessonPracticeExerciseToken, type LessonFilterLevel, type LessonFilterStatus, type LessonSession } from "./lesson-session";
import { getSimpleTeluguPhonetics } from "../vocabulary/telugu-phonetics";
import { advanceSavedQuiz, createSavedQuizSession, getSavedQuizTask, revealSavedQuiz, type SavedQuizSession } from "./saved-quiz";
import { addSavedContextToken, checkSavedContextMission, createSavedContextMission, getSavedContextTokenOrder, removeSavedContextToken, resetSavedContextTokens, revealSavedContextMission, type SavedContextMission } from "./saved-context-mission";
import { grammarResultMessage } from "../grammar/learning";
import { getGrammarPattern, grammarPatterns, type GrammarExercise } from "../grammar/content";
import type { GrammarRecord } from "../grammar/learning";
import { contrastPack, type ContrastExercise, type ContrastPackId } from "../grammar/contrast";
import { contrastResultMessage, type ContrastRecord, type ImmediateContrastRepairOffer } from "../grammar/contrast-learning";
import { getGrammarProgressLabel, getNextFoundationPattern } from "../grammar/progression";
import { getVerbForm, getVerbJourney, isVerbJourneyContentAvailable, verbJourneyPack, type DutchTense, type JourneyRecord, type VerbFormRecord } from "../verb-journeys/content";
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
let screen: "today" | "lessons" | "saved" | "lesson" | "review" | "savedQuiz" | "savedContextMission" | "settings" | "verbJourneys" | "verbJourneyOverview" | "verbJourneyStory" | "verbJourneyNotice" | "verbMap" = "today";
let lessonSession: LessonSession | null = null;
let grammarRecord: GrammarRecord | null = null;
let grammarRecords: Partial<Record<GrammarPatternId, GrammarRecord>> = {};
let grammarPatternId: GrammarPatternId | null = null;
let grammarAnswer: string | null = null;
let grammarTokens: string[] = [];
let grammarFeedback: { correct: boolean; message: string } | null = null;
let grammarChecked = false;
let grammarOutcome: "reveal" | "skip" | null = null;
let grammarRetrying = false;
let contrastRecord: ContrastRecord | null = null;
let contrastExerciseIndex = 0;
let contrastOffer: ImmediateContrastRepairOffer | null = null;
let activeGrammarTask: GrammarDailyFiveTask | null = null;
let activeContrastTask: ContrastDailyFiveTask | null = null;
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
let savedActionBusy = false;
let savedFeedback: { tone: "success" | "error"; message: string } | null = null;
let savedQuizSession: SavedQuizSession | null = null;
let savedQuizError: string | null = null;
let savedQuizRetry: "again" | "got-it" | null = null;
let savedContextMission: SavedContextMission | null = null;
let savedContextMissionError: string | null = null;
let savedContextMissionRetry: "again" | "got-it" | null = null;
let lessonStatusFilter: LessonFilterStatus = "all";
let lessonLevelFilter: LessonFilterLevel = "all";
let focusedOrigin: "today" | "lessons" | "saved" | null = null;
let activeVerbJourneyId = "journey.werken.vtt-completed";
let selectedVerbFormTense: DutchTense = "VTT";
let verbMapOrigin: "overview" | "notice" = "overview";
let verbBoundaryMessage: string | null = null;

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
      const records = await Promise.all(grammarPatterns.map(async (pattern) => [pattern.id, await learningClient.getGrammar(pattern.id)] as const));
      grammarRecords = Object.fromEntries(records.filter((entry): entry is [GrammarPatternId, GrammarRecord] => entry[1] !== null));
      grammarRecord = grammarRecords["a0-zijn-present"] ?? null;
    } catch { grammarRecords = {}; grammarRecord = null; }
    try { contrastRecord = await learningClient.getContrast(); } catch { contrastRecord = null; }
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
  const focused = screen === "review" || screen === "lesson" || screen === "savedQuiz" || screen === "savedContextMission";
  const activeTab = focused
    ? focusedOrigin ?? (screen === "lesson" ? "lessons" : screen === "savedQuiz" || screen === "savedContextMission" ? "saved" : "today")
    : screen === "lesson" || screen === "lessons" || screen === "verbJourneys" || screen === "verbJourneyOverview" || screen === "verbJourneyStory" || screen === "verbJourneyNotice" || screen === "verbMap" ? "lessons" : screen === "review" || screen === "today" || screen === "settings" ? "today" : "saved";
  settingsButton?.toggleAttribute("hidden", focused);
  primaryNavigation?.toggleAttribute("hidden", screen === "lesson");
  primaryNavigation?.classList.toggle("is-locked", focused);
  content.classList.toggle("lesson-panel", screen === "lesson");
  content.classList.toggle("verb-journey-panel", screen === "verbJourneys" || screen === "verbJourneyOverview" || screen === "verbJourneyStory" || screen === "verbJourneyNotice" || screen === "verbMap");
  content.classList.toggle("today-panel", screen === "today");
  for (const [tab, key] of [[todayTab, "today"], [lessonsTab, "lessons"], [savedTab, "saved"]] as const) {
    const selected = activeTab === key;
    tab?.classList.toggle("is-active", selected);
    tab?.setAttribute("aria-selected", String(selected));
    tab?.setAttribute("tabindex", selected && !focused ? "0" : "-1");
    if (tab) tab.disabled = focused;
    tab?.setAttribute("aria-disabled", String(focused));
  }
  content?.setAttribute("aria-labelledby", `${activeTab}-tab`);
  updateBadge();
  content.replaceChildren(screen === "today" ? renderToday() : screen === "lessons" ? renderLessons() : screen === "saved" ? renderSaved() : screen === "lesson" ? renderLesson() : screen === "review" ? renderReview() : screen === "savedQuiz" ? renderSavedQuiz() : screen === "savedContextMission" ? renderSavedContextMission() : screen === "verbJourneys" ? renderVerbJourneys() : screen === "verbJourneyOverview" ? renderVerbJourneyOverview() : screen === "verbJourneyStory" ? renderVerbJourneyStory() : screen === "verbJourneyNotice" ? renderVerbJourneyNotice() : screen === "verbMap" ? renderVerbMap() : renderSettings());
}

function renderSaved(): HTMLElement {
  const wrapper = section("saved-content");
  const view = getSavedShelfView(items, { sort: savedSort, expandedItemId: expandedSavedItemId, loading: savedLoading, error: savedError });
  const header = document.createElement("div");
  header.className = "saved-head";
  header.append(eyebrow("Your collection"), heading("Saved"));
  const guidelines = document.createElement("ul");
  guidelines.className = "saved-guidelines";
  for (const copy of ["Select a word on a website to save it here.", "Local learning only. No account required."]) {
    const item = document.createElement("li");
    item.textContent = copy;
    guidelines.append(item);
  }
  wrapper.append(header, guidelines, renderSavedBackupControls());
  if (savedFeedback) {
    const feedback = text(savedFeedback.message, "saved-feedback");
    feedback.setAttribute("role", "status");
    feedback.dataset.tone = savedFeedback.tone;
    wrapper.append(feedback);
  }
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
  const quiz = button("Quiz Saved", "button primary-button saved-quiz-entry");
  quiz.addEventListener("click", startSavedQuiz);
  wrapper.append(quiz);
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
    helpers.append(helperMeaning("EN", item.english), helperMeaningWithPhonetics("TE", item.telugu, getSimpleTeluguPhonetics(item.telugu)));
    copy.append(dutch, helpers);
    const mastery = document.createElement("span"); mastery.className = "saved-mastery"; mastery.textContent = item.mastery;
    row.append(number, copy, mastery);
    card.append(row);
    if (item.expanded && item.details) {
      const detail = document.createElement("div");
      detail.id = `saved-detail-${item.shelfNumber}`;
      detail.className = "saved-detail";
      if (item.details.source) detail.append(text(item.details.source, "saved-source"));
      const sourceItem = items.find((candidate) => candidate.id === item.id);
      const sourceContexts = [...(sourceItem?.contexts ?? [])].sort((first, second) => second.addedAt - first.addedAt).slice(0, 3);
      for (const [index, context] of item.details.contexts.entries()) detail.append(renderSavedContext(context, item.dutch, item.id, sourceContexts[index]));
      if (item.details.contexts.length === 0) detail.append(text("No saved page context.", "saved-no-context"));
      const mission = sourceItem ? createSavedContextMission(sourceItem) : null;
      if (mission) {
        const practise = button("Practise context", "button primary-button saved-context-practice");
        practise.disabled = pending || savedActionBusy;
        practise.addEventListener("click", () => startSavedContextMission(item.id));
        detail.append(practise);
      }
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

function renderSavedBackupControls(): HTMLElement {
  const controls = document.createElement("div");
  controls.className = "saved-backup-actions";
  const exportButton = button("Export", "button secondary-button");
  exportButton.disabled = savedActionBusy;
  exportButton.addEventListener("click", () => void exportSavedBackup());
  const importButton = button("Import", "button secondary-button");
  importButton.disabled = savedActionBusy;
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json,.json";
  fileInput.hidden = true;
  importButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    fileInput.value = "";
    if (file) void importSavedBackup(file);
  });
  controls.append(exportButton, importButton, fileInput);
  return controls;
}

async function exportSavedBackup(): Promise<void> {
  savedActionBusy = true;
  savedFeedback = null;
  render();
  try {
    const backup = await learningClient.exportBackup();
    const blob = new Blob([serializeLearningBackup(backup)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dutchmate-learning-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    savedFeedback = { tone: "success", message: `Exported ${backup.learningItems.length} saved item${backup.learningItems.length === 1 ? "" : "s"}.` };
  } catch (error) {
    savedFeedback = { tone: "error", message: `Could not export saved learning: ${error instanceof Error ? error.message : "Unknown error"}` };
  } finally {
    savedActionBusy = false;
    render();
  }
}

async function importSavedBackup(file: File): Promise<void> {
  savedActionBusy = true;
  savedFeedback = null;
  render();
  try {
    const result = await learningClient.importBackup(await file.text());
    await loadSaved();
    savedFeedback = { tone: "success", message: `Imported ${result.importedCount} item${result.importedCount === 1 ? "" : "s"}. You now have ${result.totalCount} saved items.` };
  } catch (error) {
    savedFeedback = { tone: "error", message: error instanceof Error ? error.message : "Saved learning import failed." };
  } finally {
    savedActionBusy = false;
    render();
  }
}

async function removeSavedContext(itemId: string, context: Pick<LearningContext, "text" | "addedAt" | "sourceLanguage">): Promise<void> {
  savedActionBusy = true;
  savedFeedback = null;
  render();
  try {
    const updated = await learningClient.removeContext(itemId, context);
    items = items.map((item) => item.id === updated.id ? updated : item);
    savedFeedback = { tone: "success", message: "Saved context removed." };
  } catch (error) {
    savedFeedback = { tone: "error", message: `Could not remove saved context: ${error instanceof Error ? error.message : "Unknown error"}` };
  } finally {
    savedActionBusy = false;
    render();
  }
}

function renderToday(): HTMLElement {
  const wrapper = section(`today-content brief-today ${activityPeriod === "week" ? "today-week" : "calendar-focus"}`);
  if (!snapshot) { wrapper.append(eyebrow("Today"), heading("Loading your Daily Five…"), localNote()); return wrapper; }
  if (savedError && items.length === 0) {
    const retry = button("Try again", "button primary-button");
    retry.addEventListener("click", () => void loadSaved());
    wrapper.append(eyebrow("Today unavailable"), heading("Your learning record could not load."), text(savedError), retry, localNote());
    return wrapper;
  }
  const view = getDailyFiveView(snapshot);
  const completed = view.status === "complete";
  const total = view.total;
  const done = view.completed;
  const inProgress = lessonCatalog.lessons.find((lesson) => {
    const progress = lessonProgressById[lesson.id];
    return progress && progress.completedAt === null;
  });
  const hasCompletedLesson = lessonCatalog.lessons.some((lesson) => lessonProgressById[lesson.id]?.completedAt !== null && lessonProgressById[lesson.id]?.completedAt !== undefined);
  const todayActivity = rhythm?.activity.find((day) => isLocalToday(day.dayStartAt));
  const reviewsCompletedToday = todayActivity?.reviews ?? null;
  const lessonsCompletedToday = todayActivity?.lessons ?? todayActivity?.lessonAdditions ?? null;
  const grammarCount = snapshot.tasks.filter((task) => "kind" in task && task.kind === "grammar").length;
  const nextAction = section("next-action");
  const actionCopy = completed
    ? text("Your Daily Five is complete. Keep going only if you want to.", "body-copy completion-copy")
    : text(total === 0
      ? "Choose a short practical story. DutchMate will never start one automatically."
      : grammarCount > 0
        ? "Practise useful words and use one grammar pattern in context."
        : "Practise five useful words. Start now.");
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
      else { focusedOrigin = "today"; screen = "review"; revealed = false; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; activeGrammarTask = null; activeContrastTask = null; render(); content?.focus(); }
    });
    nextAction.append(action);
    if (completed && reviewsCompletedToday !== null) nextAction.append(text(`${reviewsCompletedToday} item${reviewsCompletedToday === 1 ? "" : "s"} reviewed today`, "review-completion-meta"));
  }
  if (total === 0 || !completed) nextAction.append(text(total === 0 ? "Practical Dutch · 3–5 min" : `${done} of ${total} today`, "action-meta"));
  const lessonActionLabel = inProgress ? "Continue lesson" : hasCompletedLesson ? "Learn another lesson" : null;
  if (lessonActionLabel) {
    const lessonAction = button(lessonActionLabel, "button secondary-button lesson-entry-button");
    lessonAction.addEventListener("click", () => {
      if (inProgress) void startLesson(inProgress);
      else { screen = "lessons"; render(); }
    });
    nextAction.append(lessonAction);
    if (lessonsCompletedToday !== null) nextAction.append(text(`${lessonsCompletedToday} lesson${lessonsCompletedToday === 1 ? "" : "s"} completed today`, "lesson-completion-meta"));
  }
  wrapper.append(nextAction);
  if (rhythm) wrapper.append(renderRhythm(rhythm));
  wrapper.append(localNote());
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
  const periodDays = activityDays(activityPeriod, activityOffset);
  for (const dayStartAt of periodDays) {
    const activity = activityByDay.get(dayStartAt);
    const day = current.week.find((candidate) => candidate.dayStartAt === dayStartAt);
    const status = day?.status ?? (current.week.some((candidate) => candidate.status === "grace") && dayStartAt === periodDays[1] ? "grace" : activity ? "active" : "idle");
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
  section.append(text("Totals use recorded activity; older lesson history may be unavailable.", "heatmap-note"));
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
  total.textContent = value === null ? "–" : String(value);
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

function renderLessons(): HTMLElement {
  const wrapper = section("lessons-content");
  wrapper.append(eyebrow(`Lesson library · ${lessonCatalog.lessons.length} small practical stories`), heading("Lesson library"), text("Choose a situation. Each lesson is 3–5 minutes."));
  const verbEntry = button("", "verb-journey-entry");
  verbEntry.setAttribute("aria-label", "Open Verb Journeys");
  const entryText = (value: string, className: string): HTMLElement => { const node = document.createElement("span"); node.className = className; node.textContent = value; return node; };
  verbEntry.append(entryText("Verb Journeys", "verb-entry-kicker"), entryText("Follow one useful verb from a real context to its complete Dutch map.", "verb-entry-copy"), entryText("Open journeys →", "verb-entry-action"));
  verbEntry.addEventListener("click", () => { screen = "verbJourneys"; render(); content?.focus(); });
  wrapper.append(verbEntry);
  wrapper.append(renderLessonFilters());
  const availability = getLessonsAvailabilityView(lessonsError);
  if (availability.unavailable) { const retry = button(availability.retryLabel!, "button primary-button"); retry.addEventListener("click", () => void load()); wrapper.append(heading("Lessons are unavailable."), text(availability.message!), retry); return wrapper; }
  const library = section("lesson-library");
  const visibleLessons = filterLessons(lessonCatalog.lessons, lessonProgressById, lessonStatusFilter, lessonLevelFilter);
  const nextFoundationPattern = getNextFoundationPattern(grammarPatterns, grammarRecords);
  for (const lessonDefinition of visibleLessons) {
    const lessonNumber = lessonCatalog.lessons.indexOf(lessonDefinition) + 1;
    const lesson = button("", "lesson-card lesson-row");
    const lessonProgress = lessonProgressById[lessonDefinition.id] ?? null;
    const [level, ...title] = lessonDefinition.title.split(" · ");
    const availabilityStatus = getLessonAvailability(lessonProgress);
    const status = availabilityStatus === "completed" ? "Completed" : availabilityStatus === "continue" ? "In progress" : "Ready";
    lesson.classList.toggle("resume-row", availabilityStatus === "continue");
    const copy = document.createElement("span");
    copy.className = "lesson-copy";
    const titleNode = document.createElement("strong");
    titleNode.textContent = title.join(" · ");
    const meta = document.createElement("small");
    meta.textContent = `${lessonDefinition.pathway.replaceAll("-", " ")} · ${availabilityStatus === "continue" ? `Continue · ${lessonStageLabel(lessonProgress!.stage)} · 3 min left` : status}`;
    const pattern = lessonDefinition.grammarCompanion && getGrammarPattern(lessonDefinition.grammarCompanion.patternId);
    const progressLabel = pattern ? getGrammarProgressLabel(grammarRecords[pattern.id]) : null;
    const patternMeta = pattern && progressLabel ? text(`Pattern: ${progressLabel}`, "lesson-pattern-status") : null;
    copy.append(titleNode, meta);
    if (patternMeta) copy.append(patternMeta);
    if (pattern?.id === nextFoundationPattern?.id) copy.append(text("Next A0 pattern", "lesson-pattern-status lesson-pattern-next"));
    lesson.append(text(String(lessonNumber).padStart(2, "0"), "lesson-number"), copy, text(`(${level})`, "level"));
    lesson.addEventListener("click", () => void startLesson(lessonDefinition));
    library.append(lesson);
  }
  wrapper.append(library);
  if (visibleLessons.length === 0) wrapper.append(text("No lessons match these filters.", "empty-state"));
  wrapper.append(localNote()); return wrapper;
}

function renderVerbJourneys(): HTMLElement {
  const wrapper = section("verb-journeys-content");
  if (!isVerbJourneyContentAvailable()) {
    wrapper.append(eyebrow("Verb Journeys unavailable"), heading("This content needs an update."), text("The reviewed werken pack could not be loaded safely."));
    const back = button("Back to Lessons", "button primary-button"); back.addEventListener("click", () => { screen = "lessons"; render(); }); wrapper.append(back);
    return wrapper;
  }
  const back = button("← Lessons", "journey-back");
  back.addEventListener("click", () => { screen = "lessons"; render(); });
  wrapper.append(back, eyebrow("Lessons · Verb Journeys"), heading("Verb Journeys"), text("Choose one useful Dutch verb and follow its staged forms from context to reference."));
  const list = section("verb-directory");
  const entries = [
    { number: "01", lemma: "werken", detail: "to work · A1 core verb", enabled: true },
    { number: "02", lemma: "zijn", detail: "to be · coming later", enabled: false },
    { number: "03", lemma: "hebben", detail: "to have · coming later", enabled: false },
    { number: "04", lemma: "gaan", detail: "to go · coming later", enabled: false },
  ];
  for (const entry of entries) {
    const row = entry.enabled ? button("", "verb-directory-row") : document.createElement("div");
    row.className = `verb-directory-row${entry.enabled ? " is-openable" : " is-placeholder"}`;
    row.setAttribute("aria-label", entry.enabled ? `Open ${entry.lemma} Verb Journey` : `${entry.lemma} Verb Journey coming later`);
    const number = document.createElement("span"); number.className = "verb-directory-number"; number.textContent = entry.number;
    const copy = document.createElement("span"); copy.className = "verb-directory-copy";
    const lemma = document.createElement("strong"); lemma.textContent = entry.lemma;
    const detail = document.createElement("small"); detail.textContent = entry.detail;
    copy.append(lemma, detail);
    const action = document.createElement("span"); action.className = "verb-directory-action"; action.textContent = entry.enabled ? "Open →" : "Later";
    row.append(number, copy, action);
    if (entry.enabled) row.addEventListener("click", () => { screen = "verbJourneyOverview"; render(); content?.focus(); });
    list.append(row);
  }
  wrapper.append(list, text("Numbers reserve a stable place for future verb journeys; they do not lock your learning path.", "local-note"));
  return wrapper;
}

function renderVerbJourneyOverview(): HTMLElement {
  const wrapper = section("verb-journey-overview");
  const pack = verbJourneyPack;
  const back = button("← Verb Journeys", "journey-back");
  back.addEventListener("click", () => { screen = "verbJourneys"; render(); });
  wrapper.append(back, eyebrow("A1 core verb"), heading(pack.verb.lemma), text(`${pack.verb.english} · regular weak verb · auxiliary: ${pack.verb.auxiliary}`, "journey-lead"));
  const mapAction = button("", "verb-map-summary");
  mapAction.setAttribute("aria-label", "Open the eight-form Verb Map");
  mapAction.append(spanText("CANONICAL REFERENCE", "map-summary-kicker"), spanText("Eight Dutch forms", "map-summary-title"), spanText("One stable map for every werken journey.", "map-summary-copy"), spanText("Open Verb Map →", "map-summary-action"));
  mapAction.addEventListener("click", () => { selectedVerbFormTense = "VTT"; verbMapOrigin = "overview"; screen = "verbMap"; render(); content?.focus(); });
  wrapper.append(mapAction, text("Learning journeys", "journey-section-label"));
  const journeyList = section("journey-list");
  for (const journey of pack.journeys) {
    const row = button("", "journey-list-row");
    row.setAttribute("aria-label", `${journey.title}, ${journey.subtitle}, ${journey.status}`);
    const status = document.createElement("span"); status.className = `journey-status ${journey.status}`; status.textContent = journey.status === "mastered" ? "✓" : journey.status === "reference" ? "◇" : journey.status === "learning" ? "2" : journey.status === "next" ? "3" : journey.targetForms[0] ?? "·";
    const copy = document.createElement("span"); copy.className = "journey-list-copy";
    const title = document.createElement("strong"); title.textContent = journey.title;
    const subtitle = document.createElement("small"); subtitle.textContent = journey.subtitle;
    copy.append(title, subtitle);
    const badge = document.createElement("span"); badge.className = `journey-status-label ${journey.status}`; badge.textContent = journey.status === "mastered" ? "Mastered" : journey.status === "learning" ? "Continue" : journey.status === "next" ? "Next" : journey.status === "reference" ? "Reference" : "Later";
    row.append(status, copy, badge);
    row.addEventListener("click", () => openVerbJourney(journey));
    journeyList.append(row);
  }
  wrapper.append(journeyList);
  if (verbBoundaryMessage) { const status = text(verbBoundaryMessage, "journey-boundary"); status.setAttribute("role", "status"); wrapper.append(status); }
  const current = getVerbJourney(activeVerbJourneyId) ?? pack.journeys[1];
  const continueButton = button(`Continue ${current.title} →`, "button primary-button");
  continueButton.addEventListener("click", () => openVerbJourney(current));
  wrapper.append(continueButton);
  return wrapper;
}

function openVerbJourney(journey: JourneyRecord): void {
  activeVerbJourneyId = journey.id;
  verbBoundaryMessage = null;
  if (journey.kind === "core" && journey.story.length > 0) { screen = "verbJourneyStory"; render(); content?.focus(); return; }
  verbBoundaryMessage = `${journey.title} is reference material in this first slice. The complete map remains available without a beginner gate.`;
  screen = "verbJourneyOverview";
  render();
}

function renderVerbJourneyStory(): HTMLElement {
  const wrapper = section("verb-journey-story");
  const journey = getVerbJourney(activeVerbJourneyId) ?? verbJourneyPack.journeys[1];
  const back = button(`← ${journey.title}`, "journey-back");
  back.addEventListener("click", () => { screen = "verbJourneyOverview"; render(); });
  wrapper.append(back, text(`${journey.subtitle} · Story`, "journey-meta"), eyebrow(journey.title), heading(journey.storyTitle ?? journey.title));
  const story = section("verb-story-card");
  for (const line of journey.story) {
    const row = document.createElement("div"); row.className = "verb-story-line";
    row.append(renderStoryLine(line), text(line.english, "verb-story-translation"));
    story.append(row);
  }
  wrapper.append(story, text("Read the highlighted form in context, then notice what changes.", "journey-helper"));
  const next = button("Notice the pattern →", "button primary-button");
  next.addEventListener("click", () => { screen = "verbJourneyNotice"; render(); content?.focus(); });
  wrapper.append(next);
  return wrapper;
}

function renderStoryLine(line: { nl: string; targets: Array<{ text: string }> }): HTMLElement {
  const element = document.createElement("p"); element.className = "verb-story-dutch"; element.lang = "nl";
  let cursor = 0;
  const targets = [...line.targets].sort((first, second) => line.nl.indexOf(first.text) - line.nl.indexOf(second.text));
  for (const target of targets) {
    const start = line.nl.indexOf(target.text, cursor);
    if (start < cursor) continue;
    element.append(line.nl.slice(cursor, start), highlightedPattern(target.text));
    cursor = start + target.text.length;
  }
  element.append(line.nl.slice(cursor));
  return element;
}

function renderVerbJourneyNotice(): HTMLElement {
  const wrapper = section("verb-journey-notice");
  const journey = getVerbJourney(activeVerbJourneyId) ?? verbJourneyPack.journeys[1];
  const notice = journey.notice ?? verbJourneyPack.journeys[1].notice!;
  const back = button("← Story", "journey-back");
  back.addEventListener("click", () => { screen = "verbJourneyStory"; render(); });
  wrapper.append(back, text(`${journey.subtitle} · Notice`, "journey-meta"), eyebrow("Notice the pattern"), heading(notice.title), text(notice.subtitle, "journey-lead"));
  const comparison = section("verb-pattern-stack");
  for (const item of notice.comparison) {
    const card = section("verb-pattern-card");
    card.append(text(item.label, `verb-pattern-tag ${item.tense === journey.targetForms[0] ? "current" : "contrast"}`), text(item.sentence, "verb-pattern-sentence"), text(item.meaning, "verb-pattern-meaning"));
    comparison.append(card);
  }
  const formula = section("verb-formula-card");
  formula.append(text("FORMULA", "verb-card-label"), text(notice.formula, "verb-formula"), text(notice.formulaNote, "verb-card-copy"));
  const contrast = section("verb-contrast-card");
  contrast.append(text("VALUABLE CONTRAST", "verb-card-label"), text(notice.valuableContrast, "verb-card-copy"));
  wrapper.append(comparison, formula, contrast);
  const next = button("Place it on the 8-form map →", "button primary-button");
  next.addEventListener("click", () => { selectedVerbFormTense = journey.targetForms[0] ?? "VTT"; verbMapOrigin = "notice"; screen = "verbMap"; render(); content?.focus(); });
  wrapper.append(next);
  return wrapper;
}

function renderVerbMap(): HTMLElement {
  const wrapper = section("verb-map-screen");
  const back = button(verbMapOrigin === "notice" ? "← Notice" : "← werken", "journey-back");
  back.addEventListener("click", () => { screen = verbMapOrigin === "notice" ? "verbJourneyNotice" : "verbJourneyOverview"; render(); });
  wrapper.append(back, text("Canonical map · werken", "journey-meta"), eyebrow("Eight Dutch forms"), heading("Werken Verb Map"), text("One stable map for every werken journey. Select a form to inspect it.", "journey-lead"));
  const legend = document.createElement("div"); legend.className = "verb-map-legend";
  for (const status of ["mastered", "learning", "later", "reference"] as const) { const item = document.createElement("span"); item.textContent = status === "mastered" ? "Mastered" : status === "learning" ? "Learning now" : status[0].toUpperCase() + status.slice(1); item.className = `map-legend-item ${status}`; legend.append(item); }
  wrapper.append(legend);
  const map = document.createElement("div"); map.className = "verb-map-grid"; map.setAttribute("role", "grid"); map.setAttribute("aria-label", "Eight Dutch forms for werken");
  const corner = document.createElement("div"); corner.className = "verb-map-corner"; corner.textContent = "VIEWPOINT"; map.append(corner);
  for (const headingValue of ["Onvoltooid", "Voltooid"]) { const header = document.createElement("div"); header.className = "verb-map-column"; header.textContent = headingValue; map.append(header); }
  for (const viewpoint of ["present", "past", "future", "future-from-past"] as const) {
    const rowLabel = document.createElement("div"); rowLabel.className = "verb-map-row-label"; rowLabel.textContent = viewpoint === "future-from-past" ? "Future from past" : viewpoint[0].toUpperCase() + viewpoint.slice(1); map.append(rowLabel);
    for (const completion of ["onvoltooid", "voltooid"] as const) {
      const form = verbJourneyPack.dutchForms.find((candidate) => candidate.viewpoint === viewpoint && candidate.completion === completion)!;
      const card = button("", `verb-form-card ${form.status}${form.dutchTense === selectedVerbFormTense ? " selected" : ""}`);
      card.setAttribute("role", "gridcell"); card.setAttribute("aria-label", `${form.dutchTense}: ${form.fullNameNl}`); card.setAttribute("aria-pressed", String(form.dutchTense === selectedVerbFormTense));
      card.append(spanText(form.dutchTense, "verb-form-code"), spanText(form.fullNameNl, "verb-form-full"), spanText(form.sentence, "verb-form-example"));
      card.addEventListener("click", () => { selectedVerbFormTense = form.dutchTense; render(); });
      map.append(card);
    }
  }
  wrapper.append(map);
  const selected = getVerbForm(selectedVerbFormTense) ?? verbJourneyPack.dutchForms[0];
  wrapper.append(renderVerbFormDetail(selected), text("Important: Dutch onvoltooid does not mean the same thing as English continuous, and voltooid is not always a direct English perfect. Context and time words still matter.", "verb-map-note"));
  return wrapper;
}

function renderVerbFormDetail(form: VerbFormRecord): HTMLElement {
  const detail = section("verb-form-detail");
  detail.append(text(`${form.dutchTense} · ${form.fullNameNl}`, "verb-detail-heading"), text(form.sentence, "verb-detail-example"), meaning("Practical meaning", form.usageMeaning), meaning("Formula", form.formula), meaning("Common usage", form.commonUsage), meaning("Learning priority", `${form.cefrLevel} · ${form.teachingPriority}`));
  return detail;
}

function renderLessonFilters(): HTMLElement {
  const filters = section("lesson-filters");
  filters.append(text("Filter lessons", "section-title"));
  const statusGroup = document.createElement("div");
  statusGroup.className = "lesson-filter-group";
  statusGroup.setAttribute("aria-label", "Lesson readiness");
  for (const [value, label] of [["all", "All"], ["ready", "Ready"], ["continue", "Continue"], ["completed", "Completed"]] as const) {
    const control = button(label, `lesson-filter${lessonStatusFilter === value ? " is-active" : ""}`);
    control.setAttribute("aria-pressed", String(lessonStatusFilter === value));
    control.addEventListener("click", () => { lessonStatusFilter = value; render(); });
    statusGroup.append(control);
  }
  filters.append(statusGroup);
  const levelGroup = document.createElement("div");
  levelGroup.className = "lesson-filter-group level-filters";
  levelGroup.setAttribute("aria-label", "Lesson level");
  const levels: LessonFilterLevel[] = ["all", ...new Set(lessonCatalog.lessons.map((lesson) => lesson.cefr))];
  for (const level of levels) {
    const control = button(level === "all" ? "All levels" : level, `lesson-filter${lessonLevelFilter === level ? " is-active" : ""}`);
    control.setAttribute("aria-pressed", String(lessonLevelFilter === level));
    control.addEventListener("click", () => { lessonLevelFilter = level; render(); });
    levelGroup.append(control);
  }
  filters.append(levelGroup);
  return filters;
}
function lessonStageLabel(stage: LessonProgress["stage"]): string { return stage.charAt(0).toUpperCase() + stage.slice(1); }

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
    const weekStart = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - ((anchor.getDay() + 6) % 7) + (offset * 7));
    return Array.from({ length: 7 }, (_, index) => localDay(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + index)));
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
  const exit = button("Exit lesson", "exit-button"); exit.addEventListener("click", () => { lessonSession = null; screen = focusedOrigin ?? "lessons"; focusedOrigin = null; render(); });
  const rail = document.createElement("div"); rail.className = "lesson-rail"; rail.setAttribute("aria-label", "Lesson stages");
  for (const stage of ["read", "notice", "practise", "keep"] as const) {
    const active = session.stage === stage || (stage === "practise" && session.stage === "replay");
    const stageNode = text(stage.charAt(0).toUpperCase() + stage.slice(1), `lesson-stage${active ? " active" : ""}`);
    stageNode.setAttribute("aria-current", active ? "step" : "false");
    rail.append(stageNode);
  }
  wrapper.append(exit, rail);
  if (session.stage === "read" || session.stage === "replay") wrapper.append(renderLessonStory(session, session.stage === "read"));
  if (session.stage === "notice") wrapper.append(renderLessonNotice(session));
  if (session.stage === "practise") wrapper.append(session.practiceIndex < session.lesson.practice.length ? renderLessonPractice(session) : renderLessonAuthoredExercise(session));
  if (session.stage === "keep") wrapper.append(renderLessonKeep(session));
  return wrapper;
}

function renderLessonStory(session: LessonSession, allowHelp: boolean): HTMLElement {
  const story = section("lesson-story"); story.append(eyebrow(session.stage === "read" ? "Read the situation" : "Replay"), heading(session.lesson.title));
  session.lesson.lines.forEach((line, index) => { const row = section("story-line"); row.append(text(line.dutch, "story-dutch")); if (allowHelp && session.revealedLineIndexes.includes(index)) row.append(text(`English: ${line.english}`, "helper-copy"), text(`Telugu: ${line.telugu}`, "helper-copy")); else if (allowHelp) { const help = button("Show line help", "line-help"); help.addEventListener("click", () => { lessonSession = revealLessonLine(session, index); render(); }); row.append(help); } story.append(row); });
  if (session.stage === "replay" && session.lesson.practiceEnvelope) { story.append(renderLessonTransfer(session)); return story; }
  const next = button(session.stage === "read" ? "Notice the pattern" : "Choose what to keep", "button primary-button"); next.addEventListener("click", () => void advanceLesson(session)); story.append(next); return story;
}

function renderLessonTransfer(session: LessonSession): HTMLElement {
  const transfer = session.lesson.practiceEnvelope!.transfer;
  const panel = section("lesson-transfer");
  panel.append(eyebrow("Apply"), heading(transfer.prompt), text(transfer.context, "story-dutch"));
  const choices = document.createElement("div"); choices.className = "grammar-choices lesson-transfer-choices";
  for (const choice of transfer.choices) {
    const action = button(choice, `button${session.transferAnswer === choice ? " is-selected" : ""}`);
    action.setAttribute("aria-pressed", String(session.transferAnswer === choice)); action.disabled = session.transferChecked || pending;
    action.addEventListener("click", () => { lessonSession = selectLessonTransferAnswer(session, choice); render(); }); choices.append(action);
  }
  panel.append(choices);
  if (session.transferChecked) {
    const status = text(session.transferResult === "correct" ? `Correct. ${transfer.feedback}` : `Not yet. ${transfer.feedback}`, "grammar-feedback"); status.setAttribute("role", "status"); panel.append(status);
    if (session.transferResult === "incorrect") { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", () => { lessonSession = { ...session, transferAnswer: null, transferChecked: false, transferResult: null }; render(); }); panel.append(retry); }
  }
  const next = button(session.transferResult === "correct" ? "Choose what to keep" : "Check answer", "button primary-button"); next.disabled = pending || (session.transferResult !== "correct" && session.transferAnswer === null); next.addEventListener("click", () => { if (session.transferResult === "correct") void advanceLesson(session); else { lessonSession = checkLessonTransfer(session); render(); } }); panel.append(next);
  return panel;
}

function renderLessonAuthoredExercise(session: LessonSession): HTMLElement {
  const exercise = session.lesson.practiceExercises[session.authoredExerciseIndex];
  const panel = section("practice-card lesson-authored-exercise");
  if (!exercise) return panel;
  const label = exercise.primitive === "contrast-form" ? "Choose" : exercise.primitive === "repair-choice" ? "Repair" : "Build";
  panel.append(eyebrow(`Practise · ${label}`), heading(exercise.prompt), text(exercise.context, "story-dutch"));
  if (exercise.primitive === "order-tokens" && exercise.tokens) {
    const answer = section("grammar-order-answer");
    answer.setAttribute("aria-live", "polite");
    answer.append(text(session.authoredTokens.length > 0 ? session.authoredTokens.join(" ") : "Choose tokens in order.", session.authoredTokens.length > 0 ? "" : "grammar-order-placeholder"));
    panel.append(answer);
    const choices = document.createElement("div"); choices.className = "grammar-choices grammar-token-choices";
    for (const token of exercise.tokens) {
      const selected = session.authoredTokens.includes(token);
      const action = button(token, `button grammar-token lesson-authored-token${selected ? " is-selected" : ""}`);
      action.setAttribute("aria-pressed", String(selected)); action.disabled = session.authoredChecked || pending;
      action.addEventListener("click", () => { lessonSession = toggleLessonPracticeExerciseToken(session, token); render(); });
      choices.append(action);
    }
    panel.append(choices);
  } else {
    const choices = document.createElement("div"); choices.className = "grammar-choices lesson-authored-choices";
    for (const choice of exercise.choices) {
      const action = button(choice, `button lesson-authored-choice${session.authoredAnswer === choice ? " is-selected" : ""}`);
      action.setAttribute("aria-pressed", String(session.authoredAnswer === choice)); action.disabled = session.authoredChecked || pending;
      action.addEventListener("click", () => { lessonSession = selectLessonPracticeExerciseAnswer(session, choice); render(); });
      choices.append(action);
    }
    panel.append(choices);
  }
  if (session.authoredChecked) {
    const status = text(session.authoredResult === "correct" ? `Correct. ${exercise.feedback}` : `Not yet. ${exercise.feedback}`, "grammar-feedback");
    status.setAttribute("role", "status"); panel.append(status);
    if (session.authoredResult === "incorrect") {
      const retry = button("Try again", "button"); retry.disabled = pending;
      retry.addEventListener("click", () => { lessonSession = { ...session, authoredAnswer: null, authoredTokens: [], authoredChecked: false, authoredResult: null }; render(); });
      panel.append(retry);
    }
  }
  const next = button(session.authoredResult === "correct" ? "Continue" : "Check answer", "button primary-button");
  next.disabled = pending || (session.authoredResult !== "correct" && session.authoredAnswer === null);
  next.addEventListener("click", () => { if (session.authoredResult === "correct") void advanceLessonAuthoredExercise(session); else { lessonSession = checkLessonPracticeExercise(session); render(); } });
  panel.append(next);
  return panel;
}

function renderLessonNotice(session: LessonSession): HTMLElement { const contrastCompanion = session.lesson.contrastCompanion; if (contrastCompanion) return renderContrastNotice(session, contrastCompanion.id); const companion = session.lesson.grammarCompanion; if (companion) return renderGrammarNotice(session, companion.patternId); const panel = section("lesson-story"); panel.append(eyebrow("Notice"), heading(session.lesson.pattern), text(session.lesson.patternExplanation)); for (const line of session.lesson.lines) { const row = document.createElement("p"); row.className = "story-dutch"; const start = line.dutch.indexOf(session.lesson.patternText); if (start < 0) row.textContent = line.dutch; else { row.append(line.dutch.slice(0, start), highlightedPattern(session.lesson.patternText), line.dutch.slice(start + session.lesson.patternText.length)); } panel.append(row); } const next = button("Practise", "button primary-button"); next.addEventListener("click", () => void advanceLesson(session)); panel.append(next); return panel; }
function renderGrammarAnswerControls(exercise: GrammarExercise | ContrastExercise): HTMLElement {
  if (exercise.primitive === "order-tokens" && exercise.tokens) {
    const wrapper = section("grammar-order-controls");
    const answer = section("grammar-order-answer");
    answer.setAttribute("aria-live", "polite");
    answer.append(text(grammarTokens.length > 0 ? grammarTokens.join(" ") : "Choose tokens in order.", grammarTokens.length > 0 ? "" : "grammar-order-placeholder"));
    const choices = document.createElement("div"); choices.className = "grammar-choices grammar-token-choices";
    for (const token of exercise.tokens) {
      const selected = grammarTokens.includes(token);
      const action = button(token, `button grammar-token${selected ? " is-selected" : ""}`);
      action.setAttribute("aria-pressed", String(selected)); action.disabled = grammarChecked || pending;
      action.addEventListener("click", () => {
        const index = grammarTokens.indexOf(token);
        grammarTokens = index < 0 ? [...grammarTokens, token] : grammarTokens.filter((_candidate, candidateIndex) => candidateIndex !== index);
        grammarAnswer = grammarTokens.length > 0 ? grammarTokens.join(" ") : null;
        grammarFeedback = null; render();
      });
      choices.append(action);
    }
    wrapper.append(answer, choices);
    return wrapper;
  }
  const choices = document.createElement("div"); choices.className = "grammar-choices";
  for (const choice of exercise.choices) {
    const action = button(choice, `button${grammarAnswer === choice ? " is-selected" : ""}`);
    action.setAttribute("aria-pressed", String(grammarAnswer === choice)); action.disabled = grammarChecked || pending;
    action.addEventListener("click", () => { grammarTokens = []; grammarAnswer = choice; grammarFeedback = null; render(); }); choices.append(action);
  }
  return choices;
}

function renderContrastNotice(session: LessonSession, packId: ContrastPackId): HTMLElement {
  const exercise = contrastPack.exercises[contrastExerciseIndex];
  const panel = section("lesson-story grammar-practice contrast-practice");
  panel.append(eyebrow(`Notice · ${contrastExerciseIndex === 0 ? "See the contrast" : "Repair the contrast"}`), heading(contrastPack.title), text(contrastPack.explanation), text(contrastPack.meaningNote, "grammar-capability"));
  const comparison = section("contrast-comparison");
  for (const item of contrastPack.comparison.items) comparison.append(text(`${item.valid ? "✓" : "✗"} ${item.label}: ${item.sentenceNl}`, item.valid ? "contrast-valid" : "contrast-incorrect"));
  panel.append(comparison, heading(exercise.prompt), text(exercise.context, "story-dutch"), renderGrammarAnswerControls(exercise));
  if (grammarFeedback) { const status = text(grammarFeedback.message, "grammar-feedback"); status.setAttribute("role", "status"); panel.append(status); }
  if (contrastOffer) {
    const offer = section("contrast-repair-offer");
    offer.append(eyebrow("Optional repair"), text("You can practise the exact contrast now.", "contrast-offer-copy"));
    const offerActions = document.createElement("div"); offerActions.className = "grammar-actions";
    const accept = button(contrastOffer.label, "button primary-button"); accept.disabled = pending; accept.addEventListener("click", acceptContrastRepair);
    const dismiss = button("Continue", "button"); dismiss.disabled = pending; dismiss.addEventListener("click", dismissContrastRepairOffer);
    offerActions.append(accept, dismiss); offer.append(offerActions); panel.append(offer);
  }
  if (grammarChecked) {
    if (grammarOutcome === null) { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", retryContrastAnswer); panel.append(retry); }
    const label = contrastExerciseIndex < contrastPack.exercises.length - 1 ? "Continue to next contrast" : "Continue to Practise";
    const continueButton = button(label, "button primary-button"); continueButton.disabled = pending; continueButton.addEventListener("click", () => void advanceContrastExercise(session)); panel.append(continueButton);
  } else {
    const actions = document.createElement("div"); actions.className = "grammar-actions";
    const reveal = button("Reveal", "button answer-button"); reveal.disabled = pending; reveal.addEventListener("click", () => void showContrastOutcome(packId, exercise.id, "reveal"));
    const skip = button("Skip", "button"); skip.disabled = pending; skip.addEventListener("click", () => void showContrastOutcome(packId, exercise.id, "skip")); actions.append(reveal, skip); panel.append(actions);
    const check = button("Check answer", "button primary-button"); check.disabled = grammarAnswer === null || pending; check.addEventListener("click", () => void checkContrastAnswer(packId, exercise.id)); panel.append(check);
  }
  return panel;
}

function renderGrammarNotice(session: LessonSession, patternId: GrammarPatternId): HTMLElement {
  const pattern = getGrammarPattern(patternId)!;
  const exercise = pattern.exercises[0];
  const panel = section("lesson-story grammar-practice");
  panel.append(eyebrow("Notice · Choose the form"), heading(session.lesson.pattern), text("Notice how the form changes with the subject."), text(exercise.context, "story-dutch"));
  panel.append(renderGrammarAnswerControls(exercise));
  if (grammarFeedback) { const status = text(grammarFeedback.message, "grammar-feedback"); status.setAttribute("role", "status"); panel.append(status); }
  if (grammarChecked && grammarOutcome === null && grammarRecords[patternId]?.state === "applied") panel.append(text("Applied · this pattern is ready to use in the wild.", "grammar-celebration"));
  if (grammarChecked) {
    if (grammarOutcome === null) { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", retryGrammarAnswer); panel.append(retry); }
    const continueButton = button("Continue to Practise", "button primary-button"); continueButton.disabled = pending; continueButton.addEventListener("click", () => void advanceLesson(session)); panel.append(continueButton);
  } else {
    const actions = document.createElement("div"); actions.className = "grammar-actions";
    const reveal = button("Reveal", "button answer-button"); reveal.disabled = pending; reveal.addEventListener("click", () => showGrammarOutcome(patternId, exercise.id, "reveal"));
    const skip = button("Skip", "button"); skip.disabled = pending; skip.addEventListener("click", () => showGrammarOutcome(patternId, exercise.id, "skip"));
    actions.append(reveal, skip); panel.append(actions);
    const check = button("Check answer", "button primary-button"); check.disabled = grammarAnswer === null || pending; check.addEventListener("click", () => void checkGrammarAnswer(patternId, exercise.id)); panel.append(check);
  }
  return panel;
}
async function showGrammarOutcome(patternId: GrammarPatternId, exerciseId: string, outcome: "reveal" | "skip"): Promise<void> {
  const pattern = getGrammarPattern(patternId); const exercise = pattern?.exercises.find((candidate) => candidate.id === exerciseId); if (!exercise) return;
  grammarOutcome = outcome; grammarRetrying = false; grammarChecked = true; grammarTokens = []; grammarAnswer = outcome === "reveal" ? exercise.accepted.join(" / ") : null;
  grammarFeedback = { correct: false, message: outcome === "reveal" ? `Answer: ${exercise.accepted.join(" or ")}. ${exercise.feedback}` : "Skipped. You can practise this pattern again later." };
  let record = grammarRecords[patternId] ?? (grammarPatternId === patternId ? grammarRecord : null);
  pending = true; render();
  try {
    if (!record) { record = await learningClient.introduceGrammar(patternId); grammarRecord = record; grammarRecords = { ...grammarRecords, [patternId]: record }; }
    const saved = await learningClient.recordGrammarResult(patternId, 1, exerciseId, null, record.evidenceRevision, outcome);
    grammarRecord = saved; grammarRecords = { ...grammarRecords, [patternId]: saved };
  } catch (error) {
    grammarOutcome = null; grammarChecked = false; grammarAnswer = null;
    grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Grammar result could not be saved." };
  } finally { pending = false; render(); }
}
async function checkGrammarAnswer(patternId: GrammarPatternId, exerciseId: string, dailyFive = false): Promise<void> {
  let record = grammarRecords[patternId] ?? (grammarPatternId === patternId ? grammarRecord : null); const pattern = getGrammarPattern(patternId);
  if (!pattern || grammarAnswer === null || grammarChecked) return;
  pending = true; render();
  try {
    if (!record) { record = await learningClient.introduceGrammar(patternId); grammarRecord = record; grammarRecords = { ...grammarRecords, [patternId]: record }; }
    const exercise = pattern.exercises.find((candidate) => candidate.id === exerciseId)!; const result = grammarResultMessage(record, exercise, grammarAnswer); grammarFeedback = { correct: result.correct, message: result.feedback };
    if (!grammarRetrying) {
      if (dailyFive) { const saved = await learningClient.recordGrammarDailyFiveResult(patternId, 1, exerciseId, grammarAnswer, record.evidenceRevision); snapshot = saved.snapshot; grammarRecord = saved.grammar; grammarRecords = { ...grammarRecords, [patternId]: saved.grammar }; }
      else { const saved = await learningClient.recordGrammarResult(patternId, 1, exerciseId, grammarAnswer, record.evidenceRevision); grammarRecord = saved; grammarRecords = { ...grammarRecords, [patternId]: saved }; }
    }
    grammarOutcome = null; grammarChecked = true;
  } catch (error) { grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Grammar result could not be saved." }; }
  finally { pending = false; render(); }
}
function retryGrammarAnswer(): void { grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarOutcome = null; grammarRetrying = true; grammarChecked = false; render(); }
function retryContrastAnswer(): void { contrastOffer = null; retryGrammarAnswer(); }
function dismissContrastRepairOffer(): void { contrastOffer = null; render(); }
function acceptContrastRepair(): void { contrastOffer = null; contrastExerciseIndex = 0; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarOutcome = null; grammarRetrying = false; grammarChecked = false; render(); content?.focus(); }
async function showContrastOutcome(packId: ContrastPackId, exerciseId: string, outcome: "reveal" | "skip"): Promise<void> {
  const exercise = contrastPack.exercises.find((candidate) => candidate.id === exerciseId); if (!exercise) return;
  grammarOutcome = outcome; grammarRetrying = false; grammarChecked = true; grammarTokens = []; grammarAnswer = outcome === "reveal" ? exercise.accepted.join(" / ") : null;
  grammarFeedback = { correct: false, message: outcome === "reveal" ? `Answer: ${exercise.accepted.join(" or ")}. ${exercise.feedback}` : "Skipped. You can practise this contrast again later." };
  pending = true; render();
  try {
    const record = contrastRecord ?? await learningClient.introduceContrast(packId);
    contrastRecord = (await learningClient.recordContrastResult(packId, 1, exerciseId, null, record.evidenceRevision, outcome)).contrast;
  } catch (error) {
    grammarOutcome = null; grammarChecked = false; grammarAnswer = null;
    grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Contrast result could not be saved." };
  } finally { pending = false; render(); }
}

async function checkContrastAnswer(packId: ContrastPackId, exerciseId: string): Promise<void> {
  if (grammarAnswer === null || grammarChecked) return;
  const exercise = contrastPack.exercises.find((candidate) => candidate.id === exerciseId); if (!exercise) return;
  pending = true; render();
  try {
    const record = contrastRecord ?? await learningClient.introduceContrast(packId);
    const result = contrastResultMessage(record, exercise, grammarAnswer);
    grammarFeedback = { correct: result.correct, message: result.feedback };
    if (!grammarRetrying) {
      const saved = await learningClient.recordContrastResult(packId, 1, exerciseId, grammarAnswer, record.evidenceRevision, undefined, result.misconception);
      contrastRecord = saved.contrast;
      contrastOffer = saved.repairOffer;
    }
    grammarOutcome = null; grammarChecked = true;
  } catch (error) { grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Contrast result could not be saved." }; }
  finally { pending = false; render(); }
}

async function advanceContrastExercise(session: LessonSession): Promise<void> {
  if (contrastExerciseIndex >= contrastPack.exercises.length - 1) { await advanceLesson(session); return; }
  contrastOffer = null; contrastExerciseIndex += 1; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; render(); content?.focus();
}

async function persistGrammarDailyFiveOutcome(patternId: GrammarPatternId, exerciseId: string, outcome: "reveal" | "skip"): Promise<void> {
  const record = grammarRecords[patternId]; const exercise = getGrammarPattern(patternId)?.exercises.find((candidate) => candidate.id === exerciseId); if (!record || !exercise || pending) return;
  grammarFeedback = { correct: false, message: outcome === "reveal" ? `Answer: ${exercise.accepted.join(" or ")}. ${exercise.feedback}` : "Skipped. You can practise this pattern again later." };
  grammarOutcome = outcome; grammarChecked = true; pending = true; render();
  try { const saved = await learningClient.recordGrammarDailyFiveResult(patternId, 1, exerciseId, null, record.evidenceRevision, outcome); snapshot = saved.snapshot; grammarRecord = saved.grammar; grammarRecords = { ...grammarRecords, [patternId]: saved.grammar }; }
  catch (error) { grammarChecked = false; grammarOutcome = null; grammarRetrying = false; grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Grammar result could not be saved." }; }
  finally { pending = false; render(); }
}
function renderLessonPractice(session: LessonSession): HTMLElement { const prompt = session.lesson.practice[session.practiceIndex]; const candidate = session.lesson.candidates.find((item) => item.id === prompt.candidateId)!; const panel = section("practice-card"); panel.append(eyebrow(session.practiceRevealed ? "Answer" : prompt.dimension === "recognition" ? "Read in Dutch" : "Say it in Dutch"), heading(session.practiceRevealed ? candidate.dutch : prompt.dimension === "recognition" ? candidate.dutch : candidate.english)); if (!session.practiceRevealed) { const reveal = button("Show answer", "button answer-button"); reveal.addEventListener("click", () => { lessonSession = revealLessonPractice(session); render(); }); panel.append(reveal, phoneticHint()); } else { panel.append(meaning("Dutch", candidate.dutch), meaning("English", candidate.english), teluguMeaning(candidate.telugu)); const actions = document.createElement("div"); actions.className = "rating-actions"; for (const result of ["again", "got-it"] as const) { const action = button(result === "again" ? "Again" : "Got it", "button"); action.addEventListener("click", () => void saveLessonPractice(session, result)); actions.append(action); } panel.append(actions); } return panel; }
function renderLessonKeep(session: LessonSession): HTMLElement { const panel = section("lesson-story"); panel.append(eyebrow("Keep"), heading("Choose what to keep for review.")); for (const candidate of getLessonCandidateChoices(session, items)) { const label = document.createElement("label"); label.className = "candidate-choice"; const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = candidate.checked; checkbox.addEventListener("change", () => { lessonSession = toggleLessonCandidate(session, candidate.id); render(); }); label.append(checkbox, text(candidate.dutch)); if (candidate.alreadySaved) label.append(text("Already saved", "already-saved")); panel.append(label); } const keep = button(`Keep ${session.selectedCandidateIds.length} for review`, "button primary-button"); keep.disabled = pending; keep.addEventListener("click", () => void keepLessonCandidates(session)); panel.append(keep); return panel; }
async function startLesson(lesson: Lesson): Promise<void> { const origin = screen === "today" ? "today" : screen === "saved" ? "saved" : "lessons"; try { let lessonProgress = await learningClient.getLessonProgress(lesson.id); if (!lessonProgress) lessonProgress = await learningClient.saveLessonProgress(lesson.id, "read"); grammarRecord = null; grammarPatternId = lesson.grammarCompanion?.patternId ?? null; contrastRecord = null; contrastExerciseIndex = 0; contrastOffer = null; activeGrammarTask = null; activeContrastTask = null; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; lessonProgressById = { ...lessonProgressById, [lesson.id]: lessonProgress }; lessonSession = resumeLessonSession(lesson, lessonProgress); focusedOrigin = origin; screen = "lesson"; render(); content?.focus(); } catch (error) { lessonsError = error instanceof Error ? error.message : "This lesson is unavailable."; focusedOrigin = null; screen = origin === "today" ? "today" : "lessons"; render(); } }
async function advanceLesson(session: LessonSession): Promise<void> { const next = session.stage === "replay" && session.lesson.practiceEnvelope ? advanceLessonTransfer(session) : advanceLessonStage(session); if (next === session) return; pending = true; render(); try { const lessonProgress = await learningClient.saveLessonProgress(next.lesson.id, next.stage); lessonProgressById = { ...lessonProgressById, [next.lesson.id]: lessonProgress }; lessonSession = next; } catch (error) { renderError(error instanceof Error ? error.message : "Lesson progress could not be saved."); } finally { pending = false; render(); } }
async function advanceLessonAuthoredExercise(session: LessonSession): Promise<void> { const next = advanceLessonPracticeExercise(session); if (next === session) return; if (next.stage === "practise") { lessonSession = next; render(); return; } pending = true; render(); try { const lessonProgress = await learningClient.saveLessonProgress(next.lesson.id, next.stage); lessonProgressById = { ...lessonProgressById, [next.lesson.id]: lessonProgress }; lessonSession = next; } catch (error) { renderError(error instanceof Error ? error.message : "Lesson progress could not be saved."); } finally { pending = false; render(); } }
async function saveLessonPractice(session: LessonSession, result: "again" | "got-it"): Promise<void> { const next = advanceLessonPracticeState(session, result); if (next.stage !== "replay") { lessonSession = next; render(); return; } pending = true; render(); try { const lessonProgress = await learningClient.saveLessonProgress(next.lesson.id, next.stage); lessonProgressById = { ...lessonProgressById, [next.lesson.id]: lessonProgress }; lessonSession = next; } catch (error) { renderError(error instanceof Error ? error.message : "Lesson progress could not be saved."); } finally { pending = false; render(); } }
async function keepLessonCandidates(session: LessonSession): Promise<void> { pending = true; render(); try { const evidence = session.practiceEvidence.filter((entry) => session.selectedCandidateIds.includes(entry.candidateId)); const kept = await learningClient.keepLessonCandidates(session.lesson.id, session.selectedCandidateIds, evidence); items = [...items.filter((item) => !kept.some((saved) => saved.id === item.id)), ...kept]; rhythm = await learningClient.getRhythm(); const lessonProgress = await learningClient.getLessonProgress(session.lesson.id); lessonProgressById = { ...lessonProgressById, [session.lesson.id]: lessonProgress }; lessonSession = null; screen = focusedOrigin ?? "lessons"; focusedOrigin = null; render(); } catch (error) { renderError(error instanceof Error ? error.message : "Your lesson choices could not be saved."); } finally { pending = false; } }

function renderContrastDailyFiveReview(task: ContrastDailyFiveTask): HTMLElement {
  const exercise = contrastPack.exercises.find((candidate) => candidate.id === task.exerciseId);
  const record = contrastRecord;
  const wrapper = section("practice-content focused-content");
  if (!exercise || !record) { wrapper.append(button("Exit review", "exit-button"), heading("Contrast practice is unavailable.")); return wrapper; }
  const exit = button("Exit review", "exit-button"); exit.addEventListener("click", () => { screen = focusedOrigin ?? "today"; focusedOrigin = null; render(); });
  wrapper.append(exit, eyebrow("Daily Five · Contrast repair"), heading(exercise.prompt), text(contrastPack.title, "grammar-capability"), text(exercise.context, "story-dutch"), renderGrammarAnswerControls(exercise));
  if (grammarFeedback) { const status = text(grammarFeedback.message, "grammar-feedback"); status.setAttribute("role", "status"); wrapper.append(status); }
  if (!grammarChecked) {
    const actions = document.createElement("div"); actions.className = "grammar-actions";
    const reveal = button("Reveal", "button answer-button"); reveal.disabled = pending; reveal.addEventListener("click", () => void persistContrastDailyFiveOutcome(task, "reveal"));
    const skip = button("Skip", "button"); skip.disabled = pending; skip.addEventListener("click", () => void persistContrastDailyFiveOutcome(task, "skip")); actions.append(reveal, skip); wrapper.append(actions);
  }
  if (grammarChecked && grammarOutcome === null) { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", retryContrastAnswer); wrapper.append(retry); }
  const check = button(grammarChecked ? "Continue" : "Check answer", "button primary-button"); check.disabled = !grammarChecked && (grammarAnswer === null || pending); check.addEventListener("click", () => { if (grammarChecked) continueContrastDailyFiveReview(); else void checkContrastDailyFiveAnswer(task); }); wrapper.append(check);
  return wrapper;
}

async function persistContrastDailyFiveOutcome(task: ContrastDailyFiveTask, outcome: "reveal" | "skip"): Promise<void> {
  const record = contrastRecord; const exercise = contrastPack.exercises.find((candidate) => candidate.id === task.exerciseId); if (!record || !exercise || pending) return;
  grammarFeedback = { correct: false, message: outcome === "reveal" ? `Answer: ${exercise.accepted.join(" or ")}. ${exercise.feedback}` : "Skipped. You can practise this contrast again later." };
  grammarOutcome = outcome; grammarChecked = true; pending = true; render();
  try { const saved = await learningClient.recordContrastDailyFiveResult(task.packId, 1, task.exerciseId, null, record.evidenceRevision, outcome); contrastRecord = saved.contrast; snapshot = saved.snapshot; }
  catch (error) { grammarChecked = false; grammarOutcome = null; grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Contrast result could not be saved." }; }
  finally { pending = false; render(); }
}

async function checkContrastDailyFiveAnswer(task: ContrastDailyFiveTask): Promise<void> {
  if (grammarAnswer === null || grammarChecked || !contrastRecord) return;
  const exercise = contrastPack.exercises.find((candidate) => candidate.id === task.exerciseId); if (!exercise) return;
  pending = true; render();
  try {
    const result = contrastResultMessage(contrastRecord, exercise, grammarAnswer); grammarFeedback = { correct: result.correct, message: result.feedback };
    if (!grammarRetrying) { const saved = await learningClient.recordContrastDailyFiveResult(task.packId, 1, task.exerciseId, grammarAnswer, contrastRecord.evidenceRevision); contrastRecord = saved.contrast; snapshot = saved.snapshot; }
    grammarOutcome = null; grammarChecked = true;
  } catch (error) { grammarFeedback = { correct: false, message: error instanceof Error ? error.message : "Contrast result could not be saved." }; }
  finally { pending = false; render(); }
}

function continueContrastDailyFiveReview(): void {
  const completed = activeContrastTask && snapshot?.completedTaskIds.includes(`${activeContrastTask.packId}\u001f${activeContrastTask.exerciseId}`);
  if (!snapshot || snapshot.goalCompleted || !completed) { activeContrastTask = null; screen = focusedOrigin ?? "today"; focusedOrigin = null; render(); return; }
  activeContrastTask = null; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; render();
}

function renderGrammarReview(task: GrammarDailyFiveTask): HTMLElement {
  const pattern = getGrammarPattern(task.patternId);
  const exercise = pattern?.exercises.find((candidate) => candidate.id === task.exerciseId);
  const record = grammarRecords[task.patternId] ?? null;
  grammarPatternId = task.patternId;
  grammarRecord = record;
  const wrapper = section("practice-content focused-content");
  if (!pattern || !exercise || !record) { wrapper.append(button("Exit review", "exit-button"), heading("Grammar practice is unavailable.")); return wrapper; }
  const exit = button("Exit review", "exit-button"); exit.addEventListener("click", () => { screen = focusedOrigin ?? "today"; focusedOrigin = null; render(); });
  wrapper.append(exit, eyebrow("Daily Five · Grammar"), heading(exercise.prompt), text(pattern.capability, "grammar-capability"), text(exercise.context, "story-dutch"));
  wrapper.append(renderGrammarAnswerControls(exercise));
  if (grammarFeedback) { const status = text(grammarFeedback.message, "grammar-feedback"); status.setAttribute("role", "status"); wrapper.append(status); }
  if (grammarChecked && grammarOutcome === null && grammarRecords[task.patternId]?.state === "applied") wrapper.append(text("Applied · this pattern is ready to use in the wild.", "grammar-celebration"));
  if (!grammarChecked) {
    const actions = document.createElement("div"); actions.className = "grammar-actions";
    const reveal = button("Reveal", "button answer-button"); reveal.disabled = pending; reveal.addEventListener("click", () => void persistGrammarDailyFiveOutcome(task.patternId, exercise.id, "reveal"));
    const skip = button("Skip", "button"); skip.disabled = pending; skip.addEventListener("click", () => void persistGrammarDailyFiveOutcome(task.patternId, exercise.id, "skip")); actions.append(reveal, skip); wrapper.append(actions);
  }
  if (grammarChecked && grammarOutcome === null) { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", retryGrammarAnswer); wrapper.append(retry); }
  const check = button(grammarChecked ? "Continue" : "Check answer", "button primary-button"); check.disabled = !grammarChecked && (grammarAnswer === null || pending); check.addEventListener("click", () => { if (grammarChecked) continueGrammarReview(); else void checkGrammarAnswer(task.patternId, exercise.id, true); }); wrapper.append(check);
  return wrapper;
}

function continueGrammarReview(): void {
  const completed = activeGrammarTask && snapshot?.completedTaskIds.includes(`${activeGrammarTask.patternId}\u001f${activeGrammarTask.exerciseId}`);
  if (!snapshot || snapshot.goalCompleted || !completed) { activeGrammarTask = null; screen = focusedOrigin ?? "today"; focusedOrigin = null; render(); return; }
  activeGrammarTask = null; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; render();
}

function renderReview(): HTMLElement {
  const wrapper = section("practice-content focused-content");
  const reviewView = snapshot ? getDailyFiveReviewView(snapshot, revealed) : null;
  const task = reviewView?.task;
  if (activeGrammarTask) return renderGrammarReview(activeGrammarTask);
  if (activeContrastTask) return renderContrastDailyFiveReview(activeContrastTask);
  if (task && "kind" in task) { if (task.kind === "contrast") { activeContrastTask = task; return renderContrastDailyFiveReview(task); } activeGrammarTask = task; return renderGrammarReview(task); }
  const item = task ? items.find((candidate) => candidate.id === task.itemId) : undefined;
  if (!snapshot || !task || !item) { screen = focusedOrigin ?? "today"; focusedOrigin = null; return screen === "today" ? renderToday() : renderLessons(); }
  const exit = button("Exit review", "exit-button");
  exit.addEventListener("click", () => { screen = focusedOrigin ?? "today"; focusedOrigin = null; revealed = false; render(); });
  const progress = text(`${task.dimension === "recognition" ? "Recognition" : "Recall"} · ${snapshot.completedTaskIds.length + 1} of ${snapshot.tasks.length}`, "practice-progress");
  const card = section("practice-card");
  const prompt = task.dimension === "recognition" ? item.dutch : item.english ?? item.contexts.at(-1)?.text ?? "Use the context cue";
  card.append(eyebrow(revealed ? "Answer" : task.dimension === "recognition" ? "Read in Dutch" : "Say it in Dutch"), heading(revealed ? item.dutch : prompt));
  if (reviewView?.canSubmitResult) {
    card.append(meaning("Dutch", item.dutch), meaning("English", item.english), teluguMeaning(item.telugu), contextMeaning(item.contexts));
    const actions = document.createElement("div"); actions.className = "rating-actions";
    for (const result of ["again", "got-it"] as const) { const action = button(result === "again" ? "Again" : "Got it", "button"); action.disabled = pending; action.addEventListener("click", () => void saveResult(item, task.dimension, result)); actions.append(action); }
    card.append(actions);
  } else {
    const reveal = button("Show answer", "button answer-button"); reveal.addEventListener("click", () => { revealed = true; render(); content?.querySelector<HTMLButtonElement>(".rating-actions .button")?.focus(); }); card.append(reveal, phoneticHint());
  }
  wrapper.append(exit, progress, card, localNote());
  return wrapper;
}

function renderSavedQuiz(): HTMLElement {
  const wrapper = section("practice-content focused-content saved-quiz-content");
  const session = savedQuizSession;
  const task = session ? getSavedQuizTask(session) : null;
  const item = task ? items.find((candidate) => candidate.id === task.itemId) : undefined;
  if (!session || !task || !item) { screen = "saved"; savedQuizSession = null; focusedOrigin = null; return renderSaved(); }
  const exit = button("Exit Quiz Saved", "exit-button");
  exit.addEventListener("click", exitSavedQuiz);
  const progress = text(`Saved quiz · ${session.taskIndex + 1} of ${session.tasks.length}`, "practice-progress");
  const card = section("practice-card");
  const prompt = task.dimension === "recognition" ? item.dutch : item.english ?? item.contexts.at(-1)?.text ?? "Use the context cue";
  card.append(eyebrow(session.revealed ? "Answer" : task.dimension === "recognition" ? "Read in Dutch" : "Say it in Dutch"), heading(session.revealed ? item.dutch : prompt));
  if (savedQuizError) {
    const error = text(savedQuizError, "saved-quiz-error");
    error.setAttribute("role", "alert");
    const retry = button("Try again", "button primary-button");
    retry.disabled = pending;
    retry.addEventListener("click", () => void saveSavedQuizResult(item, task, savedQuizRetry ?? "got-it"));
    card.append(error, retry);
  } else if (session.revealed) {
    card.append(meaning("Dutch", item.dutch), meaning("English", item.english), teluguMeaning(item.telugu), contextMeaning(item.contexts));
    const actions = document.createElement("div");
    actions.className = "rating-actions";
    for (const result of ["again", "got-it"] as const) { const action = button(result === "again" ? "Again" : "Got it", "button"); action.disabled = pending; action.addEventListener("click", () => void saveSavedQuizResult(item, task, result)); actions.append(action); }
    card.append(actions);
  } else {
    const reveal = button("Show answer", "button answer-button");
    reveal.addEventListener("click", () => { savedQuizSession = revealSavedQuiz(session); render(); content?.querySelector<HTMLButtonElement>(".rating-actions .button")?.focus(); });
    card.append(reveal, phoneticHint());
  }
  wrapper.append(exit, progress, card, localNote());
  return wrapper;
}

function renderSavedContextMission(): HTMLElement {
  const wrapper = section("practice-content focused-content saved-context-mission-content");
  const mission = savedContextMission;
  const item = mission ? items.find((candidate) => candidate.id === mission.itemId) : undefined;
  if (!mission || !item) { screen = "saved"; savedContextMission = null; focusedOrigin = null; return renderSaved(); }
  const exit = button("Exit Context Mission", "exit-button");
  exit.addEventListener("click", exitSavedContextMission);
  const card = section("practice-card");
  card.append(eyebrow("Context Mission"), heading("What does this mean here?"), text("Recall the saved meaning before you reveal it.", "saved-context-mission-copy"));
  const context = section("saved-context-mission-context");
  context.append(text("Original context · Dutch", "saved-context-label"), mission.reconstruction ? maskedSavedContext(mission.context.text, mission.reconstruction.targetTokenIndex) : highlightedSavedContext(mission.context.text, item.dutch));
  card.append(context);
  if (savedContextMissionError) {
    const error = text(savedContextMissionError, "saved-context-mission-error");
    error.setAttribute("role", "alert");
    const retry = button("Try again", "button primary-button");
    retry.disabled = pending;
    retry.addEventListener("click", () => void saveSavedContextMissionResult(item, mission, savedContextMissionRetry ?? "got-it"));
    card.append(error, retry);
  } else if (mission.reconstruction) {
    card.append(text("Rebuild the saved Dutch sentence in its original order.", "saved-context-mission-copy"));
    const placed = section("saved-context-token-bank");
    placed.setAttribute("aria-label", "Your answer");
    placed.append(text("Your answer", "saved-context-token-label"));
    for (const tokenIndex of mission.placedTokenIndexes) {
      const token = button(mission.reconstruction.tokens[tokenIndex], "button saved-context-token");
      token.setAttribute("aria-label", `Remove ${mission.reconstruction.tokens[tokenIndex]}`);
      token.disabled = pending;
      token.addEventListener("click", () => { savedContextMission = removeSavedContextToken(mission, tokenIndex); render(); });
      placed.append(token);
    }
    const available = section("saved-context-token-bank");
    available.setAttribute("aria-label", "Available words");
    available.append(text("Available words", "saved-context-token-label"));
    for (const tokenIndex of getSavedContextTokenOrder(mission.reconstruction).filter((index) => !mission.placedTokenIndexes.includes(index))) {
      const token = button(mission.reconstruction.tokens[tokenIndex], "button saved-context-token");
      token.disabled = pending;
      token.addEventListener("click", () => { savedContextMission = addSavedContextToken(mission, tokenIndex); render(); });
      available.append(token);
    }
    const actions = document.createElement("div");
    actions.className = "rating-actions";
    const reset = button("Reset", "button");
    reset.disabled = pending || mission.placedTokenIndexes.length === 0;
    reset.addEventListener("click", () => { savedContextMission = resetSavedContextTokens(mission); render(); });
    const check = button("Check", "button primary-button");
    check.disabled = pending || mission.placedTokenIndexes.length !== mission.reconstruction.tokens.length;
    check.addEventListener("click", () => { const result = checkSavedContextMission(mission); if (result) void saveSavedContextMissionResult(item, mission, result); });
    actions.append(reset, check);
    card.append(placed, available, actions);
  } else if (mission.revealed) {
    const english = item.english ?? mission.context.english ?? null;
    const telugu = item.telugu ?? mission.context.telugu ?? null;
    card.append(meaning("Dutch", item.dutch), meaning("English", english), teluguMeaning(telugu));
    if (english || telugu) {
      const actions = document.createElement("div");
      actions.className = "rating-actions";
      for (const result of ["again", "got-it"] as const) {
        const action = button(result === "again" ? "Again" : "Got it", "button");
        action.disabled = pending;
        action.addEventListener("click", () => void saveSavedContextMissionResult(item, mission, result));
        actions.append(action);
      }
      card.append(actions);
    } else {
      card.append(text("No saved helper meaning is available for this context.", "saved-context-mission-copy"));
    }
  } else {
    const reveal = button("Reveal", "button answer-button");
    reveal.disabled = pending;
    reveal.addEventListener("click", () => { savedContextMission = revealSavedContextMission(mission); render(); content?.querySelector<HTMLButtonElement>(".rating-actions .button")?.focus(); });
    card.append(reveal, phoneticHint());
  }
  wrapper.append(exit, card, localNote());
  return wrapper;
}

function renderSettings(): HTMLElement {
  const wrapper = section("settings-content");
  wrapper.append(eyebrow("Settings"), heading("Review preferences"), toggle("Show page context", settings.showExampleSentence, (checked) => void saveSettings({ showExampleSentence: checked })), toggle("Daily review badge", settings.dailyReviewBadge, (checked) => void saveSettings({ dailyReviewBadge: checked })), text("Other extension settings are available in Options.", "local-note"));
  const options = button("Open Options page", "button"); options.addEventListener("click", () => void browser.runtime.openOptionsPage()); wrapper.append(options); return wrapper;
}

function maskedSavedContext(context: string, targetTokenIndex: number): HTMLElement {
  const paragraph = document.createElement("p");
  paragraph.className = "saved-context";
  paragraph.textContent = context.trim().replace(/\s+/gu, " ").split(" ").map((token, index) => index === targetTokenIndex ? "__________" : token).join(" ");
  return paragraph;
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

function startSavedQuiz(): void { if (items.length === 0) return; savedQuizError = null; savedQuizRetry = null; savedQuizSession = createSavedQuizSession(items); focusedOrigin = "saved"; screen = "savedQuiz"; render(); content?.focus(); }
function exitSavedQuiz(): void { savedQuizSession = null; savedQuizError = null; savedQuizRetry = null; focusedOrigin = null; screen = "saved"; render(); }
async function saveSavedQuizResult(item: LearningItem, task: NonNullable<ReturnType<typeof getSavedQuizTask>>, result: "again" | "got-it"): Promise<void> {
  if (pending || !savedQuizSession) return;
  savedQuizError = null;
  savedQuizRetry = result;
  pending = true;
  render();
  try {
    const updated = await learningClient.recordMissionResult(item.id, task.dimension, result, task.expectedAttemptCount);
    items = items.map((candidate) => candidate.id === updated.id ? updated : candidate);
    try { rhythm = await learningClient.getRhythm(); } catch { /* The canonical result is already recorded; keep the current rhythm view. */ }
    const next = advanceSavedQuiz(savedQuizSession);
    savedQuizSession = next.taskIndex >= next.tasks.length ? null : next;
    savedQuizError = null;
    savedQuizRetry = null;
    if (!savedQuizSession) { savedFeedback = { tone: "success", message: "Quiz Saved complete. Your review activity was recorded." }; focusedOrigin = null; screen = "saved"; }
  } catch (error) {
    savedQuizError = error instanceof Error ? error.message : "Your Quiz Saved result could not be saved.";
  } finally { pending = false; render(); }
}

function startSavedContextMission(itemId: string): void {
  const item = items.find((candidate) => candidate.id === itemId);
  const mission = item ? createSavedContextMission(item) : null;
  if (!mission) return;
  savedContextMission = mission;
  savedContextMissionError = null;
  savedContextMissionRetry = null;
  focusedOrigin = "saved";
  screen = "savedContextMission";
  render();
  content?.focus();
}

function exitSavedContextMission(): void {
  savedContextMission = null;
  savedContextMissionError = null;
  savedContextMissionRetry = null;
  focusedOrigin = null;
  screen = "saved";
  render();
}

async function saveSavedContextMissionResult(item: LearningItem, mission: SavedContextMission, result: "again" | "got-it"): Promise<void> {
  if (pending || !savedContextMission) return;
  savedContextMissionError = null;
  savedContextMissionRetry = result;
  pending = true;
  render();
  try {
    const updated = await learningClient.recordMissionResult(item.id, mission.dimension, result, mission.expectedAttemptCount);
    items = items.map((candidate) => candidate.id === updated.id ? updated : candidate);
    savedContextMission = null;
    savedContextMissionError = null;
    savedContextMissionRetry = null;
    savedFeedback = { tone: "success", message: "Context practice recorded." };
    focusedOrigin = null;
    screen = "saved";
  } catch (error) {
    savedContextMissionError = error instanceof Error ? error.message : "Context practice could not be saved.";
  } finally {
    pending = false;
    render();
  }
}

async function startContinuation(): Promise<void> { pending = true; render(); await load(true); pending = false; if (snapshot?.tasks.length) { focusedOrigin = "today"; screen = "review"; revealed = false; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; render(); content?.focus(); } }
async function saveSettings(changes: Partial<ReviewSettingsChanges>): Promise<void> { settings = await settingsClient.updateSettings(changes); render(); }

function createMasterySummary(): HTMLElement {
  const states = ["new", "learning", "familiar", "strong"] as const;
  const summary = section("mastery");
  for (const label of ["Recognition", "Recall"] as const) { const key = label.toLowerCase() as "recognition" | "recall"; const count = items.filter((item) => item[key].state !== "new").length; const state = [...states].reverse().find((candidate) => items.some((item) => item[key].state === candidate)) ?? "new"; const block = document.createElement("div"); block.append(text(`${label} · ${state}`, "section-title"), text(`${count} item${count === 1 ? "" : "s"} practised`, "body-copy")); summary.append(block); }
  return summary;
}
function updateBadge(): void {
  if (!dueBadge) return;
  const due = settings.dailyReviewBadge ? items.filter((item) => [item.recognition, item.recall].some((mastery) => mastery.attemptCount > 0 && mastery.dueAt !== null && mastery.dueAt <= Date.now())).length : 0;
  dueBadge.hidden = due === 0;
  dueBadge.textContent = due > 0 ? String(due) : "";
  if (due === 0) {
    dueBadge.removeAttribute("aria-label");
    dueBadge.removeAttribute("title");
    return;
  }
  const label = `${due} saved item${due === 1 ? "" : "s"} still ha${due === 1 ? "s" : "ve"} one or more due recognition or recall reviews. Today shows up to five at a time.`;
  dueBadge.setAttribute("aria-label", label);
  dueBadge.title = label;
}
function renderError(message: string): void { if (!content) return; content.replaceChildren(eyebrow("Today unavailable"), heading("Your practice could not load."), text(message), localNote()); }
function section(className: string): HTMLElement { const element = document.createElement("section"); element.className = className; return element; }
function button(label: string, className: string): HTMLButtonElement { const element = document.createElement("button"); element.type = "button"; element.className = className; element.textContent = label; return element; }
function eyebrow(value: string): HTMLElement { return text(value, "eyebrow"); }
function heading(value: string): HTMLElement { const element = document.createElement("h1"); element.className = "heading"; element.textContent = value; return element; }
function text(value: string, className = "body-copy"): HTMLElement { const element = document.createElement("p"); element.className = className; element.textContent = value; return element; }
function spanText(value: string, className: string): HTMLElement { const element = document.createElement("span"); element.className = className; element.textContent = value; return element; }
function helperMeaning(label: string, value: string): HTMLElement { const helper = document.createElement("span"); const name = document.createElement("b"); name.textContent = label; const meaning = document.createElement("span"); meaning.textContent = value; if (value === "unavailable") meaning.className = "meaning-unavailable"; helper.append(name, meaning); return helper; }

function helperMeaningWithPhonetics(label: string, value: string, phonetics: string | null): HTMLElement {
  const helper = helperMeaning(label, value);
  if (phonetics) {
    const guide = document.createElement("small");
    guide.className = "saved-phonetics";
    guide.textContent = `Say it: ${phonetics}`;
    helper.append(guide);
  }
  return helper;
}
function meaning(label: string, value: string | null | undefined): HTMLElement { const row = section("meaning-row"); const name = document.createElement("strong"); name.textContent = label; const content = document.createElement("span"); content.textContent = value ?? "Unavailable"; if (value == null) content.className = "meaning-unavailable"; row.append(name, content); return row; }
function teluguMeaning(value: string | null): HTMLElement { const row = meaning("Telugu", value); if (value) { const phonetics = getSimpleTeluguPhonetics(value); const helper = document.createElement("small"); helper.className = phonetics ? "telugu-phonetics" : "telugu-phonetics meaning-unavailable"; helper.textContent = phonetics ? `Say it: ${phonetics}` : "Phonetics unavailable"; row.append(helper); } return row; }
function phoneticHint(): HTMLElement { return text("Telugu phonetic guide appears after reveal when helper text is available.", "phonetic-hint"); }
function contextMeaning(contexts: LearningItem["contexts"]): HTMLElement {
  const wrapper = section("context-answers");
  for (const context of getSavedContextViews(contexts)) wrapper.append(renderContextMeaning(context));
  if (wrapper.childElementCount === 0) wrapper.append(renderContextMeaning({ text: "", originalLabel: "Original context · Language not detected", englishTranslation: null, teluguTranslation: null }));
  return wrapper;
}
function renderContextMeaning(context: SavedContextView): HTMLElement {
  const row = section("meaning-row context-answer");
  const name = document.createElement("strong"); name.textContent = context.originalLabel;
  const original = document.createElement("span"); original.textContent = context.text || "Unavailable"; if (!context.text) original.className = "meaning-unavailable";
  row.append(name, original);
  for (const [label, value] of [["English translation", context.englishTranslation], ["Telugu translation", context.teluguTranslation]] as const) {
    if (label === "English translation" && context.originalLabel === "Original context · English") continue;
    if (label === "Telugu translation" && context.originalLabel === "Original context · Telugu") continue;
    const translation = document.createElement("small"); translation.textContent = `${label}: ${value ?? "Unavailable"}`; if (!value) translation.className = "meaning-unavailable"; row.append(translation);
  }
  return row;
}
function renderSavedContext(context: SavedContextView, savedDutch: string, itemId: string, target?: LearningContext): HTMLElement {
  const card = section("saved-context-card");
  card.append(text(context.originalLabel, "saved-context-label"), highlightedSavedContext(context.text, savedDutch));
  for (const [label, value] of [["English translation", context.englishTranslation], ["Telugu translation", context.teluguTranslation]] as const) {
    if (label === "English translation" && context.originalLabel === "Original context · English") continue;
    if (label === "Telugu translation" && context.originalLabel === "Original context · Telugu") continue;
    const helper = text(`${label}: ${value ?? "Unavailable"}`, "saved-context-helper");
    if (!value) helper.classList.add("meaning-unavailable");
    card.append(helper);
  }
  if (target) {
    const remove = button("Remove context", "button secondary-button saved-context-remove");
    remove.disabled = savedActionBusy;
    remove.setAttribute("aria-label", `Remove saved context: ${context.text}`);
    remove.addEventListener("click", (event) => { event.stopPropagation(); void removeSavedContext(itemId, target); });
    card.append(remove);
  }
  return card;
}
function highlightedSavedContext(context: string, savedDutch: string): HTMLElement { const paragraph = document.createElement("p"); paragraph.className = "saved-context"; const contextLower = context.toLocaleLowerCase(); const savedLower = savedDutch.toLocaleLowerCase(); const start = contextLower.indexOf(savedLower); if (start < 0 || savedLower.length === 0) { paragraph.textContent = context; return paragraph; } paragraph.append(document.createTextNode(context.slice(0, start))); const mark = document.createElement("mark"); mark.className = "saved-context-highlight"; mark.textContent = context.slice(start, start + savedDutch.length); paragraph.append(mark, document.createTextNode(context.slice(start + savedDutch.length))); return paragraph; }
function highlightedPattern(value: string): HTMLElement { const mark = document.createElement("mark"); mark.className = "pattern-highlight"; mark.textContent = value; return mark; }
function toggle(labelText: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement { const label = document.createElement("label"); label.className = "setting-control"; const textNode = document.createElement("strong"); textNode.textContent = labelText; const input = document.createElement("input"); input.type = "checkbox"; input.checked = checked; input.addEventListener("change", () => onChange(input.checked)); label.append(textNode, input); return label; }
function localNote(): HTMLElement { return text("Local learning only. No account required.", "local-note"); }
