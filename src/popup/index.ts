import browser from "webextension-polyfill";
import { createLearningClient } from "./learning-client";
import { createSettingsClient } from "./settings-client";
import { getDailyFiveReviewView, getDailyFiveView } from "./daily-five-view";
import { getSavedContextViews, getSavedShelfView, type SavedContextView, type SavedShelfSort } from "./saved-shelf-view";
import type { SavedVerbJourneyLink } from "../verb-journeys/saved-link";
import { getPopupTabForKey } from "./tab-navigation";
import type { ContrastDailyFiveTask, DailyFiveSnapshot, GrammarDailyFiveTask, VerbJourneyDailyFiveTask } from "../vocabulary/daily-five";
import { LEARNING_RECORD_STORAGE_KEY, serializeLearningBackup, type LearningContext, type LearningItem, type LessonProgress } from "../vocabulary/learning-record";
import type { LearningRhythm } from "../vocabulary/learning-rhythm";
import { defaultSettings, type ExtensionSettings } from "../shared/settings";
import type { ReviewSettingsChanges } from "../background/messages";
import { allLessons, lessonCatalog, practicalDutchLessons, type GrammarPatternId, type Lesson } from "../lessons/catalog";
import { contentCatalog } from "../content-catalog";
import { advanceLessonPractice as advanceLessonPracticeState, advanceLessonPracticeExercise, advanceLessonStage, advanceLessonTransfer, checkLessonPracticeExercise, checkLessonTransfer, createLessonSession, filterLessons, getLessonAvailability, getLessonCandidateChoices, getLessonPracticeExercises, getLessonsAvailabilityView, resumeLessonSession, revealLessonLine, revealLessonPractice, selectLessonPracticeExerciseAnswer, selectLessonTransferAnswer, toggleLessonCandidate, toggleLessonPracticeExerciseToken, type LessonFilterLevel, type LessonFilterStatus, type LessonSession } from "./lesson-session";
import { getSimpleTeluguPhonetics } from "../vocabulary/telugu-phonetics";
import { advanceSavedQuiz, createSavedQuizSession, getSavedQuizTask, revealSavedQuiz, type SavedQuizSession } from "./saved-quiz";
import { addSavedContextToken, checkSavedContextMission, createSavedContextMission, getSavedContextTokenOrder, removeSavedContextToken, resetSavedContextTokens, revealSavedContextMission, type SavedContextMission } from "./saved-context-mission";
import { grammarResultMessage } from "../grammar/learning";
import { getGrammarPattern, grammarPatterns, type GrammarExercise } from "../grammar/content";
import type { GrammarRecord } from "../grammar/learning";
import { contrastPack, type ContrastExercise, type ContrastPackId } from "../grammar/contrast";
import { contrastResultMessage, type ContrastRecord, type ImmediateContrastRepairOffer } from "../grammar/contrast-learning";
import { getGrammarProgressLabel, getNextFoundationPattern } from "../grammar/progression";
import { getVerbForm, getVerbJourney, getVerbJourneyContentVersion, getVerbJourneyPack, isVerbJourneyContentAvailable, isVerbJourneyPlayable, verbJourneyPack, verbJourneyPacks, type DutchTense, type EnglishComparisonCue, type EnglishComparisonVariant, type EnglishMapRecord, type EnglishTense, type JourneyRecord, type JourneyStatus, type VerbFormRecord } from "../verb-journeys/content";
import { advanceVerbPractice, checkVerbPracticeAnswer, checkVerbPracticeQuestion, createVerbPracticeSession, getCurrentVerbPracticeQuestion, getVerbPracticeQuestion, getVerbPracticeQuestions, type VerbPracticeAnswer, type VerbPracticeJourneyId, type VerbPracticeQuestion, type VerbPracticeSession } from "../verb-journeys/practice";
import type { VerbJourneyRecord } from "../verb-journeys/learning";
import { countVerbJourneyFormSlots } from "../verb-journeys/progress";
import { renderWithRecovery } from "./render-recovery";
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
let screen: "today" | "lessons" | "practicalStories" | "saved" | "lesson" | "review" | "savedQuiz" | "savedContextMission" | "settings" | "verbJourneys" | "verbJourneyOverview" | "verbJourneyStory" | "verbJourneyNotice" | "verbMap" | "verbEnglishComparison" | "verbPractice" | "verbCompletion" = "today";
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
let focusedOrigin: "today" | "lessons" | "practicalStories" | "saved" | null = null;
let activeVerbJourneyId = "journey.werken.vtt-completed";
let activeVerbId = "verb.werken";
let selectedVerbFormTense: DutchTense = "VTT";
let verbMapOrigin: "overview" | "notice" | "saved" = "overview";
let verbEnglishComparisonOrigin: "overview" | "map" = "overview";
let verbEnglishComparisonGroup: "present" | "past" | "future" = "present";
let verbEnglishComparisonDetailTense: EnglishTense | null = null;
let verbEnglishComparisonOriginTense: EnglishTense | null = null;
let verbEnglishComparisonListScrollTop = 0;
let verbEnglishComparisonInfoOpen = false;
let verbBoundaryMessage: string | null = null;
let verbNoticeDecision: DutchTense | null = null;
let verbPracticeSession: VerbPracticeSession | null = null;
let verbJourneyRecord: VerbJourneyRecord | null = null;
let verbJourneySaveChain: Promise<void> = Promise.resolve();
let activeVerbDailyFiveTask: VerbJourneyDailyFiveTask | null = null;
let verbDailyFiveAnswer: VerbPracticeAnswer | null = null;
let verbDailyFiveFeedback: { correct: boolean; message: string } | null = null;
let verbDailyFiveChecked = false;
let verbDailyFiveRetrying = false;

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
    try { verbJourneyRecord = await learningClient.getVerbJourneyRecord(); } catch { verbJourneyRecord = null; }
    try {
      lessonProgressById = Object.fromEntries(await Promise.all(allLessons.map(async (lesson) => [lesson.id, await learningClient.getLessonProgress(lesson.id)] as const)));
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
    ? focusedOrigin === "practicalStories" ? "lessons" : focusedOrigin ?? (screen === "lesson" ? "lessons" : screen === "savedQuiz" || screen === "savedContextMission" ? "saved" : "today")
    : screen === "lesson" || screen === "lessons" || screen === "practicalStories" || screen === "verbJourneys" || screen === "verbJourneyOverview" || screen === "verbJourneyStory" || screen === "verbJourneyNotice" || screen === "verbMap" || screen === "verbEnglishComparison" || screen === "verbPractice" || screen === "verbCompletion" ? "lessons" : screen === "review" || screen === "today" || screen === "settings" ? "today" : "saved";
  settingsButton?.toggleAttribute("hidden", focused);
  primaryNavigation?.toggleAttribute("hidden", screen === "lesson");
  primaryNavigation?.classList.toggle("is-locked", focused);
  content.classList.toggle("lesson-panel", screen === "lesson");
  content.classList.toggle("verb-journey-panel", screen === "verbJourneys" || screen === "verbJourneyOverview" || screen === "verbJourneyStory" || screen === "verbJourneyNotice" || screen === "verbMap" || screen === "verbEnglishComparison" || screen === "verbPractice" || screen === "verbCompletion");
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
  renderWithRecovery(content, () => screen === "today" ? renderToday() : screen === "lessons" ? renderLessons() : screen === "practicalStories" ? renderPracticalStories() : screen === "saved" ? renderSaved() : screen === "lesson" ? renderLesson() : screen === "review" ? renderReview() : screen === "savedQuiz" ? renderSavedQuiz() : screen === "savedContextMission" ? renderSavedContextMission() : screen === "verbJourneys" ? renderVerbJourneys() : screen === "verbJourneyOverview" ? renderVerbJourneyOverview() : screen === "verbJourneyStory" ? renderVerbJourneyStory() : screen === "verbJourneyNotice" ? renderVerbJourneyNotice() : screen === "verbMap" ? renderVerbMap() : screen === "verbEnglishComparison" ? renderVerbEnglishComparison() : screen === "verbPractice" ? renderVerbPractice() : screen === "verbCompletion" ? renderVerbCompletion() : renderSettings(), renderRecovery);
}

function renderRecovery(): HTMLElement {
  const wrapper = section("render-recovery");
  const returnToToday = button("Return to Today", "button primary-button");
  returnToToday.addEventListener("click", () => { screen = "today"; render(); content?.focus(); });
  wrapper.append(eyebrow("Popup content unavailable"), heading("Your learning is still safe."), text("This screen could not be rendered. Return to Today and continue from your local progress."), returnToToday);
  return wrapper;
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
      if (item.verbJourney) {
        const verbActions = section("saved-verb-journey");
        verbActions.append(text(`Resolved werken form · ${item.verbJourney.form}`, "saved-verb-journey-label"), text("This link uses bundled form evidence only.", "saved-verb-journey-note"));
        const actions = document.createElement("div"); actions.className = "saved-verb-journey-actions";
        const openMap = button("Open Verb Map", "button secondary-button");
        openMap.addEventListener("click", () => openSavedVerbMap(item.verbJourney!));
        const practise = button("Practise VTT · 5 questions", "button primary-button");
        practise.addEventListener("click", () => startSavedVerbPractice(item.verbJourney!));
        actions.append(openMap, practise); verbActions.append(actions); detail.append(verbActions);
      }
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
  const todayActivity = rhythm?.activity.find((day) => isLocalToday(day.dayStartAt));
  const reviewsCompletedToday = todayActivity?.reviews ?? null;
  const lessonsCompletedToday = todayActivity?.lessons ?? todayActivity?.lessonAdditions ?? null;
  const hasCompletedLesson = lessonCatalog.lessons.some((lesson) => lessonProgressById[lesson.id]?.completedAt !== null && lessonProgressById[lesson.id]?.completedAt !== undefined) || (lessonsCompletedToday !== null && lessonsCompletedToday > 0);
  const grammarCount = snapshot.tasks.filter((task) => "kind" in task && task.kind === "grammar").length;
  const verbCount = snapshot.tasks.filter((task) => "kind" in task && task.kind === "verb").length;
  const nextAction = section("next-action");
  const actionCopy = completed
    ? text("Your Daily Five is complete. Keep going only if you want to.", "body-copy completion-copy")
    : text(total === 0
      ? "Choose a short practical story. DutchMate will never start one automatically."
      : verbCount > 0
        ? "Review one weak verb skill in context, alongside your useful words."
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
      else { focusedOrigin = "today"; screen = "review"; revealed = false; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; activeGrammarTask = null; activeContrastTask = null; activeVerbDailyFiveTask = null; verbDailyFiveAnswer = null; verbDailyFiveFeedback = null; verbDailyFiveChecked = false; verbDailyFiveRetrying = false; render(); content?.focus(); }
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
  wrapper.append(eyebrow("Lesson library"), heading("Learn in context"), text("Choose a lesson type, then continue at your own pace."));
  const categoryGroups = section("lesson-category-groups");
  const verbGroup = section("lesson-category-group verb-journeys-group");
  verbGroup.append(renderLessonCategoryHeader("Verb Journeys", "One verb across useful forms", "route"));
  const verbEntry = button("", "verb-journey-entry");
  verbEntry.classList.add("lesson-category-card");
  verbEntry.setAttribute("aria-label", "Open Verb Journeys");
  const entryText = (value: string, className: string): HTMLElement => { const node = document.createElement("span"); node.className = className; node.textContent = value; return node; };
  const verbCopy = document.createElement("span"); verbCopy.className = "lesson-category-card-copy";
  verbCopy.append(entryText("Follow one useful verb from a real context to its complete Dutch map.", "verb-entry-copy"), entryText("Open journeys →", "verb-entry-action"));
  verbEntry.append(svgIcon("route"), verbCopy, svgIcon("chevron-right"));
  verbEntry.addEventListener("click", () => { screen = "verbJourneys"; render(); content?.focus(); });
  verbGroup.append(verbEntry);
  categoryGroups.append(verbGroup);
  const practicalGroup = section("lesson-category-group practical-stories-group");
  practicalGroup.append(renderLessonCategoryHeader("Practical Dutch", "Everyday Dutch situations", "book-open"));
  const practicalEntry = button("", "lesson-category-card practical-stories-entry");
  practicalEntry.setAttribute("aria-label", "Open Practical Dutch");
  const practicalCopy = document.createElement("span"); practicalCopy.className = "lesson-category-card-copy";
  practicalCopy.append(entryText("Follow a short everyday situation from read to review.", "verb-entry-copy"), entryText("Open Practical Dutch →", "verb-entry-action"));
  practicalEntry.append(svgIcon("book-open"), practicalCopy, svgIcon("chevron-right"));
  practicalEntry.addEventListener("click", () => { screen = "practicalStories"; render(); content?.focus(); });
  practicalGroup.append(practicalEntry);
  categoryGroups.append(practicalGroup);
  wrapper.append(categoryGroups);
  return wrapper;
}

function renderPracticalStories(): HTMLElement {
  const wrapper = section("lessons-content practical-stories-content");
  const back = journeyBack("Lessons");
  back.addEventListener("click", () => { screen = "lessons"; render(); content?.focus(); });
  wrapper.append(back, eyebrow(`Lesson library · ${lessonCatalog.lessons.length} legacy lessons plus one Practical Dutch topic`), heading("Practical Dutch"), text("Choose a level in the topic, or continue with an existing practical lesson."));
  const topic = contentCatalog.getPracticalDutchTopic();
  if (topic) wrapper.append(renderPracticalDutchTopicOverview(topic));
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

function renderPracticalDutchTopicOverview(topic: NonNullable<ReturnType<typeof contentCatalog.getPracticalDutchTopic>>): HTMLElement {
  const panel = section("practical-dutch-topic-overview");
  panel.append(eyebrow("New topic · Supermarket and shopping"), heading(topic.title.en), text(topic.description.en, "body-copy"));
  const levels = section("practical-dutch-levels");
  for (const lesson of topic.lessons) {
    const card = button("", "practical-dutch-level-card");
    card.dataset.lessonId = lesson.id;
    card.append(text(lesson.cefr, "level"), heading(lesson.title.en), text(lesson.outcome.en, "body-copy"), text(`${lesson.durationMinutes} minutes · ${lesson.languageFocus.pattern.nl}`, "lesson-pattern-status"));
    const adapted = practicalDutchLessons.find((candidate) => candidate.id === lesson.id);
    if (adapted) card.addEventListener("click", () => void startLesson(adapted));
    levels.append(card);
  }
  panel.append(levels, text("A1 is the recommended starting point. Both levels are available from the topic.", "local-note"));
  return panel;
}

function renderLessonCategoryHeader(title: string, description: string, iconName: IconName): HTMLElement {
  const header = document.createElement("div");
  header.className = "lesson-category-header";
  header.append(svgIcon(iconName, "lesson-category-icon"));
  const copy = document.createElement("span");
  copy.className = "lesson-category-header-copy";
  const titleNode = document.createElement("strong");
  titleNode.className = "lesson-category-title";
  titleNode.textContent = title;
  const descriptionNode = document.createElement("small");
  descriptionNode.textContent = description;
  copy.append(titleNode, descriptionNode);
  header.append(copy);
  return header;
}

function renderVerbJourneys(): HTMLElement {
  const wrapper = section("verb-journeys-content");
  if (!verbJourneyPacks.every((pack) => isVerbJourneyContentAvailable(pack.verb.id))) {
    wrapper.append(eyebrow("Verb Journeys unavailable"), heading("This content needs an update."), text("The reviewed werken pack could not be loaded safely."));
    const back = button("Back to Lessons", "button primary-button"); back.addEventListener("click", () => { screen = "lessons"; render(); }); wrapper.append(back);
    return wrapper;
  }
  const back = journeyBack("Lessons");
  back.addEventListener("click", () => { screen = "lessons"; render(); });
  wrapper.append(back, eyebrow("Lessons · Verb Journeys"), heading("Verb Journeys"), text("Choose one useful Dutch verb and follow its staged forms from context to reference."));
  const list = section("verb-directory");
  // Stable directory positions follow the additive pack registry.
  const entries = [
    ...verbJourneyPacks.map((pack, index) => ({ number: String(index + 1).padStart(2, "0"), verbId: pack.verb.id, lemma: pack.verb.lemma, detail: `${pack.verb.english} · ${pack.verb.tags.includes("irregular") ? "irregular" : "A1 core verb"}`, enabled: true })),
  ];
  for (const entry of entries) {
    const row = button("", "verb-directory-row is-openable");
    row.setAttribute("aria-label", `Open ${entry.lemma} Verb Journey`);
    const number = document.createElement("span"); number.className = "verb-directory-number"; number.textContent = entry.number;
    const copy = document.createElement("span"); copy.className = "verb-directory-copy";
    const lemma = document.createElement("strong"); lemma.textContent = entry.lemma;
    const detail = document.createElement("small"); detail.textContent = entry.detail;
    copy.append(lemma, detail);
    const action = document.createElement("span"); action.className = "verb-directory-action"; action.textContent = "Open →";
    row.append(number, copy, action);
    const progress = getVerbJourneyProgress(getVerbJourneyPack(entry.verbId) ?? verbJourneyPack);
    row.classList.add("has-progress");
    row.append(spanText(`${progress.completedForms} of ${progress.totalForms} forms practised`, "verb-directory-progress-summary"), renderVerbProgressTrack(progress));
    row.addEventListener("click", () => { activeVerbId = entry.verbId; activeVerbJourneyId = getVerbJourneyPack(activeVerbId)?.journeys[0]?.id ?? activeVerbJourneyId; screen = "verbJourneyOverview"; render(); content?.focus(); });
    list.append(row);
  }
  wrapper.append(list, text("Numbers keep the verb directory stable; they do not lock your learning path.", "local-note"));
  return wrapper;
}

function getActiveVerbJourneyPack() { return getVerbJourneyPack(activeVerbId) ?? verbJourneyPack; }

function getVerbJourneyProgress(pack = getActiveVerbJourneyPack()): { completedForms: number; totalForms: number; percentage: number } {
  const completedForms = countVerbJourneyFormSlots(pack, verbJourneyRecord);
  const totalForms = pack.dutchForms.length;
  return { completedForms, totalForms, percentage: totalForms === 0 ? 0 : Math.round((completedForms / totalForms) * 100) };
}

function getVerbFormEvidence(form: VerbFormRecord, pack = getActiveVerbJourneyPack()): VerbJourneyRecord["skills"][string][] {
  const skillIds = new Set(pack.journeys.filter((journey) => journey.targetForms.includes(form.dutchTense)).flatMap((journey) => journey.targetSkills));
  return Object.values(verbJourneyRecord?.skills ?? {}).filter((skill) => skill.verbId === pack.verb.id && skillIds.has(skill.formOrSkillId));
}

function getVerbJourneyDisplayStatus(journey: JourneyRecord): JourneyStatus {
  const evidence = journey.targetSkills.flatMap((skillId) => Object.values(verbJourneyRecord?.skills ?? {}).filter((skill) => skill.verbId === journey.verbId && skill.formOrSkillId === skillId));
  if (evidence.length > 0 && evidence.every((skill) => skill.status === "demonstrated")) return "mastered";
  if (evidence.length > 0) return "learning";
  if (journey.kind === "reference") return "reference";
  if (journey.kind === "later") return "later";
  const firstUnmasteredCore = getActiveVerbJourneyPack().journeys.find((candidate) => candidate.kind === "core" && getVerbJourneyDisplayStatusWithoutRecursion(candidate) !== "mastered");
  return firstUnmasteredCore?.id === journey.id ? "next" : "later";
}

function getVerbJourneyDisplayStatusWithoutRecursion(journey: JourneyRecord): JourneyStatus {
  const evidence = journey.targetSkills.flatMap((skillId) => Object.values(verbJourneyRecord?.skills ?? {}).filter((skill) => skill.verbId === journey.verbId && skill.formOrSkillId === skillId));
  if (evidence.length > 0 && evidence.every((skill) => skill.status === "demonstrated")) return "mastered";
  if (evidence.length > 0) return "learning";
  if (journey.kind === "reference") return "reference";
  if (journey.kind === "later") return "later";
  return "next";
}

function getVerbJourneyActionTarget(): { journey: JourneyRecord; allMastered: boolean } {
  const pack = getActiveVerbJourneyPack();
  const statuses = pack.journeys.map((journey) => getVerbJourneyDisplayStatus(journey));
  const allMastered = statuses.every((status) => status === "mastered");
  if (allMastered) return { journey: pack.journeys[0], allMastered: true };
  const active = getVerbJourney(activeVerbJourneyId);
  if (active && getVerbJourneyDisplayStatus(active) === "learning") return { journey: active, allMastered: false };
  const next = pack.journeys.find((_journey, index) => statuses[index] === "next");
  if (next) return { journey: next, allMastered: false };
  const unfinished = pack.journeys.find((_journey, index) => statuses[index] !== "mastered");
  return { journey: unfinished ?? active ?? pack.journeys[0], allMastered: false };
}

function getVerbJourneyActionLabel(journey: JourneyRecord, allMastered: boolean): string {
  if (allMastered) return "Review a journey →";
  const status = getVerbJourneyDisplayStatus(journey);
  return `${status === "learning" ? "Continue" : status === "mastered" ? "Review" : "Start"} ${journey.title} →`;
}

function getVerbFormDisplayStatus(form: VerbFormRecord): JourneyStatus {
  const evidence = getVerbFormEvidence(form);
  if (evidence.length > 0 && evidence.every((skill) => skill.status === "demonstrated")) return "mastered";
  if (evidence.length > 0) return "learning";
  if (form.teachingPriority === "reference") return "reference";
  if (form.teachingPriority === "later") return "later";
  return "next";
}

function renderVerbProgressTrack(progress: ReturnType<typeof getVerbJourneyProgress>, className = ""): HTMLElement {
  const track = document.createElement("span");
  track.className = `verb-progress-track${className ? ` ${className}` : ""}`;
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(progress.totalForms));
  track.setAttribute("aria-valuenow", String(progress.completedForms));
  track.setAttribute("aria-label", `${progress.completedForms} of ${progress.totalForms} Dutch forms practised`);
  const fill = document.createElement("span");
  fill.className = "verb-progress-fill";
  fill.style.width = `${progress.percentage}%`;
  track.append(fill);
  return track;
}

function renderVerbJourneyOverview(): HTMLElement {
  const wrapper = section("verb-journey-overview");
  const pack = getActiveVerbJourneyPack();
  const back = journeyBack("Verb Journeys");
  back.addEventListener("click", () => { screen = "verbJourneys"; render(); });
  wrapper.append(back, eyebrow(`${pack.verb.level} · ${pack.verb.tags.join(" · ")}`), heading(pack.verb.lemma), text(`${pack.verb.english} · auxiliary: ${pack.verb.auxiliary}`, "journey-lead"));
  const progress = getVerbJourneyProgress();
  const mastery = section("verb-mastery-card");
  const masteryHeader = document.createElement("div");
  masteryHeader.className = "verb-progress-header";
  const masteryCopy = document.createElement("span");
  masteryCopy.className = "verb-progress-copy";
  masteryCopy.append(eyebrow("Your Verb Journey"), spanText(`${progress.completedForms} of ${progress.totalForms} forms practised`, "verb-mastery-count"));
  masteryHeader.append(masteryCopy, svgIcon("route", "verb-mastery-icon"));
  const mapAction = button("8 Dutch forms", "button primary-button");
  mapAction.addEventListener("click", () => { selectedVerbFormTense = "VTT"; verbMapOrigin = "overview"; screen = "verbMap"; render(); content?.focus(); });
  const comparisonAction = button("12 English forms", "button secondary-button");
  comparisonAction.addEventListener("click", () => { openEnglishComparisonFrom("overview"); });
  const actions = document.createElement("div");
  actions.className = "verb-mastery-actions";
  actions.append(mapAction, comparisonAction);
  mastery.append(masteryHeader, renderVerbProgressTrack(progress, "light"), actions);
  wrapper.append(mastery, text("Learning journeys", "journey-section-label"));
  const journeyList = section("journey-list");
  for (const [index, journey] of pack.journeys.entries()) {
    const row = button("", "journey-list-row");
    const journeyNumber = String(index + 1).padStart(2, "0");
    const displayStatus = getVerbJourneyDisplayStatus(journey);
    row.setAttribute("aria-label", `Journey ${journeyNumber}: ${journey.title}, ${journey.subtitle}, ${displayStatus}`);
    const status = document.createElement("span"); status.className = `journey-status ${displayStatus}`;
    status.append(spanText(journeyNumber, "journey-status-number"));
    if (displayStatus === "mastered") { const completion = spanText("✓", "journey-completion-mark"); completion.setAttribute("aria-label", "Completed"); completion.title = "Completed"; status.append(completion); }
    const copy = document.createElement("span"); copy.className = "journey-list-copy";
    const title = document.createElement("strong"); title.textContent = journey.title;
    const subtitle = document.createElement("small"); subtitle.textContent = journey.subtitle;
    copy.append(title, subtitle);
    const badge = document.createElement("span"); badge.className = `journey-status-label ${displayStatus}`; badge.textContent = displayStatus === "mastered" ? "Mastered" : displayStatus === "learning" ? "Continue" : displayStatus === "next" ? "Next" : displayStatus === "reference" ? "Reference" : "Later";
    row.append(status, copy, badge);
    row.addEventListener("click", () => openVerbJourney(journey));
    journeyList.append(row);
  }
  wrapper.append(journeyList);
  if (verbBoundaryMessage) { const status = text(verbBoundaryMessage, "journey-boundary"); status.setAttribute("role", "status"); wrapper.append(status); }
  const actionTarget = getVerbJourneyActionTarget();
  const continueButton = button(getVerbJourneyActionLabel(actionTarget.journey, actionTarget.allMastered), "button primary-button");
  continueButton.addEventListener("click", () => openVerbJourney(actionTarget.journey));
  const practiceButton = button(actionTarget.allMastered ? "Practise a journey · 5 questions →" : verbPracticeActionLabel(actionTarget.journey.id as VerbPracticeJourneyId), "button secondary-button");
  practiceButton.addEventListener("click", () => startVerbPractice(actionTarget.journey.id as VerbPracticeJourneyId));
  wrapper.append(continueButton, practiceButton);
  return wrapper;
}

function openVerbJourney(journey: JourneyRecord): void {
  activeVerbId = journey.verbId;
  activeVerbJourneyId = journey.id;
  verbBoundaryMessage = null;
  if (isVerbJourneyPlayable(journey)) { screen = "verbJourneyStory"; render(); content?.focus(); return; }
  verbBoundaryMessage = `${journey.title} is currently available as reference material. Open the 8-form map to inspect it.`;
  screen = "verbJourneyOverview";
  render();
}

function renderVerbJourneyStory(): HTMLElement {
  const wrapper = section("verb-journey-story");
  const journey = getVerbJourney(activeVerbJourneyId) ?? getActiveVerbJourneyPack().journeys[0];
  const back = journeyBack(journey.title);
  back.addEventListener("click", () => { screen = "verbJourneyOverview"; render(); });
  wrapper.append(back, text(`${journey.subtitle} · Story`, "journey-meta"), eyebrow(journey.title), heading(journey.storyTitle ?? journey.title), text(journey.learningGoal, "journey-goal"));
  const story = section("verb-story-card");
  for (const line of journey.story) {
    const row = document.createElement("div"); row.className = "verb-story-line";
    const translation = text(line.english, "verb-story-translation");
    const telugu = text(line.telugu, "verb-story-telugu");
    telugu.lang = "te";
    row.append(renderStoryLine(line), translation, telugu);
    story.append(row);
  }
  wrapper.append(story, text("Read the highlighted form in context, then notice what changes.", "journey-helper"));
  const next = button("Notice the pattern →", "button primary-button");
  next.addEventListener("click", () => { verbNoticeDecision = null; screen = "verbJourneyNotice"; render(); content?.focus(); });
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
  const journey = getVerbJourney(activeVerbJourneyId) ?? getActiveVerbJourneyPack().journeys[0];
  const notice = journey.notice ?? getActiveVerbJourneyPack().journeys[0].notice!;
  const back = journeyBack("Story");
  back.addEventListener("click", () => { screen = "verbJourneyStory"; render(); });
  wrapper.append(back, text(`${journey.subtitle} · Notice`, "journey-meta"), eyebrow("Notice the pattern"), heading(notice.title), text(notice.subtitle, "journey-lead"));
  const comparison = section("verb-pattern-stack");
  for (const item of notice.comparison) {
    const card = section("verb-pattern-card");
    const isCurrent = item.tense === journey.targetForms[0];
    const chip = spanText(item.label, `verb-pattern-tag verb-notice-chip ${isCurrent ? "current" : "contrast"}`);
    card.append(chip, renderVerbNoticeSentence(item.sentence, item.tense, journey.verbId), text(item.meaning, "verb-pattern-meaning"));
    comparison.append(card);
  }
  const formula = section("verb-formula-card");
  formula.append(text("FORMULA", "verb-card-label"), renderVerbNoticeFormula(notice.formula, journey.verbId), text(notice.formulaNote, "verb-card-copy"));
  const contrast = section("verb-contrast-card");
  const contrastGuide = text("Orange focus = this journey · Compare = a nearby meaning", "verb-contrast-guide");
  const contrastList = section("verb-contrast-list");
  for (const item of notice.comparison) {
    const isCurrent = journey.targetForms.includes(item.tense);
    const option = section(`verb-contrast-option ${isCurrent ? "current" : "contrast"}`);
    option.append(spanText(isCurrent ? "This journey" : "Compare", "verb-contrast-label"), spanText(`${item.tense} · ${item.label}`, "verb-contrast-title"));
    contrastList.append(option);
  }
  contrast.append(text("VALUABLE CONTRAST", "verb-card-label"), contrastGuide, contrastList, text(notice.valuableContrast, "verb-card-copy"));
  const targetTense = journey.targetForms[0] ?? "VTT";
  const interaction = section("verb-notice-interaction");
  interaction.append(text("NOTICE", "verb-card-label"), text(targetTense === "VTT" ? "Which sentence reports one completed event?" : targetTense === "OVT" ? "Which sentence describes a past habit or story background?" : "Which sentence matches this journey's focus?", "verb-card-copy"));
  const choices = section("verb-notice-choices");
  for (const item of notice.comparison) {
    const choice = button("", `button verb-notice-choice${verbNoticeDecision === item.tense ? " is-selected" : ""}`);
    choice.setAttribute("aria-pressed", String(verbNoticeDecision === item.tense));
    choice.append(renderVerbNoticeSentence(item.sentence, item.tense, journey.verbId), text(item.meaning, "verb-pattern-meaning"));
    choice.addEventListener("click", () => { verbNoticeDecision = item.tense; render(); });
    choices.append(choice);
  }
  interaction.append(choices);
  if (verbNoticeDecision) {
    const feedback = text(verbNoticeDecision === targetTense ? `Correct. ${notice.valuableContrast}` : `Not quite. ${notice.valuableContrast}`, `verb-notice-feedback ${verbNoticeDecision === targetTense ? "correct" : "needs-review"}`);
    feedback.setAttribute("role", "status");
    interaction.append(feedback);
  }
  wrapper.append(comparison, formula, contrast, interaction);
  const next = button("Place it on the 8-form map →", "button primary-button");
  next.disabled = verbNoticeDecision === null;
  next.addEventListener("click", () => { selectedVerbFormTense = journey.targetForms[0] ?? "VTT"; verbMapOrigin = "notice"; screen = "verbMap"; render(); content?.focus(); });
  wrapper.append(next);
  return wrapper;
}

function renderVerbMap(): HTMLElement {
  const wrapper = section("verb-map-screen");
  const pack = getActiveVerbJourneyPack();
  const backLabel = verbMapOrigin === "notice" ? "Notice" : verbMapOrigin === "saved" ? "Saved" : pack.verb.lemma;
  const back = journeyBack(backLabel);
  back.addEventListener("click", () => { screen = verbMapOrigin === "notice" ? "verbJourneyNotice" : verbMapOrigin === "saved" ? "saved" : "verbJourneyOverview"; render(); });
  const displayLemma = pack.verb.lemma.charAt(0).toUpperCase() + pack.verb.lemma.slice(1);
  wrapper.append(back, text(`Canonical map · ${pack.verb.lemma}`, "journey-meta"), eyebrow("Eight Dutch forms"), heading(`${displayLemma} Verb Map`), text(`One stable map for every ${pack.verb.lemma} journey. Select a form to inspect it.`, "journey-lead"));
  const legend = document.createElement("div"); legend.className = "verb-map-legend";
  legend.append(text("FORM STATUS", "verb-map-legend-title"));
  for (const [status, label, detail] of [["mastered", "Mastered", "ready to use"], ["learning", "Next / current", "learning now or next"], ["later", "Later / locked", "later or reference"]] as const) {
    const item = document.createElement("span"); item.className = `map-legend-item ${status}`;
    const meta = verbFormStatusMeta(status);
    item.setAttribute("role", "img");
    item.setAttribute("aria-label", `${label}: ${detail}`);
    const symbol = spanText(meta.symbol, "verb-status-symbol"); symbol.setAttribute("aria-hidden", "true");
    item.append(symbol, spanText(label, "verb-status-label"));
    legend.append(item);
  }
  wrapper.append(legend);
  const map = document.createElement("div"); map.className = "verb-map-grid"; map.setAttribute("role", "grid"); map.setAttribute("aria-label", `Eight Dutch forms for ${pack.verb.lemma}`);
  const corner = document.createElement("div"); corner.className = "verb-map-corner"; corner.append(spanText("VIEWPOINT", "verb-map-label-main"), spanText("Tijd & aspect", "verb-map-label-sub")); map.append(corner);
  for (const headingValue of [["Onvoltooid", "Not completed"], ["Voltooid", "Completed"]] as const) { const header = document.createElement("div"); header.className = "verb-map-column"; header.setAttribute("aria-label", `${headingValue[0].charAt(0)}: ${headingValue[0]} · ${headingValue[1]}`); header.append(renderVerbMapHeaderLabel(headingValue[0], "verb-map-label-main"), spanText(headingValue[1], "verb-map-label-sub")); map.append(header); }
  for (const viewpoint of ["present", "past", "future", "future-from-past"] as const) {
    const rowLabel = document.createElement("div"); rowLabel.className = "verb-map-row-label";
    const rowMeta = verbMapViewpointMeta(viewpoint);
    const tenseCode = rowMeta.dutch.split(/\s+/u).map((word) => word.charAt(0)).join("");
    rowLabel.setAttribute("aria-label", `${tenseCode}: ${rowMeta.dutch} · ${rowMeta.english}`);
    rowLabel.append(spanText(rowMeta.english, "verb-map-label-main"), renderVerbMapHeaderLabel(rowMeta.dutch, "verb-map-label-sub"));
    map.append(rowLabel);
    for (const completion of ["onvoltooid", "voltooid"] as const) {
      const form = pack.dutchForms.find((candidate) => candidate.viewpoint === viewpoint && candidate.completion === completion)!;
      const displayStatus = getVerbFormDisplayStatus(form);
      const card = button("", `verb-form-card ${displayStatus}${form.dutchTense === selectedVerbFormTense ? " selected" : ""}`);
      const statusMeta = verbFormStatusMeta(displayStatus);
      card.setAttribute("aria-label", `${form.dutchTense}: ${form.learnerLabelEn} · ${form.fullNameNl} · ${statusMeta.label}: ${statusMeta.detail}`); card.setAttribute("aria-pressed", String(form.dutchTense === selectedVerbFormTense)); card.setAttribute("aria-selected", String(form.dutchTense === selectedVerbFormTense));
      const status = document.createElement("span"); status.className = `verb-form-status ${displayStatus}`; status.setAttribute("aria-label", `${statusMeta.label}: ${statusMeta.detail}`); status.append(spanText(statusMeta.symbol, "verb-status-symbol"));
      const canonical = form.canonicalExample;
      const cardHeader = document.createElement("span"); cardHeader.className = "verb-form-card-header"; cardHeader.append(renderVerbTenseCode(form.dutchTense), status);
      card.append(cardHeader, renderLocalizedSentenceLine("NL", canonical.nl, "verb-form-example", verbNoticeTokens(form.dutchTense, pack.verb.id)), spanText(`EN · ${canonical.en}`, "verb-form-example-en"), spanText(`TE · ${canonical.te}`, "verb-form-example-te"));
      card.addEventListener("click", () => { selectedVerbFormTense = form.dutchTense; render(); content?.querySelector<HTMLElement>(".verb-form-detail")?.scrollIntoView?.({ block: "nearest", inline: "nearest" }); });
      map.append(card);
    }
  }
  wrapper.append(map);
  const selected = getVerbForm(selectedVerbFormTense, pack.verb.id) ?? pack.dutchForms[0];
  const comparisonButton = button("Compare 12 English forms →", "button secondary-button");
  comparisonButton.addEventListener("click", () => { focusEnglishComparisonForForm(selected.dutchTense); verbEnglishComparisonOrigin = "map"; screen = "verbEnglishComparison"; render(); content?.focus(); });
  const practiceButton = button(verbPracticeActionLabel(), "button primary-button");
  practiceButton.addEventListener("click", () => startVerbPractice());
  wrapper.append(renderVerbFormDetail(selected, pack.verb.id), text("Important: Dutch onvoltooid does not mean the same thing as English continuous, and voltooid is not always a direct English perfect. Context and time words still matter.", "verb-map-note"), comparisonButton, practiceButton);
  return wrapper;
}

function renderVerbEnglishComparison(): HTMLElement {
  const wrapper = section("verb-english-comparison");
  const pack = getActiveVerbJourneyPack();
  const back = journeyBack(verbEnglishComparisonOrigin === "map" ? "Verb Map" : pack.verb.lemma);
  back.addEventListener("click", () => { screen = verbEnglishComparisonOrigin === "map" ? "verbMap" : "verbJourneyOverview"; render(); content?.focus(); });
  wrapper.append(back, text(`English lens · ${pack.verb.lemma}`, "journey-meta"));
  const detail = pack.englishComparison.find((record) => record.englishTense === verbEnglishComparisonDetailTense);
  if (detail) {
    wrapper.append(renderEnglishComparisonDetail(pack, detail));
    return wrapper;
  }
  wrapper.append(eyebrow("English comparison"), heading("12 English forms → Dutch"), text("English often uses a larger verb construction; Dutch often uses a simpler form plus a time cue.", "journey-lead"));
  const infoButton = button("ⓘ About this comparison", "button quiet-link verb-english-info-button");
  infoButton.setAttribute("aria-expanded", String(verbEnglishComparisonInfoOpen));
  infoButton.addEventListener("click", () => { verbEnglishComparisonInfoOpen = !verbEnglishComparisonInfoOpen; render(); });
  wrapper.append(infoButton);
  if (verbEnglishComparisonInfoOpen) wrapper.append(text("This is a comparison lens, not a one-to-one tense conversion. Compare the Dutch construction that closely preserves the English distinction with the form Dutch speakers commonly use in daily conversation.", "verb-english-info"));
  const tabs = document.createElement("div"); tabs.className = "verb-english-tabs"; tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "English tense groups");
  for (const group of ["present", "past", "future"] as const) {
    const groupRecords = pack.englishComparison.filter((record) => record.group === group);
    const rangeStart = group === "present" ? 1 : group === "past" ? 5 : 9;
    const tab = button(`${group[0].toUpperCase()}${group.slice(1)} ${rangeStart}–${rangeStart + groupRecords.length - 1}`, `verb-english-tab${verbEnglishComparisonGroup === group ? " is-active" : ""}`);
    tab.setAttribute("role", "tab"); tab.setAttribute("aria-selected", String(verbEnglishComparisonGroup === group)); tab.setAttribute("tabindex", verbEnglishComparisonGroup === group ? "0" : "-1");
    tab.addEventListener("click", () => { verbEnglishComparisonGroup = group; verbEnglishComparisonDetailTense = null; render(); });
    tabs.append(tab);
  }
  wrapper.append(tabs);
  const mapButton = button("View 8-form Dutch map", "button secondary-button verb-english-map-link");
  mapButton.addEventListener("click", () => { screen = "verbMap"; verbMapOrigin = verbEnglishComparisonOrigin === "map" ? verbMapOrigin : "overview"; render(); content?.focus(); });
  wrapper.append(mapButton);
  const records = pack.englishComparison.filter((record) => record.group === verbEnglishComparisonGroup);
  const list = section("verb-english-list"); list.setAttribute("role", "tabpanel"); list.setAttribute("aria-label", `${verbEnglishComparisonGroup} English patterns`);
  for (const [index, record] of records.entries()) list.append(renderEnglishComparisonCard(record, index + (verbEnglishComparisonGroup === "present" ? 1 : verbEnglishComparisonGroup === "past" ? 5 : 9), pack.verb.id));
  list.scrollTop = verbEnglishComparisonListScrollTop;
  wrapper.append(list);
  const mapButtonBottom = button("Back to 8-form map", "button secondary-button"); mapButtonBottom.addEventListener("click", () => { screen = "verbMap"; verbMapOrigin = verbEnglishComparisonOrigin === "map" ? verbMapOrigin : "overview"; render(); content?.focus(); });
  wrapper.append(mapButtonBottom);
  return wrapper;
}

function openEnglishComparisonFrom(origin: "overview" | "map"): void {
  verbEnglishComparisonOrigin = origin;
  verbEnglishComparisonGroup = "present";
  verbEnglishComparisonDetailTense = null;
  verbEnglishComparisonOriginTense = null;
  verbEnglishComparisonListScrollTop = 0;
  verbEnglishComparisonInfoOpen = false;
  screen = "verbEnglishComparison";
  render();
  content?.focus();
}

function focusEnglishComparisonForForm(tense: DutchTense): void {
  const preferredEnglishTense: Record<DutchTense, EnglishTense> = {
    OTT: "present-simple",
    VTT: "present-perfect",
    OVT: "past-simple",
    VVT: "past-perfect",
    OTTT: "future-simple",
    OVTT: "future-simple",
    VTTT: "future-perfect",
    VVTT: "future-perfect",
  };
  const record = getActiveVerbJourneyPack().englishComparison.find((candidate) => candidate.englishTense === preferredEnglishTense[tense]);
  if (!record) return;
  verbEnglishComparisonGroup = record.group;
  verbEnglishComparisonDetailTense = null;
  verbEnglishComparisonOriginTense = record.englishTense;
  verbEnglishComparisonInfoOpen = false;
}

function renderEnglishComparisonCard(record: EnglishMapRecord, index: number, verbId: string): HTMLElement {
  const everyday = englishComparisonVariant(record, "everyday");
  const cue = record.cue;
  const card = button("", "verb-english-card");
  card.dataset.englishTense = record.englishTense;
  card.setAttribute("aria-label", `${index}. ${englishFormLabel(record)}. Everyday Dutch: ${everyday.nl}. Dutch form: ${everyday.form}. ${cue ? `Cue: ${cue.display}` : ""}`.trim());
  const header = document.createElement("span"); header.className = "verb-english-card-header";
  header.append(spanText(String(index), "verb-english-index"), spanText(englishFormLabel(record), "verb-english-name"), spanText(everyday.form, "verb-english-form"), spanText("›", "verb-english-toggle"));
  const english = text(record.english, "verb-english-example"); english.lang = "en";
  const dutch = section("verb-english-dutch"); dutch.append(renderEnglishCueSentence(everyday.nl, [...(cue?.tokens ?? []), ...verbNoticeTokens(everyday.form, verbId)], "verb-english-dutch-sentence"));
  if (cue) dutch.append(text(`Cue · ${cue.display}`, "verb-english-cue"));
  card.append(header, english, dutch);
  card.addEventListener("click", () => {
    verbEnglishComparisonListScrollTop = content?.scrollTop ?? 0;
    verbEnglishComparisonOriginTense = record.englishTense;
    verbEnglishComparisonDetailTense = record.englishTense;
    render();
    content?.focus();
  });
  return card;
}

function renderEnglishComparisonDetail(pack: ReturnType<typeof getActiveVerbJourneyPack>, record: EnglishMapRecord): HTMLElement {
  const detail = section("verb-english-detail-view");
  const index = pack.englishComparison.findIndex((candidate) => candidate.englishTense === record.englishTense);
  const back = button(`Back to ${record.group[0].toUpperCase()}${record.group.slice(1)} forms`, "quiet-link");
  back.addEventListener("click", () => {
    verbEnglishComparisonDetailTense = null;
    render();
    const origin = content?.querySelector<HTMLButtonElement>(`[data-english-tense="${verbEnglishComparisonOriginTense ?? record.englishTense}"]`);
    if (content) content.scrollTop = verbEnglishComparisonListScrollTop;
    origin?.focus();
  });
  const position = text(`${index + 1} of ${pack.englishComparison.length}`, "verb-english-detail-position");
  detail.append(back, position, eyebrow("English comparison detail"), heading(englishFormLabel(record)));
  detail.append(renderEnglishComparisonVariant("MEANING-PRESERVING DUTCH", englishComparisonVariant(record, "meaningPreserving"), record.cue?.tokens ?? [], pack.verb.id));
  detail.append(renderEnglishComparisonVariant("EVERYDAY DUTCH", englishComparisonVariant(record, "everyday"), record.cue?.tokens ?? [], pack.verb.id));
  if (record.cue) {
    const cue = section("verb-english-detail-cue");
    cue.append(text("CUE", "verb-card-label"), text(`${record.cue.display} · ${record.cue.shortMeaning}`, "verb-english-cue"));
    detail.append(cue);
  }
  detail.append(meaning("HOW DUTCH EXPRESSES IT", record.howDutchExpressesIt ?? englishAnalysis(record)), meaning("WHY THEY DIFFER", record.whyTheyDiffer ?? record.mismatchNote));
  const pager = section("verb-english-pager");
  const previous = button("Previous", "button secondary-button"); previous.disabled = index <= 0;
  const next = button("Next", "button primary-button"); next.disabled = index >= pack.englishComparison.length - 1;
  previous.addEventListener("click", () => openEnglishComparisonDetail(pack.englishComparison[index - 1]));
  next.addEventListener("click", () => openEnglishComparisonDetail(pack.englishComparison[index + 1]));
  pager.append(previous, next);
  detail.append(pager);
  return detail;
}

function openEnglishComparisonDetail(record: EnglishMapRecord): void {
  verbEnglishComparisonGroup = record.group;
  verbEnglishComparisonDetailTense = record.englishTense;
  render();
  content?.focus();
}

function renderEnglishComparisonVariant(label: string, variant: EnglishComparisonVariant, cueTokens: string[], verbId = "verb.werken"): HTMLElement {
  const block = section("verb-english-variant");
  const header = document.createElement("div"); header.className = "verb-english-variant-header";
  header.append(text(label, "verb-card-label"), text(variant.form, "verb-english-form"));
  const dutch = renderEnglishCueSentence(variant.nl, [...cueTokens, ...verbNoticeTokens(variant.form, verbId)], "verb-english-detail-dutch"); dutch.lang = "nl";
  block.append(header, dutch, text(`EN · ${variant.en}`, "verb-english-detail-translation"), text(`TE · ${variant.te}`, "verb-english-detail-translation"));
  return block;
}

function renderEnglishCueSentence(value: string, tokens: string[], className: string): HTMLElement {
  const element = text("", className);
  appendTokenHighlights(element, value, tokens, "verb-english-cue-highlight");
  return element;
}

function englishComparisonVariant(record: EnglishMapRecord, role: "meaningPreserving" | "everyday"): EnglishComparisonVariant {
  const variant = record[role];
  if (variant) return variant;
  return { nl: role === "everyday" ? record.commonEverydayDutch : record.meaningPreservingDutch, en: record.english, te: "", form: record.dutchAnalysis.primaryForm ?? "OTT" };
}

function englishFormLabel(record: EnglishMapRecord): string {
  return record.englishTense.split("-").map((part, index) => index === 0 ? part[0].toUpperCase() + part.slice(1) : part).join(" ");
}

function englishAnalysis(record: EnglishMapRecord): string {
  const form = record.dutchAnalysis.primaryForm;
  const alternatives = record.dutchAnalysis.alternativeForms?.join(" / ");
  return [form, record.dutchAnalysis.construction, alternatives ? `alternative: ${alternatives}` : null].filter(Boolean).join(" · ") || "Context-dependent construction";
}

function englishAnalysisLabel(record: EnglishMapRecord): string {
  return record.dutchAnalysis.primaryForm ?? record.dutchAnalysis.construction ?? "Context";
}

function verbPracticeActionLabel(journeyId: VerbPracticeJourneyId = getActiveVerbPracticeJourneyId()): string {
  const journey = getPracticeJourney(journeyId);
  const tense = journey?.targetForms.join(" + ") ?? "VTT";
  const hasEvidence = journey?.targetSkills.some((skillId) => Object.values(verbJourneyRecord?.skills ?? {}).some((skill) => skill.verbId === journey.verbId && skill.formOrSkillId === skillId)) ?? false;
  return `${hasEvidence ? "Review" : "Practise"} ${tense} · 5 questions →`;
}

function getVerbReviewTense(task: VerbJourneyDailyFiveTask): DutchTense {
  const question = getVerbPracticeQuestion(task.exerciseId);
  return question ? getVerbJourney(question.journeyId)?.targetForms[0] ?? "VTT" : "VTT";
}

function getPracticeJourney(journeyId: string = activeVerbJourneyId): JourneyRecord | null {
  const journey = getVerbJourney(journeyId);
  return journey && isVerbJourneyPlayable(journey) ? journey : null;
}

function getActiveVerbPracticeJourneyId(): VerbPracticeJourneyId {
  return getPracticeJourney()?.id as VerbPracticeJourneyId ?? "journey.werken.vtt-completed";
}

function renderVerbFormDetail(form: VerbFormRecord, verbId = getActiveVerbJourneyPack().verb.id): HTMLElement {
  const detail = section("verb-form-detail");
  const canonical = form.canonicalExample;
  const commonUse = form.commonUsageExample;
  const statusMeta = verbFormStatusMeta(getVerbFormDisplayStatus(form));
  const header = document.createElement("div"); header.className = "verb-detail-header"; header.append(text(form.dutchTense, "verb-detail-code"), spanText(`${statusMeta.symbol} ${statusMeta.label}`, "verb-detail-status"));
  const formTokens = verbNoticeTokens(form.dutchTense, verbId);
  detail.append(header, text(form.learnerLabelEn, "verb-detail-label"), text(form.fullNameNl, "verb-detail-dutch-name"), localizedSentenceSection(null, canonical, "verb-detail-canonical", formTokens), meaning("MEANING", form.usageMeaning), meaning("PATTERN", form.formula), localizedSentenceSection("COMMON USE", commonUse, "verb-detail-common-use", formTokens));
  return detail;
}

function localizedSentenceSection(label: string | null, sentence: { nl: string; en: string; te: string }, className: string, highlightTokens: string[] = []): HTMLElement {
  const group = section(className);
  if (label) group.append(text(label, "verb-detail-section-label"));
  group.append(renderLocalizedSentenceLine("NL", sentence.nl, "verb-detail-localized-line verb-detail-canonical-nl verb-detail-example", highlightTokens), text(`EN · ${sentence.en}`, "verb-detail-localized-line verb-detail-canonical-en"), text(`TE · ${sentence.te}`, "verb-detail-localized-line verb-detail-canonical-te"));
  return group;
}

function renderLocalizedSentenceLine(label: string, value: string, className: string, highlightTokens: string[] = []): HTMLElement {
  const line = text("", className);
  line.append(`${label} · `);
  appendTokenHighlights(line, value, highlightTokens, "verb-form-highlight");
  return line;
}

function startVerbPractice(journeyId: VerbPracticeJourneyId = getActiveVerbPracticeJourneyId()): void {
  const journey = getVerbJourney(journeyId);
  if (journey) activeVerbId = journey.verbId;
  activeVerbJourneyId = journeyId;
  verbPracticeSession = createVerbPracticeSession(journeyId);
  screen = "verbPractice";
  render();
  content?.focus();
}

function openSavedVerbMap(link: SavedVerbJourneyLink): void {
  selectedVerbFormTense = link.form;
  verbMapOrigin = "saved";
  screen = "verbMap";
  render();
  content?.focus();
}

function startSavedVerbPractice(link: SavedVerbJourneyLink): void {
  activeVerbId = "verb.werken";
  selectedVerbFormTense = link.form;
  verbMapOrigin = "saved";
  startVerbPractice("journey.werken.vtt-completed");
}

function renderVerbPractice(): HTMLElement {
  const wrapper = section("verb-practice-screen");
  const session = verbPracticeSession ?? createVerbPracticeSession();
  verbPracticeSession = session;
  const question = getCurrentVerbPracticeQuestion(session);
  if (!question) { screen = "verbCompletion"; return renderVerbCompletion(); }
  const isRepair = question.phase === "repair";
  const back = journeyBack("Verb Map");
  back.addEventListener("click", () => { screen = "verbMap"; render(); });
  const questions = getVerbPracticeQuestions(session.journeyId);
  const tense = getVerbJourney(session.journeyId)?.targetForms[0] ?? "VTT";
  const coreNumber = Math.min(session.coreIndex + 1, questions.length);
  wrapper.append(back, text(isRepair ? "Repair · up to 2 questions" : `${tense} practice · decision ${coreNumber} of ${questions.length}`, "journey-meta"), eyebrow(isRepair ? "Targeted repair" : "Five-question practice"), heading(question.prompt), text(question.context, "verb-practice-context"));
  wrapper.append(renderVerbPracticeControls(question, session));
  if (session.checked && session.lastResult) {
    const status = text(session.lastResult.correct ? `Correct. ${session.lastResult.feedback}` : `Try again. ${session.lastResult.feedback}`, `verb-practice-feedback ${session.lastResult.correct ? "correct" : "incorrect"}`);
    status.setAttribute("role", "status");
    wrapper.append(status);
    if (!session.lastResult.correct) {
      const retry = button("Try again", "button secondary-button");
      retry.addEventListener("click", () => {
        const emptyAnswer: VerbPracticeAnswer = question.kind === "token-slots" || question.kind === "token-order" ? [] : "";
        verbPracticeSession = { ...session, selectedAnswer: emptyAnswer, checked: false, lastResult: null };
        render();
        content?.focus();
      });
      wrapper.append(retry);
    }
    const lastCoreQuestion = session.coreIndex === questions.length - 1 && question.phase === "core";
    const next = button(session.lastResult.correct && lastCoreQuestion ? "See completion" : "Continue", "button primary-button");
    next.addEventListener("click", () => {
      verbPracticeSession = advanceVerbPractice(session);
      if (verbPracticeSession.completed) screen = "verbCompletion";
      render();
      content?.focus();
    });
    wrapper.append(next);
  }
  return wrapper;
}

function renderVerbPracticeControls(question: VerbPracticeQuestion & { phase: "core" | "repair" }, session: VerbPracticeSession): HTMLElement {
  const wrapper = section("verb-practice-controls");
  const selected = session.selectedAnswer;
  if (question.kind === "token-slots" || question.kind === "token-order") {
    const selectedTokens = Array.isArray(selected) ? selected : selected ? selected.split(" ") : [];
    const answer = section("verb-answer-slots"); answer.setAttribute("aria-live", "polite");
    if (selectedTokens.length === 0) answer.append(text("Choose words in order.", "verb-answer-placeholder"));
    for (const [index, token] of selectedTokens.entries()) {
      const remove = button(token, "verb-token-selected"); remove.setAttribute("aria-label", `Remove ${token} from answer`); remove.addEventListener("click", () => { const next = selectedTokens.filter((_candidate, tokenIndex) => tokenIndex !== index); verbPracticeSession = { ...session, selectedAnswer: next, checked: false, lastResult: null }; render(); }); answer.append(remove);
    }
    const available = section("verb-token-choices"); available.setAttribute("aria-label", "Available words");
    for (const token of question.tokens ?? []) {
      const used = areAllTokenCopiesSelected(selectedTokens, question.tokens ?? [], token);
      const choice = button(token, `button verb-token-choice${used ? " is-used" : ""}`); choice.disabled = used || session.checked; choice.setAttribute("aria-pressed", String(used));
      choice.addEventListener("click", () => { const next = [...selectedTokens, token]; verbPracticeSession = { ...session, selectedAnswer: next, checked: false, lastResult: null }; render(); }); available.append(choice);
    }
    const reset = button("Reset", "button secondary-button verb-reset"); reset.disabled = session.checked || selectedTokens.length === 0; reset.addEventListener("click", () => { verbPracticeSession = { ...session, selectedAnswer: [], checked: false, lastResult: null }; render(); });
    wrapper.append(answer, available, reset);
  } else {
    const choices = section(`verb-practice-choices ${question.kind === "map-placement" ? "map-placement-choices" : ""}`);
    for (const choice of question.choices ?? []) {
      const action = button(choice, `button${selected === choice ? " is-selected" : ""}`); action.setAttribute("aria-pressed", String(selected === choice)); action.disabled = session.checked;
      action.addEventListener("click", () => { verbPracticeSession = { ...session, selectedAnswer: choice, checked: false, lastResult: null }; render(); }); choices.append(action);
    }
    wrapper.append(choices);
  }
  const answer = session.selectedAnswer;
  const hasAnswer = Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
  const check = button("Check answer", "button primary-button"); check.disabled = session.checked || !hasAnswer;
  check.addEventListener("click", () => {
    if (session.selectedAnswer === null) return;
    const checked = checkVerbPracticeAnswer(session, session.selectedAnswer);
    verbPracticeSession = checked.session;
    queueVerbJourneyResult(question, checked.result.correct);
    render();
  });
  wrapper.append(check);
  return wrapper;
}

function areAllTokenCopiesSelected(selectedTokens: string[], availableTokens: string[], token: string): boolean {
  const selectedCount = selectedTokens.filter((candidate) => candidate === token).length;
  const availableCount = availableTokens.filter((candidate) => candidate === token).length;
  return selectedCount >= availableCount;
}

function queueVerbJourneyResult(question: VerbPracticeQuestion & { phase: "core" | "repair" }, correct: boolean): void {
  verbJourneySaveChain = verbJourneySaveChain.then(async () => {
    try {
      verbJourneyRecord = await learningClient.recordVerbJourneyResult({
        verbId: question.verbId,
        formOrSkillId: question.formOrSkillId,
        exerciseFamily: question.exerciseFamily,
        exerciseId: question.id,
        contentVersion: getVerbJourneyContentVersion(question.verbId) ?? "015-1",
        result: correct ? "correct" : "incorrect",
        ...(question.delayedOrRecombined ? { delayedOrRecombined: true } : {}),
        expectedEvidenceRevision: verbJourneyRecord?.evidenceRevision ?? 0,
      });
    } catch {
      // Practice feedback remains usable when persistence is unavailable.
      await refreshVerbJourneyRecord();
    }
  }).catch(() => undefined);
}

async function refreshVerbJourneyRecord(): Promise<void> {
  try { verbJourneyRecord = await learningClient.getVerbJourneyRecord(); } catch { /* The existing in-memory record remains usable. */ }
}

function renderVerbCompletion(): HTMLElement {
  const wrapper = section("verb-completion-screen");
  const session = verbPracticeSession ?? createVerbPracticeSession();
  const pack = getActiveVerbJourneyPack();
  const back = journeyBack(verbMapOrigin === "saved" ? "Saved" : pack.verb.lemma); back.addEventListener("click", () => { screen = verbMapOrigin === "saved" ? "saved" : "verbJourneyOverview"; render(); });
  const journey = getVerbJourney(session.journeyId);
  const tense = journey?.targetForms[0] ?? "VTT";
  const completionHeading = pack.verb.id === "verb.werken" && tense === "VTT" ? "You used werken as a completed event." : `You used ${pack.verb.lemma} with ${tense}.`;
  wrapper.append(back, eyebrow(`${tense} practised`), heading(completionHeading), text("This session reports demonstrated decisions; it does not claim full verb mastery.", "journey-lead"));
  const decisions = section("verb-completion-decisions");
  const latest = new Map(session.attempts.filter((attempt) => attempt.phase === "core").map((attempt) => [attempt.questionId, attempt]));
  for (const question of getVerbPracticeQuestions(session.journeyId)) {
    const result = latest.get(question.id);
    const row = document.createElement("div"); row.className = `verb-completion-row ${result?.correct ? "correct" : "needs-review"}`;
    const mark = document.createElement("span"); mark.className = "verb-completion-mark"; mark.textContent = result?.correct ? "✓" : "!";
    const copy = document.createElement("span"); copy.textContent = question.prompt;
    row.append(mark, copy); decisions.append(row);
  }
  wrapper.append(decisions);
  const needsReview = [...latest.values()].some((attempt) => !attempt.correct) || session.attempts.some((attempt) => attempt.phase === "repair" && !attempt.correct);
  const review = section("verb-next-review");
  review.append(text(needsReview ? "Review needs remain separate from journey completion." : "Five controlled decisions completed. Review status remains separate from journey completion.", "verb-card-copy"), text("Keep the form connected to its own journey context.", "verb-review-contrast"));
  if (tense === "VTT") {
    const contrast = button("Review the VTT · OVT contrast →", "button primary-button"); contrast.addEventListener("click", () => { verbNoticeDecision = null; screen = "verbJourneyNotice"; render(); });
    review.append(contrast);
  }
  wrapper.append(review);
  const returnToJourneys = button(`Back to ${pack.verb.lemma} journeys`, "button secondary-button");
  returnToJourneys.disabled = pending;
  returnToJourneys.addEventListener("click", () => void returnFromVerbCompletion());
  wrapper.append(returnToJourneys);
  return wrapper;
}

async function returnFromVerbCompletion(): Promise<void> {
  pending = true;
  render();
  await verbJourneySaveChain;
  await refreshVerbJourneyRecord();
  try { rhythm = await learningClient.recordVerbJourneyCompletion((verbPracticeSession ?? createVerbPracticeSession()).journeyId); } catch { /* Completion remains usable when persistence is unavailable. */ }
  screen = "verbJourneyOverview";
  pending = false;
  render();
  content?.focus();
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
  if (session.stage === "read" || session.stage === "replay") wrapper.append(session.lesson.practicalDutch ? renderPracticalDutchStory(session, session.stage === "read") : renderLessonStory(session, session.stage === "read"));
  if (session.stage === "notice") wrapper.append(session.lesson.practicalDutch ? renderPracticalDutchNotice(session) : renderLessonNotice(session));
  if (session.stage === "practise") wrapper.append(session.lesson.practicalDutch ? renderPracticalDutchExercise(session) : session.practiceIndex < session.lesson.practice.length ? renderLessonPractice(session) : renderLessonAuthoredExercise(session));
  if (session.stage === "keep") wrapper.append(renderLessonKeep(session));
  return wrapper;
}

function renderPracticalDutchStory(session: LessonSession, allowHelp: boolean): HTMLElement {
  const lesson = session.lesson.practicalDutch!;
  const story = section("lesson-story practical-dutch-story");
  story.append(eyebrow(session.stage === "read" ? "Read the situation" : "Replay"), heading(session.lesson.title));
  lesson.context.forEach((line, index) => {
    const row = section("story-line");
    row.append(text(line.nl, "story-dutch"));
    if (allowHelp && session.revealedLineIndexes.includes(index)) row.append(text(`English: ${line.en}`, "helper-copy"), text(`Telugu: ${line.te}`, "helper-copy"));
    else if (allowHelp) { const help = button("Show English and Telugu", "line-help"); help.addEventListener("click", () => { lessonSession = revealLessonLine(session, index); render(); }); row.append(help); }
    story.append(row);
  });
  const next = button(session.stage === "read" ? "Notice the pattern" : "Choose what to keep", "button primary-button");
  next.addEventListener("click", () => void advanceLesson(session));
  story.append(next);
  return story;
}

function renderPracticalDutchNotice(session: LessonSession): HTMLElement {
  const lesson = session.lesson.practicalDutch!;
  const panel = section("lesson-story practical-dutch-notice");
  panel.append(eyebrow("Notice the language"), heading(lesson.languageFocus.pattern.nl), text(lesson.languageFocus.explanation.en, "body-copy"), text(lesson.languageFocus.explanation.te, "helper-copy"));
  const sentences = section("practical-dutch-sentences");
  sentences.append(text("Useful sentences", "section-title"));
  for (const sentence of lesson.sentences) { const row = section("practical-dutch-sentence"); row.append(text(sentence.nl, "story-dutch"), text(`English: ${sentence.en}`, "helper-copy"), text(`Telugu: ${sentence.te}`, "helper-copy")); sentences.append(row); }
  const support = section("practical-dutch-support");
  support.append(text("Useful chunks", "section-title"));
  support.append(text(lesson.chunks.map((chunk) => `${chunk.nl} · ${chunk.en}`).join("\n"), "helper-copy"));
  support.append(text("Vocabulary", "section-title"));
  support.append(text(lesson.vocabulary.map((word) => `${word.nl} · ${word.en}`).join("\n"), "helper-copy"));
  panel.append(sentences, support);
  const next = button("Practise", "button primary-button"); next.addEventListener("click", () => void advanceLesson(session)); panel.append(next);
  return panel;
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
  const exercise = getLessonPracticeExercises(session)[session.authoredExerciseIndex];
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

function renderPracticalDutchExercise(session: LessonSession): HTMLElement {
  const lesson = session.lesson.practicalDutch!;
  const exercise = lesson.coreExercises[session.authoredExerciseIndex];
  const panel = section("practice-card practical-dutch-exercise");
  if (!exercise) return panel;
  panel.append(eyebrow(`Core practice · ${session.authoredExerciseIndex + 1} of ${lesson.coreExercises.length}`), heading(exercise.prompt.nl), text(`English: ${exercise.prompt.en}`, "helper-copy"), text(`Telugu: ${exercise.prompt.te}`, "helper-copy"), text(exercise.context.nl, "story-dutch"), text(`English: ${exercise.context.en}`, "helper-copy"), text(`Telugu: ${exercise.context.te}`, "helper-copy"));
  if (exercise.kind === "order" && exercise.tokens) {
    const answer = section("grammar-order-answer"); answer.setAttribute("aria-live", "polite"); answer.append(text(session.authoredTokens.length > 0 ? session.authoredTokens.join(" ") : "Choose tokens in order.", session.authoredTokens.length > 0 ? "" : "grammar-order-placeholder")); panel.append(answer);
    const choices = document.createElement("div"); choices.className = "grammar-choices grammar-token-choices";
    for (const token of exercise.tokens) { const selected = session.authoredTokens.includes(token); const action = button(token, `button grammar-token${selected ? " is-selected" : ""}`); action.setAttribute("aria-pressed", String(selected)); action.disabled = session.authoredChecked || pending; action.addEventListener("click", () => { lessonSession = toggleLessonPracticeExerciseToken(session, token); render(); }); choices.append(action); }
    panel.append(choices);
  } else {
    const choices = document.createElement("div"); choices.className = "grammar-choices practical-dutch-choices";
    for (const choice of exercise.choices) { const action = button(choice, `button${session.authoredAnswer === choice ? " is-selected" : ""}`); action.setAttribute("aria-pressed", String(session.authoredAnswer === choice)); action.disabled = session.authoredChecked || pending; action.addEventListener("click", () => { lessonSession = selectLessonPracticeExerciseAnswer(session, choice); render(); }); choices.append(action); }
    panel.append(choices);
  }
  if (session.authoredChecked) {
    const status = text(session.authoredResult === "correct" ? `Correct. ${exercise.feedback.en} ${exercise.feedback.te}` : `Not yet. ${exercise.feedback.en}`, "grammar-feedback"); status.setAttribute("role", "status"); panel.append(status);
    if (session.authoredResult === "incorrect") { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", () => { lessonSession = { ...session, authoredAnswer: null, authoredTokens: [], authoredChecked: false, authoredResult: null }; render(); }); panel.append(retry); }
  }
  const next = button(session.authoredResult === "correct" ? "Continue" : "Check answer", "button primary-button"); next.disabled = pending || (session.authoredResult !== "correct" && (session.authoredAnswer === null || (exercise.kind === "order" && session.authoredTokens.length === 0))); next.addEventListener("click", () => { if (session.authoredResult === "correct") void advanceLessonAuthoredExercise(session); else { lessonSession = checkLessonPracticeExercise(session); render(); } }); panel.append(next);
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
async function startLesson(lesson: Lesson): Promise<void> { const origin = screen === "today" ? "today" : screen === "saved" ? "saved" : screen === "practicalStories" ? "practicalStories" : "lessons"; try { let lessonProgress = await learningClient.getLessonProgress(lesson.id); if (!lessonProgress) lessonProgress = await learningClient.saveLessonProgress(lesson.id, "read"); grammarRecord = null; grammarPatternId = lesson.grammarCompanion?.patternId ?? null; contrastRecord = null; contrastExerciseIndex = 0; contrastOffer = null; activeGrammarTask = null; activeContrastTask = null; grammarAnswer = null; grammarTokens = []; grammarFeedback = null; grammarChecked = false; grammarOutcome = null; grammarRetrying = false; lessonProgressById = { ...lessonProgressById, [lesson.id]: lessonProgress }; lessonSession = resumeLessonSession(lesson, lessonProgress); focusedOrigin = origin; screen = "lesson"; render(); content?.focus(); } catch (error) { lessonsError = error instanceof Error ? error.message : "This lesson is unavailable."; focusedOrigin = null; screen = origin === "today" ? "today" : origin === "practicalStories" ? "practicalStories" : "lessons"; render(); } }
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
  if (activeVerbDailyFiveTask) return renderVerbJourneyDailyFiveReview(activeVerbDailyFiveTask);
  if (task && "kind" in task) { if (task.kind === "contrast") { activeContrastTask = task; return renderContrastDailyFiveReview(task); } if (task.kind === "verb") { activeVerbDailyFiveTask = task; return renderVerbJourneyDailyFiveReview(task); } activeGrammarTask = task; return renderGrammarReview(task); }
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

function renderVerbJourneyDailyFiveReview(task: VerbJourneyDailyFiveTask): HTMLElement {
  const question = getVerbPracticeQuestion(task.exerciseId);
  const wrapper = section("practice-content focused-content verb-daily-five-review");
  if (!question || question.exerciseFamily !== task.exerciseFamily) { wrapper.append(button("Exit review", "exit-button"), heading("Verb Journey review is unavailable.")); return wrapper; }
  const exit = button("Exit review", "exit-button"); exit.addEventListener("click", () => { activeVerbDailyFiveTask = null; screen = focusedOrigin ?? "today"; focusedOrigin = null; render(); });
  wrapper.append(exit, eyebrow("Daily Five · Verb Journey"), heading(`${getVerbJourneyPack(task.verbId)?.verb.lemma ?? "verb"} · ${getVerbReviewTense(task)}`), text("Review one weak skill with a short authored decision.", "grammar-capability"), text(question.prompt, "verb-practice-context"), text(question.context, "story-dutch"));
  const controls = section("verb-daily-five-controls");
  const selected = verbDailyFiveAnswer;
  if (question.kind === "token-slots" || question.kind === "token-order") {
    const selectedTokens = Array.isArray(selected) ? selected : selected ? selected.split(" ") : [];
    const answer = section("verb-answer-slots");
    if (selectedTokens.length === 0) answer.append(text("Choose words in order.", "verb-answer-placeholder"));
    for (const [index, token] of selectedTokens.entries()) { const remove = button(token, "verb-token-selected"); remove.disabled = verbDailyFiveChecked || pending; remove.addEventListener("click", () => { verbDailyFiveAnswer = selectedTokens.filter((_candidate, tokenIndex) => tokenIndex !== index); render(); }); answer.append(remove); }
    const available = section("verb-token-choices");
    for (const token of question.tokens ?? []) { const used = areAllTokenCopiesSelected(selectedTokens, question.tokens ?? [], token); const action = button(token, `button verb-token-choice${used ? " is-used" : ""}`); action.disabled = used || verbDailyFiveChecked || pending; action.addEventListener("click", () => { verbDailyFiveAnswer = [...selectedTokens, token]; render(); }); available.append(action); }
    const reset = button("Reset", "button secondary-button verb-reset"); reset.disabled = verbDailyFiveChecked || pending || selectedTokens.length === 0; reset.addEventListener("click", () => { verbDailyFiveAnswer = []; render(); });
    controls.append(answer, available, reset);
  } else {
    const choices = section(`verb-practice-choices ${question.kind === "map-placement" ? "map-placement-choices" : ""}`);
    for (const choice of question.choices ?? []) { const action = button(choice, `button${selected === choice ? " is-selected" : ""}`); action.disabled = verbDailyFiveChecked || pending; action.setAttribute("aria-pressed", String(selected === choice)); action.addEventListener("click", () => { verbDailyFiveAnswer = choice; render(); }); choices.append(action); }
    controls.append(choices);
  }
  wrapper.append(controls);
  if (verbDailyFiveFeedback) { const status = text(verbDailyFiveFeedback.message, `verb-practice-feedback ${verbDailyFiveFeedback.correct ? "correct" : "incorrect"}`); status.setAttribute("role", "status"); wrapper.append(status); }
  const answer = verbDailyFiveAnswer;
  const hasAnswer = Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
  if (!verbDailyFiveChecked) { const check = button("Check answer", "button primary-button"); check.disabled = !hasAnswer || pending; check.addEventListener("click", () => void checkVerbJourneyDailyFiveAnswer(task, question)); wrapper.append(check); }
  else {
    if (verbDailyFiveFeedback && !verbDailyFiveFeedback.correct) { const retry = button("Try again", "button"); retry.disabled = pending; retry.addEventListener("click", () => { verbDailyFiveRetrying = true; verbDailyFiveAnswer = null; verbDailyFiveFeedback = null; verbDailyFiveChecked = false; render(); }); wrapper.append(retry); }
    const next = button("Continue", "button primary-button"); next.disabled = pending; next.addEventListener("click", continueVerbJourneyDailyFiveReview); wrapper.append(next);
  }
  return wrapper;
}

async function checkVerbJourneyDailyFiveAnswer(task: VerbJourneyDailyFiveTask, question: VerbPracticeQuestion & { phase: "core" | "repair" }): Promise<void> {
  if (verbDailyFiveAnswer === null || verbDailyFiveChecked || pending) return;
  const result = checkVerbPracticeQuestion(question, verbDailyFiveAnswer);
  verbDailyFiveFeedback = { correct: result.correct, message: result.feedback };
  verbDailyFiveChecked = true;
  pending = true;
  render();
  try {
    if (!verbDailyFiveRetrying) {
      const saved = await learningClient.recordVerbJourneyDailyFiveResult(task, result.correct ? "correct" : "incorrect", verbJourneyRecord?.evidenceRevision ?? 0);
      verbJourneyRecord = saved.verbJourneys;
      snapshot = saved.snapshot;
    }
  } catch (error) {
    verbDailyFiveFeedback = { correct: false, message: error instanceof Error ? error.message : "Verb Journey result could not be saved." };
  } finally { pending = false; render(); }
}

function continueVerbJourneyDailyFiveReview(): void {
  activeVerbDailyFiveTask = null; verbDailyFiveAnswer = null; verbDailyFiveFeedback = null; verbDailyFiveChecked = false; verbDailyFiveRetrying = false;
  if (!snapshot || snapshot.goalCompleted) { screen = focusedOrigin ?? "today"; focusedOrigin = null; }
  render();
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
type IconName = "arrow-left" | "book-open" | "check-circle" | "chevron-right" | "clock" | "dot" | "reference" | "route";

const iconPaths: Record<IconName, string> = {
  "arrow-left": "M5 12h14M5 12l6-6M5 12l6 6",
  "book-open": "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Zm0 0V19",
  "check-circle": "m8 12 2.5 2.5L16 9m5 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  "chevron-right": "m9 5 7 7-7 7",
  clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  dot: "M12 12h.01",
  reference: "M6 4.5A2.5 2.5 0 0 1 8.5 2H18v19l-5-3-5 3V4.5Z",
  route: "M5 5h4v4H5zM15 15h4v4h-4zM9 7h5a3 3 0 0 1 3 3v5M15 17h-5a3 3 0 0 1-3-3V9",
};

function svgIcon(name: IconName, className = "icon"): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(className, "icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconPaths[name]);
  svg.append(path);
  return svg;
}

function journeyBack(label: string): HTMLButtonElement {
  const back = button(label, "journey-back");
  back.setAttribute("aria-label", `Back to ${label}`);
  back.prepend(svgIcon("arrow-left", "journey-back-icon"));
  return back;
}

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
function renderVerbNoticeSentence(sentence: string, tense: DutchTense, verbId = "verb.werken"): HTMLElement {
  const element = text("", "verb-pattern-sentence");
  element.lang = "nl";
  appendVerbNoticeHighlights(element, sentence, verbNoticeTokens(tense, verbId));
  return element;
}

function renderVerbNoticeFormula(formula: string, verbId = "verb.werken"): HTMLElement {
  const element = text("", "verb-formula");
  appendVerbNoticeHighlights(element, formula, verbNoticeFormulaTokens(verbId));
  return element;
}

function verbNoticeFormulaTokens(verbId = "verb.werken"): string[] {
  const pack = getVerbJourneyPack(verbId) ?? verbJourneyPack;
  return [...new Set(pack.dutchForms.flatMap(({ dutchTense }) => verbNoticeTokens(dutchTense, verbId)))];
}

function appendVerbNoticeHighlights(parent: HTMLElement, value: string, tokens: string[]): void {
  appendTokenHighlights(parent, value, tokens, "verb-notice-highlight");
}

function appendTokenHighlights(parent: HTMLElement, value: string, tokens: string[], className: string): void {
  const orderedTokens = [...new Set(tokens)].sort((first, second) => second.length - first.length);
  let cursor = 0;
  while (cursor < value.length) {
    const match = orderedTokens
      .map((token) => ({ token, index: findVerbNoticeToken(value, token, cursor) }))
      .filter((candidate) => candidate.index >= cursor)
      .sort((first, second) => first.index - second.index || second.token.length - first.token.length)[0];
    if (!match) { parent.append(value.slice(cursor)); break; }
    parent.append(value.slice(cursor, match.index));
    const highlight = document.createElement("mark");
    highlight.className = className;
    highlight.textContent = value.slice(match.index, match.index + match.token.length);
    parent.append(highlight);
    cursor = match.index + match.token.length;
  }
}

function findVerbNoticeToken(value: string, token: string, from: number): number {
  const lowerValue = value.toLocaleLowerCase();
  const lowerToken = token.toLocaleLowerCase();
  let index = lowerValue.indexOf(lowerToken, from);
  while (index >= 0) {
    const before = value[index - 1];
    const after = value[index + token.length];
    const isLetter = (character: string | undefined) => character !== undefined && /\p{L}/u.test(character);
    if (!isLetter(before) && !isLetter(after)) return index;
    index = lowerValue.indexOf(lowerToken, index + lowerToken.length);
  }
  return -1;
}

function verbNoticeTokens(tense: DutchTense, verbId = "verb.werken"): string[] {
  if (verbId === "verb.zijn") {
    return {
      OTT: ["ben", "bent", "is", "zijn"],
      OVT: ["was", "waren"],
      VTT: ["ben", "is", "geweest"],
      VVT: ["was", "geweest"],
      OTTT: ["zal", "zijn"],
      OVTT: ["zou", "zijn"],
      VTTT: ["zal", "geweest", "zijn"],
      VVTT: ["zou", "geweest", "zijn"],
    }[tense];
  }
  if (verbId === "verb.hebben") {
    return {
      OTT: ["heb", "hebt", "heeft", "hebben"],
      OVT: ["had", "hadden"],
      VTT: ["heb", "hebt", "heeft", "hebben", "gehad"],
      VVT: ["had", "hadden", "gehad"],
      OTTT: ["zal", "hebben"],
      OVTT: ["zou", "hebben"],
      VTTT: ["zal", "gehad", "hebben"],
      VVTT: ["zou", "gehad", "hebben"],
    }[tense];
  }
  if (verbId === "verb.gaan") {
    return {
      OTT: ["ga", "gaat", "gaan"],
      OVT: ["ging", "gingen"],
      VTT: ["ben", "is", "zijn", "gegaan"],
      VVT: ["was", "waren", "gegaan"],
      OTTT: ["zal", "gaan"],
      OVTT: ["zou", "gaan"],
      VTTT: ["zal", "gegaan", "zijn"],
      VVTT: ["zou", "gegaan", "zijn"],
    }[tense];
  }
  return {
    OTT: ["werk"],
    OVT: ["werkte"],
    VTT: ["heb", "gewerkt"],
    VVT: ["had", "gewerkt"],
    OTTT: ["zal", "werken"],
    OVTT: ["zou", "werken"],
    VTTT: ["zal", "gewerkt", "hebben"],
    VVTT: ["zou", "gewerkt", "hebben"],
  }[tense];
}

function verbFormStatusMeta(status: JourneyStatus): { label: string; detail: string; symbol: "✓" | "›" | "○" } {
  if (status === "mastered") return { label: "Mastered", detail: "ready to use", symbol: "✓" };
  if (status === "learning") return { label: "Learning now", detail: "current focus", symbol: "›" };
  if (status === "reference") return { label: "Reference", detail: "look up when useful", symbol: "○" };
  if (status === "next") return { label: "Next", detail: "next useful form", symbol: "›" };
  return { label: "Later", detail: "future journey", symbol: "○" };
}

function verbMapViewpointMeta(viewpoint: "present" | "past" | "future" | "future-from-past"): { english: string; dutch: string } {
  return {
    present: { english: "Present", dutch: "Tegenwoordige Tijd" },
    past: { english: "Past", dutch: "Verleden Tijd" },
    future: { english: "Future from present", dutch: "Tegenwoordige Toekomende Tijd" },
    "future-from-past": { english: "Future from past", dutch: "Verleden Toekomende Tijd" },
  }[viewpoint];
}

function renderVerbMapHeaderLabel(value: string, className: string): HTMLElement {
  const label = document.createElement("span"); label.className = className;
  for (const part of value.split(/(\s+)/u)) {
    if (/^\s+$/u.test(part)) label.append(document.createTextNode(part));
    else if (part) label.append(spanText(part.charAt(0), "verb-map-initial"), document.createTextNode(part.slice(1)));
  }
  return label;
}

function renderVerbTenseCode(value: string): HTMLElement {
  const code = document.createElement("span"); code.className = "verb-form-code";
  for (const letter of value) code.append(spanText(letter, "verb-map-code-letter"));
  return code;
}

function highlightedPattern(value: string): HTMLElement { const mark = document.createElement("mark"); mark.className = "pattern-highlight"; mark.textContent = value; return mark; }
function toggle(labelText: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement { const label = document.createElement("label"); label.className = "setting-control"; const textNode = document.createElement("strong"); textNode.textContent = labelText; const input = document.createElement("input"); input.type = "checkbox"; input.checked = checked; input.addEventListener("change", () => onChange(input.checked)); label.append(textNode, input); return label; }
function localNote(): HTMLElement { return text("Local learning only. No account required.", "local-note"); }
