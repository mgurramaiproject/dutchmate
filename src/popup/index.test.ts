// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSettings } from "../shared/settings";
import { createVerbJourneyRecord, recordVerbJourneyEvidence, type VerbJourneyRecord } from "../verb-journeys/learning";

const { runtime, storageChangeListeners } = vi.hoisted(() => ({ runtime: { sendMessage: vi.fn(), openOptionsPage: vi.fn() }, storageChangeListeners: new Set<(changes: Record<string, unknown>, areaName: string) => void>() }));

vi.mock("webextension-polyfill", () => ({
  default: { runtime, storage: { sync: { get: vi.fn() }, onChanged: { addListener: vi.fn((listener) => storageChangeListeners.add(listener)) } } },
}));

describe("lesson popup", () => {
  let progressByLesson: Record<string, Record<string, unknown> | null>;
  let keepFails: boolean;
  let listFails: boolean;
  let importFails: boolean;
  let exportFails: boolean;
  let quizFails: boolean;
  let forceEmptyDailyFive: boolean;
  let popupSettings: typeof defaultSettings;
  let learningItems: Array<Record<string, unknown>>;
  let verbJourneyRevision: number;
  let verbJourneyRecordFixture: VerbJourneyRecord;
  let rhythmResponse: { week: Array<{ dayStartAt: number; status: "active" | "grace" | "idle" }>; activity: Array<{ dayStartAt: number; reviews: number | null; saved: number | null; lessons: number | null; lessonAdditions?: number }>; resetCopy: string | null; milestones: Array<{ id: string; label: string }> };

  beforeEach(async () => {
    vi.resetModules();
    storageChangeListeners.clear();
    progressByLesson = {};
    keepFails = false;
    listFails = false;
    importFails = false;
    exportFails = false;
    quizFails = false;
    forceEmptyDailyFive = false;
    popupSettings = { ...defaultSettings };
    rhythmResponse = rhythmFixture();
    const dailyItem = { id: "daily-item", learningLanguage: "nl", normalizedDutch: "huis", dutch: "huis", kind: "word", english: "house", telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1 };
    learningItems = [dailyItem, { ...dailyItem, id: "saved-item", normalizedDutch: "zebra", dutch: "zebra", english: null, telugu: "జీబ్రా", sources: [{ type: "webpage", addedAt: 2 }], contexts: [{ text: "De zebra staat bij de ingang.", addedAt: 2 }], createdAt: 2, updatedAt: 2, recognition: { ...dailyItem.recognition, state: "strong", attemptCount: 3 }, recall: { ...dailyItem.recall, state: "familiar", attemptCount: 2 } }];
    verbJourneyRevision = 0;
    verbJourneyRecordFixture = createVerbJourneyRecord();
    runtime.sendMessage.mockImplementation(async (message: { type: string; payload?: Record<string, unknown> }) => {
      if (message.type === "dutchmate.learning.list") return listFails ? { ok: false, error: "Local read failed" } : { ok: true, result: { items: learningItems } };
      if (message.type === "dutchmate.learning.export") return exportFails ? { ok: false, error: "Local export failed." } : { ok: true, result: { backup: { format: "dutchmate-learning-backup", version: 2, exportedAt: 1, learningItems, lessonProgress: {}, rhythm: {} } } };
      if (message.type === "dutchmate.learning.import") {
        if (importFails) return { ok: false, error: "This backup is not supported." };
        learningItems = [...learningItems, { ...learningItems[0], id: "imported-item", normalizedDutch: "fiets", dutch: "fiets", createdAt: 3, updatedAt: 3 }];
        return { ok: true, result: { importedCount: 1, totalCount: learningItems.length, items: learningItems } };
      }
      if (message.type === "dutchmate.learning.removeContext") {
        const itemId = String(message.payload?.itemId);
        const target = message.payload?.context as { text: string; addedAt: number; sourceLanguage?: string };
        learningItems = learningItems.map((item) => item.id === itemId ? { ...item, contexts: (item.contexts as Array<{ text: string; addedAt: number; sourceLanguage?: string }>).filter((context) => !(context.text === target.text && context.addedAt === target.addedAt && context.sourceLanguage === target.sourceLanguage)) } : item);
        return { ok: true, result: { item: learningItems.find((item) => item.id === itemId) } };
      }
      if (message.type === "dutchmate.learning.rhythm") return { ok: true, result: { rhythm: rhythmResponse } };
      if (message.type === "dutchmate.learning.dailyFive") {
        const emptyContinuation = message.payload?.continueAfterCompletion === true && (learningItems.length === 0 || forceEmptyDailyFive);
        const verbContinuation = message.payload?.continueAfterCompletion === true && verbJourneyRevision > 0;
        return { ok: true, result: { snapshot: { createdAt: 1, dayStartAt: 0, tasks: emptyContinuation ? [] : verbContinuation ? [{ kind: "verb", verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", contentVersion: "015-1", exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning" }] : [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [], goalCompleted: false } } };
      }
      if (message.type === "dutchmate.learning.dailyFive.result") {
        const item = learningItems.find((candidate) => candidate.id === message.payload?.itemId)!;
        const dimension = message.payload?.dimension as "recognition" | "recall";
        return { ok: true, result: { item: { ...item, [dimension]: { ...(item[dimension] as Record<string, unknown>), dueAt: Date.now() + 86_400_000 } }, snapshot: { createdAt: 1, dayStartAt: 0, tasks: [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [`${dailyItem.id}\u001frecognition`], goalCompleted: true } } };
      }
      if (message.type === "dutchmate.learning.grammar" || message.type === "dutchmate.learning.grammar.introduce") {
        const patternId = String(message.payload?.patternId ?? "a0-zijn-present");
        return { ok: true, result: { grammar: message.type.endsWith("introduce") ? { patternId, contentVersion: 1, state: "introduced", introducedAt: 1, lastPractisedAt: null, dueAt: 2, intervalDays: 0, successfulEvidenceCount: 0, successfulExerciseIds: [], primitives: [], contextTags: [], recentExerciseIds: [], recentSuccessfulDays: [], delayedEvidence: false, misconceptionCounts: {}, evidenceRevision: 0, updatedAt: 1 } : null } };
      }
      if (message.type === "dutchmate.learning.grammar.result") return { ok: true, result: { grammar: { patternId: String(message.payload?.patternId), contentVersion: 1, state: "practising", introducedAt: 1, lastPractisedAt: 1, dueAt: 2, intervalDays: 1, successfulEvidenceCount: 1, successfulExerciseIds: [String(message.payload?.exerciseId)], primitives: ["choose-form"], contextTags: ["needs"], recentExerciseIds: [String(message.payload?.exerciseId)], recentSuccessfulDays: [1], delayedEvidence: false, misconceptionCounts: {}, evidenceRevision: 1, updatedAt: 1 } } };
      if (message.type === "dutchmate.learning.contrast" || message.type === "dutchmate.learning.contrast.introduce") return { ok: true, result: { contrast: message.type.endsWith("introduce") ? { packId: "contrast.main_clause_inversion", contentVersion: 1, state: "introduced", introducedAt: 1, lastPractisedAt: null, successfulExerciseIds: [], recentExerciseIds: [], misconceptionCounts: {}, evidenceRevision: 0, updatedAt: 1 } : null } };
      if (message.type === "dutchmate.learning.contrast.result") return { ok: true, result: { contrast: { packId: "contrast.main_clause_inversion", contentVersion: 1, state: "practising", introducedAt: 1, lastPractisedAt: 1, successfulExerciseIds: [String(message.payload?.exerciseId)], recentExerciseIds: [String(message.payload?.exerciseId)], misconceptionCounts: message.payload?.answer === "ik werk" || message.payload?.answer === "Morgen ik werk thuis." ? { MAIN_CLAUSE_NO_INVERSION: 1 } : {}, evidenceRevision: 1, updatedAt: 1 }, repairOffer: message.payload?.answer === "ik werk" || message.payload?.answer === "Morgen ik werk thuis." ? { code: "MAIN_CLAUSE_NO_INVERSION", packId: "contrast.main_clause_inversion", contentVersion: 1, label: "Practise this contrast (1 min)" } : null } };
      if (message.type === "dutchmate.learning.verbJourney") return { ok: true, result: { verbJourneys: verbJourneyRecordFixture } };
      if (message.type === "dutchmate.learning.verbJourney.result") {
        const payload = message.payload ?? {};
        verbJourneyRecordFixture = recordVerbJourneyEvidence(verbJourneyRecordFixture, {
          verbId: String(payload.verbId) as "verb.werken",
          formOrSkillId: String(payload.formOrSkillId) as "skill.werken.ott-routine" | "skill.werken.vtt-completed" | "skill.werken.ovt-background",
          exerciseFamily: String(payload.exerciseFamily),
          exerciseId: String(payload.exerciseId),
          contentVersion: "015-1",
          result: payload.result === "correct" ? "correct" : "incorrect",
          delayedOrRecombined: payload.delayedOrRecombined === true,
          expectedEvidenceRevision: verbJourneyRecordFixture.evidenceRevision,
        }, Date.now());
        verbJourneyRevision = verbJourneyRecordFixture.evidenceRevision;
        return { ok: true, result: { verbJourneys: verbJourneyRecordFixture } };
      }
      if (message.type === "dutchmate.learning.verbJourney.dailyFive.result") return { ok: true, result: { verbJourneys: { contentVersion: "015-1", evidenceRevision: ++verbJourneyRevision, skills: {} }, snapshot: { createdAt: 1, dayStartAt: 0, tasks: [message.payload?.task], completedTaskIds: ["verb-task"], goalCompleted: true } } };
      if (message.type === "dutchmate.learning.recordMissionResult") {
        if (quizFails) return { ok: false, error: "Quiz result could not be saved." };
        const item = learningItems.find((candidate) => candidate.id === message.payload?.itemId)!;
        const dimension = message.payload?.dimension as "recognition" | "recall";
        const updated = { ...item, [dimension]: { ...(item[dimension] as Record<string, unknown>), attemptCount: Number((item[dimension] as Record<string, unknown>).attemptCount ?? 0) + 1 } };
        learningItems = learningItems.map((candidate) => candidate.id === updated.id ? updated : candidate);
        return { ok: true, result: { item: updated } };
      }
      if (message.type === "dutchmate.review.settings") return { ok: true, result: { settings: popupSettings } };
      if (message.type === "dutchmate.review.settings.update") {
        popupSettings = { ...popupSettings, ...(message.payload as Partial<typeof defaultSettings>) };
        return { ok: true, result: { settings: popupSettings } };
      }
      if (message.type === "dutchmate.learning.lessonProgress") return { ok: true, result: { progress: progressByLesson[String(message.payload?.lessonId)] ?? null } };
      if (message.type === "dutchmate.learning.lessonProgress.save") {
        const lessonId = String(message.payload?.lessonId);
        const progress = { lessonId, contentVersion: 1, stage: message.payload?.stage, completedAt: null, keptCandidateIds: [], updatedAt: 1 };
        progressByLesson[lessonId] = progress;
        return { ok: true, result: { progress } };
      }
      if (message.type === "dutchmate.learning.keepLessonCandidates") {
        if (keepFails) return { ok: false, error: "Lesson candidates could not be kept." };
        const lessonId = String(message.payload?.lessonId);
        progressByLesson[lessonId] = { lessonId, contentVersion: 1, stage: "keep", completedAt: 1, keptCandidateIds: message.payload?.candidateIds ?? [], updatedAt: 1 };
        return { ok: true, result: { items: [] } };
      }
      throw new Error(`Unexpected message: ${message.type}`);
    });
    document.body.innerHTML = `
      <main class="popup-shell">
        <header class="popup-header"><div class="header-actions"><span id="due-badge"></span><a class="feedback-link" href="https://forms.gle/9KSsqfE1NNZcPEaaA">Feedback</a><button id="settings-button" type="button">Settings</button></div></header>
        <nav id="primary-navigation" role="tablist" aria-label="Learning areas"><button id="today-tab" type="button" role="tab" aria-selected="true" tabindex="0">Today</button><button id="lessons-tab" type="button" role="tab" aria-selected="false" tabindex="-1">Lessons</button><button id="saved-tab" type="button" role="tab" aria-selected="false" tabindex="-1">Saved</button></nav>
        <div id="popup-content" tabindex="0" role="tabpanel" aria-labelledby="today-tab" aria-live="polite"></div>
      </main>`;
    await import("./index");
    await vi.waitFor(() => expect(content().textContent).toContain("Start your Daily Five."));
  });

  it("renders the appointment lesson through read, notice, practise, replay, selection, keep, and exit", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));

    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    expect(document.activeElement).toBe(content());
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(true);
    expect(content().classList.contains("lesson-panel")).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#lessons-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#lessons-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(true);
    expect(document.querySelector("#settings-button")?.hasAttribute("hidden")).toBe(true);

    button("Show line help").click();
    await vi.waitFor(() => expect(content().textContent).toContain("English: Receptionist: Good morning. How can I help you?"));
    expect(content().querySelectorAll(".story-line .helper-copy")).toHaveLength(2);
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Morgen werk ik thuis."));
    button("werk").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy());
    button("Continue to next contrast").click();
    await vi.waitFor(() => expect(button("Morgen werk ik thuis.")).toBeTruthy());
    button("Morgen werk ik thuis.").click();
    expect(button("Morgen werk ik thuis.").classList.contains("is-selected")).toBe(true);
    expect(button("Morgen werk ik thuis.").getAttribute("aria-pressed")).toBe("true");
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy());
    button("Continue to next contrast").click();
    await vi.waitFor(() => expect(button("Morgen")).toBeTruthy());
    for (const token of ["Morgen", "maak", "ik", "een", "afspraak."]) button(token).click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    button("Continue to Practise").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());

    for (const [index, result] of ["Got it", "Again", "Got it"].entries()) {
      if (index === 0) expect(content().textContent).toContain("Telugu phonetic guide appears after reveal when helper text is available.");
      button("Show answer").click();
      if (index === 0) expect(content().querySelector(".telugu-phonetics")?.textContent).toContain("Say it:");
      await vi.waitFor(() => expect(button(result)).toBeTruthy());
      button(result).click();
      if (index < 2) await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    }

    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
    expect(content().querySelector<HTMLElement>(".lesson-stage.active")?.textContent).toBe("Practise");
    button("ik wil graag").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
    expect(content().querySelector(".lesson-authored-exercise")).toBeNull();
    expect(content().querySelector<HTMLElement>(".lesson-stage.active")?.textContent).toBe("Keep");
    const firstCandidate = content().querySelector<HTMLInputElement>(".candidate-choice input")!;
    firstCandidate.click();
    expect(button("Keep 3 for review")).toBeTruthy();
    button("Keep 3 for review").click();
    await vi.waitFor(() => expect(content().textContent).toContain("appointments and healthcare · Completed(A1)"));

    const replay = lessonCard("A1 · Een afspraak maken");
    expect(replay.textContent).toContain("Completed");
    replay.click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(false);
    expect(content().classList.contains("lesson-panel")).toBe(false);
  });

  it("gives the A1 healthcare symptom lesson reduced-support transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    lessonCard("A1 · Ik heb last van…").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
    button("Practise").click();
    for (let index = 0; index < 4; index += 1) {
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
      button("Got it").click();
    }
    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
    button("ik heb last van").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
    await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(lessonCard("A1 · Ik heb last van…")).toBeTruthy());
  });

  it("gives the A1 home, work, and study lessons reduced-support transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    for (const lesson of [
      { title: "A1 · Er is iets kapot", answer: "er is iets kapot" },
      { title: "A1 · Ik ben beschikbaar op…", answer: "ik ben beschikbaar" },
      { title: "A1 · Wat moet ik meenemen?", answer: "wat moet ik meenemen" },
    ]) {
      lessonCard(lesson.title).click();
      await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
      button("Notice the pattern").click();
      await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
      button("Practise").click();
      for (let index = 0; index < 4; index += 1) {
        await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
        button("Show answer").click();
        await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
        button("Got it").click();
      }
      await completeAdditionalLessonExercises();
      await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
      button(lesson.answer).click();
      button("Check answer").click();
      await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
      button("Choose what to keep").click();
      await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
      await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
      button("Exit lesson").click();
      await vi.waitFor(() => expect(lessonCard(lesson.title)).toBeTruthy());
    }
  });

  it("gives the A2 official-life lesson reduced-support transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    lessonCard("A2 · Wat staat er in deze brief?").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
    button("Practise").click();
    for (let index = 0; index < 4; index += 1) {
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
      button("Got it").click();
    }
    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
    button("wat staat er in deze brief").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
    await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(lessonCard("A2 · Wat staat er in deze brief?")).toBeTruthy());
  });

  it("offers immediate repair only for the controlled misconception and keeps Accept and Dismiss explicit", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("ik werk")).toBeTruthy());
    button("ik werk").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Practise this contrast (1 min)")).toBeTruthy());
    expect(content().querySelector('[role="status"]')?.textContent).toContain("finite verb");
    expect(runtime.sendMessage.mock.calls.at(-1)?.[0]).toMatchObject({ payload: { misconceptionCode: "MAIN_CLAUSE_NO_INVERSION" } });

    button("Practise this contrast (1 min)").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose the finite verb after Morgen."));
    expect(button("Check answer").disabled).toBe(true);

    button("werk").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy());
    button("Continue to next contrast").click();
    await vi.waitFor(() => expect(button("Morgen ik werk thuis.")).toBeTruthy());
    button("Morgen ik werk thuis.").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Practise this contrast (1 min)")).toBeTruthy());
    button("Continue").click();
    expect(button("Practise this contrast (1 min)")).toBeFalsy();
    expect(button("Try again")).toBeTruthy();
  });

  it("takes the hebben companion through Notice with visible Reveal and Skip controls", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik heb dit nodig"));
    lessonCard("A0 · Ik heb dit nodig").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    const introductionsBeforeNotice = runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.introduce").length;
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("Check answer")).toBeTruthy());
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.introduce")).toHaveLength(introductionsBeforeNotice);
    expect(button("Reveal")).toBeTruthy();
    expect(button("Skip")).toBeTruthy();
    button("Reveal").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.introduce")).toHaveLength(introductionsBeforeNotice + 1);
    await vi.waitFor(() => expect(button("Continue to Practise").disabled).toBe(false));
    expect(content().textContent).toContain("Answer: heb");
    button("Continue to Practise").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
  });

  it("does not introduce grammar before a resumed lesson reaches its encounter", async () => {
    progressByLesson["a0-ik-heb-dit-nodig"] = { lessonId: "a0-ik-heb-dit-nodig", contentVersion: 1, stage: "notice", completedAt: null, keptCandidateIds: [], updatedAt: 1 };
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik heb dit nodig"));
    const introductionsBeforeResume = runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.introduce").length;
    lessonCard("A0 · Ik heb dit nodig").click();
    await vi.waitFor(() => expect(button("Check answer")).toBeTruthy());
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.introduce")).toHaveLength(introductionsBeforeResume);
  });

  it("takes the regular-present companion into subject-first Notice practice", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik woon en werk hier"));
    lessonCard("A0 · Ik woon en werk hier").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik ___ in Utrecht."));
    expect(button("woon")).toBeTruthy();
    expect(button("woont")).toBeTruthy();
  });

  it("takes the inversion companion through keyboard-operable token ordering and correction before Check", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Woon je hier?"));
    lessonCard("A0 · Woon je hier?").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Je woont hier."));
    expect(button("Woon")).toBeTruthy();
    expect(button("je")).toBeTruthy();
    expect(button("hier?")).toBeTruthy();
    expect(button("Check answer").disabled).toBe(true);
    const grammarResultsBefore = runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result").length;
    button("je").click();
    expect(content().querySelector(".grammar-order-answer")?.textContent).toContain("je");
    button("je").click();
    expect(content().querySelector(".grammar-order-answer")?.textContent).not.toContain("je");
    button("Woon").click();
    button("je").click();
    button("hier?").click();
    expect(button("Check answer").disabled).toBe(false);
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result")).toHaveLength(grammarResultsBefore);
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    expect(content().textContent).toContain("Woon je hier?");
    expect(content().querySelector('[role="status"]')).toBeTruthy();
    expect([...content().querySelectorAll<HTMLButtonElement>(".grammar-choices button")].every((choice) => choice.hasAttribute("aria-pressed"))).toBe(true);
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result")).toHaveLength(grammarResultsBefore + 1);
  });

  it("allows a grammar retry without submitting a second result", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik heb dit nodig"));
    lessonCard("A0 · Ik heb dit nodig").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("hebt")).toBeTruthy());
    const grammarResultsBefore = runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result").length;
    button("hebt").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Try again")).toBeTruthy());
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result")).toHaveLength(grammarResultsBefore + 1);
    button("Try again").click();
    button("heb").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.grammar.result")).toHaveLength(grammarResultsBefore + 1);
  });

  it("keeps the mockup history controls and uses heatmaps for month and year", async () => {
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day")).toHaveLength(7));
    expect(content().querySelector(".insights")).toBeNull();
    expect(content().textContent).toContain("Practise five useful words. Start now.");
    expect(content().querySelector(".local-note")?.textContent).toBe("Local learning only. No account required.");
    expect(content().querySelector(".today-week")).toBeTruthy();
    expect(content().querySelector<HTMLElement>(".rhythm-day.grace")?.getAttribute("aria-label")).toContain("grace day");
    expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.tabIndex).toBe(0);
    expect(content().querySelector<HTMLButtonElement>(".period-tab.is-active")?.textContent).toBe("week");
    expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.getAttribute("aria-label")).toContain("3 reviews, 1 saved item, 1 lesson");
    expect(content().querySelector<HTMLElement>(".rhythm-day.active .activity-total")?.textContent).toBe("5");
    expect(content().querySelector<HTMLElement>(".rhythm-day.idle")?.getAttribute("aria-label")).toContain("0 reviews, 0 saved items, 0 lessons");
    expect(content().querySelector(".heatmap-legend")?.textContent).toContain("Less");
    expect(content().querySelector(".heatmap-legend")?.textContent).toContain("More");
    expect(content().querySelectorAll(".heatmap-legend .heatmap-swatch")).toHaveLength(4);
    const firstWeekDay = content().querySelector<HTMLElement>(".week-grid .rhythm-day")?.dataset.dayStart;
    expect(new Date(Number(firstWeekDay)).getDay()).toBe(1);
    const today = content().querySelector<HTMLElement>(".rhythm-day.is-today");
    expect(today).toBeTruthy();
    expect(today?.getAttribute("aria-label")).toContain("Today");
    expect(today?.title).toContain("Today");
    expect(button("This Week").getAttribute("aria-pressed")).toBe("true");
    content().querySelector<HTMLButtonElement>(".period-tabs button:nth-of-type(3)")!.click();
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day").length).toBeGreaterThanOrEqual(28));
    expect(content().querySelector(".heatmap-month")).toBeTruthy();
    expect(content().querySelector(".heatmap-month .rhythm-day.is-today")).toBeTruthy();
    expect(content().querySelector(".next-action")).toBeTruthy();
    expect(content().textContent).toContain("Practise five useful words. Start now.");
    expect(content().querySelectorAll(".month-weekdays span")).toHaveLength(7);
    expect([...content().querySelectorAll<HTMLElement>(".heatmap-month .heatmap-date")].some((date) => date.textContent === "1")).toBe(true);
    expect([...content().querySelectorAll<HTMLElement>(".heatmap-month .activity-total")].some((total) => total.textContent === "5")).toBe(true);
    expect(content().querySelector(".heatmap-legend")).toBeTruthy();
    expect(content().textContent).toContain("Totals use recorded activity; older lesson history may be unavailable.");
    const monthLabel = content().querySelector<HTMLElement>(".period-label")?.textContent;
    button("Previous period").click();
    await vi.waitFor(() => expect(content().querySelector<HTMLElement>(".period-label")?.textContent).not.toBe(monthLabel));
    content().querySelector<HTMLButtonElement>(".period-tabs button:nth-of-type(4)")!.click();
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day")).toHaveLength(365));
    expect(content().querySelector(".heatmap-year")).toBeTruthy();
    expect(content().querySelector(".heatmap-year .rhythm-day.is-today")).toBeTruthy();
    expect(content().querySelector(".next-action")).toBeTruthy();
    expect(content().querySelectorAll(".year-month-labels span")).toHaveLength(4);
  });

  it("keeps known legacy activity counts visible when lesson history was not recorded", async () => {
    rhythmResponse.activity[0] = { ...rhythmResponse.activity[0], lessons: null };
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");

    await vi.waitFor(() => expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.getAttribute("aria-label")).toContain("3 reviews, 1 saved item, lesson count unavailable"));
    expect(content().querySelector<HTMLElement>(".rhythm-day.active .activity-total")?.textContent).toBe("4");
  });

  it("shows a new lesson completed on a legacy activity day while explaining missing history", async () => {
    rhythmResponse.activity[0] = { ...rhythmResponse.activity[0], lessons: null, lessonAdditions: 1 };
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");

    await vi.waitFor(() => expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.getAttribute("aria-label")).toContain("1 new lesson; historical lesson count unavailable"));
    expect(content().querySelector<HTMLElement>(".rhythm-day.active .activity-total")?.textContent).toBe("5");
  });

  it("offers the external feedback form from the popup header", () => {
    expect(document.querySelector<HTMLAnchorElement>(".feedback-link")?.href).toBe("https://forms.gle/9KSsqfE1NNZcPEaaA");
  });

  it("explains the due-review counter on hover", async () => {
    learningItems = learningItems.map((item, index) => {
      if (index !== 1) return item;
      return { ...item, recognition: { ...(item.recognition as Record<string, unknown>), dueAt: 0 } };
    });
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.hidden).toBe(false));
    expect(document.querySelector<HTMLElement>("#due-badge")?.title).toBe("1 saved item still has one or more due recognition or recall reviews. Today shows up to five at a time.");
  });

  it("updates the due-review counter as soon as a review is saved", async () => {
    learningItems = learningItems.map((item, index) => {
      return { ...item, recognition: { ...(item.recognition as Record<string, unknown>), state: "learning", attemptCount: 1, dueAt: 0 } };
    });
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.hidden).toBe(false));
    expect(document.querySelector<HTMLElement>("#due-badge")?.textContent).toBe("2");

    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    expect(content().textContent).toContain("Telugu phonetic guide appears after reveal when helper text is available.");
    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    button("Got it").click();

    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.textContent).toBe("1"));
    expect(document.querySelector<HTMLElement>("#due-badge")?.hidden).toBe(false);
  });

  it("removes the popup due badge when Daily review badge is disabled", async () => {
    learningItems = learningItems.map((item) => ({
      ...item,
      recognition: { ...(item.recognition as Record<string, unknown>), state: "learning", attemptCount: 1, dueAt: 0 },
    }));
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.textContent).toBe("2"));

    document.querySelector<HTMLButtonElement>("#settings-button")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Review preferences"));
    const badgeToggle = content().querySelectorAll<HTMLInputElement>('.setting-control input[type="checkbox"]')[1];
    badgeToggle.checked = false;
    badgeToggle.dispatchEvent(new Event("change", { bubbles: true }));

    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.hidden).toBe(true));
    expect(document.querySelector<HTMLElement>("#due-badge")?.textContent).toBe("");
  });

  it("reveals a compact contextual answer with local Telugu phonetics", async () => {
    learningItems = [{ ...learningItems[0], telugu: "ఇల్లు", contexts: [{ text: "Een huis staat daar.", english: "A house stands there.", telugu: "అక్కడ ఒక ఇల్లు ఉంది.", addedAt: 3 }] }, learningItems[1]];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(content().textContent).toContain("Start your Daily Five."));
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();

    expect(content().querySelector(".practice-card")?.textContent).toContain("Dutchhuis");
    expect(content().textContent).toContain("Englishhouse");
    expect(content().textContent).toContain("Teluguఇల్లు");
    expect(content().querySelector<HTMLElement>(".telugu-phonetics")?.textContent).toBe("Say it: il-lu");
    expect(content().textContent).toContain("Original context · Language not detectedEen huis staat daar.");
    expect(content().textContent).toContain("English translation: A house stands there.");
    expect(content().textContent).toContain("Telugu translation: అక్కడ ఒక ఇల్లు ఉంది.");
    expect(document.activeElement).toBe(content().querySelector<HTMLButtonElement>(".rating-actions .button"));
  });

  it("keeps missing legacy helpers and context explicitly unavailable after reveal", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();

    expect(content().textContent).toContain("TeluguUnavailable");
    expect(content().textContent).toContain("Original context · Language not detectedUnavailable");
    expect(content().textContent).toContain("English translation: Unavailable");
    expect(content().querySelector(".telugu-phonetics")).toBeNull();
  });

  it("keeps Today selected on open and renders Saved with stable numbering", async () => {
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.getAttribute("aria-selected")).toBe("false");
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect([...content().querySelectorAll<HTMLElement>(".saved-guidelines li")].map((item) => item.textContent)).toEqual([
      "Select a word on a website to save it here.",
      "Local learning only. No account required.",
    ]);
    expect([...content().querySelectorAll<HTMLElement>(".saved-row")].map((row) => row.textContent)).toEqual([
      expect.stringContaining("2zebra"),
      expect.stringContaining("1huis"),
    ]);
    expect(content().textContent).toMatch(/EN\s*Unavailable/);
    expect(content().textContent).toMatch(/TE\s*జీబ్రా/);
    expect(content().querySelector(".saved-phonetics")?.textContent).toBe("Say it: jeeb-raa");
    expect(content().textContent).toContain("Familiar");
    expect(content().textContent).not.toContain("Practise now");
    expect(content().querySelectorAll("button").length).toBe(7);

    button("A–Z").click();
    await vi.waitFor(() => expect([...content().querySelectorAll<HTMLElement>(".saved-row")][0]?.textContent).toContain("1huis"));
    expect([...content().querySelectorAll<HTMLElement>(".saved-row")][1]?.textContent).toContain("2zebra");
  });

  it("starts Quiz Saved from Saved, keeps Saved locked, and records canonical mission results", async () => {
    const dailyFiveResultCallsBefore = runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.dailyFive.result").length;
    button("Saved").click();
    await vi.waitFor(() => expect(button("Quiz Saved")).toBeTruthy());
    button("Quiz Saved").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    expect(content().textContent).toContain("Saved quiz · 1 of 2");
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(button("Exit Quiz Saved")).toBeTruthy();

    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    expect(content().textContent).toContain("Original context · Language not detected");
    button("Got it").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Saved quiz · 2 of 2"));
    button("Show answer").click();
    button("Again").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Quiz Saved complete."));
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(false);
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.recordMissionResult")).toHaveLength(2);
    expect(runtime.sendMessage.mock.calls.filter(([message]) => message.type === "dutchmate.learning.dailyFive.result")).toHaveLength(dailyFiveResultCallsBefore);
  });

  it("exits Quiz Saved without creating a hidden resume flow and recovers from result errors", async () => {
    button("Saved").click();
    await vi.waitFor(() => expect(button("Quiz Saved")).toBeTruthy());
    button("Quiz Saved").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Exit Quiz Saved").click();
    expect(button("Quiz Saved")).toBeTruthy();

    button("Quiz Saved").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();
    quizFails = true;
    button("Got it").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Quiz result could not be saved."));
    expect(button("Try again")).toBeTruthy();
    quizFails = false;
    button("Try again").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Saved quiz · 2 of 2"));
  });

  it("expands one Saved card at a time, exposes only safe detail, and refreshes the canonical record", async () => {
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    const [zebra, huis] = [...content().querySelectorAll<HTMLButtonElement>(".saved-row")];
    expect(zebra.hasAttribute("aria-controls")).toBe(false);
    zebra.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Saved from webpage"));
    expect(content().querySelector<HTMLButtonElement>(".saved-row")?.getAttribute("aria-expanded")).toBe("true");
    expect(content().querySelector<HTMLButtonElement>(".saved-row")?.getAttribute("aria-controls")).toBe("saved-detail-2");
    expect(content().textContent).toContain("De zebra staat bij de ingang.");
    button("Open Options").click();
    expect(runtime.openOptionsPage).toHaveBeenCalledOnce();
    huis.click();
    await vi.waitFor(() => expect(content().textContent).not.toContain("De zebra staat bij de ingang."));
    [...content().querySelectorAll<HTMLButtonElement>(".saved-row")].find((row) => row.textContent?.includes("zebra"))!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("De zebra staat bij de ingang."));
    expect(content().querySelector(".saved-context-highlight")?.textContent).toBe("zebra");

    learningItems = [learningItems[0]];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(content().querySelectorAll(".saved-row")).toHaveLength(1));
    expect(content().querySelector(".saved-detail")).toBeNull();
  });

  it("offers conditional werken map and practice actions from a reliably resolved Saved form", async () => {
    learningItems = [
      learningItems[0],
      { ...learningItems[1], id: "worked-item", normalizedDutch: "heb gewerkt", dutch: "heb gewerkt", createdAt: 3, updatedAt: 3 },
      { ...learningItems[1], id: "unresolved-item", normalizedDutch: "werking", dutch: "werking", createdAt: 4, updatedAt: 4 },
    ];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(3));

    const resolvedRow = [...content().querySelectorAll<HTMLButtonElement>(".saved-row")].find((row) => row.querySelector("h2")?.textContent === "heb gewerkt")!;
    resolvedRow.click();
    await vi.waitFor(() => expect(button("Open Verb Map")).toBeTruthy());
    expect(content().textContent).toContain("Resolved werken form · VTT");
    button("Open Verb Map").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    expect(content().querySelector(".verb-detail-heading")?.textContent).toContain("VTT");
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Saved"));

    [...content().querySelectorAll<HTMLButtonElement>(".saved-row")].find((row) => row.querySelector("h2")?.textContent === "heb gewerkt")!.click();
    await vi.waitFor(() => expect(button("Practise VTT · 5 questions")).toBeTruthy());
    button("Practise VTT · 5 questions").click();
    await vi.waitFor(() => expect(content().textContent).toContain("VTT practice · decision 1 of 5"));
    button("Verb Map").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Saved"));

    [...content().querySelectorAll<HTMLButtonElement>(".saved-row")].find((row) => row.textContent?.includes("werking"))!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("werking"));
    expect(button("Open Verb Map")).toBeFalsy();
    expect(button("Practise VTT · 5 questions")).toBeFalsy();
  });

  it("removes one Saved context with an accessible control while keeping the item", async () => {
    learningItems = [learningItems[0], { ...learningItems[1], contexts: [{ text: "De zebra staat bij de ingang.", addedAt: 2 }, { text: "Zebra loopt naar huis.", addedAt: 3, sourceLanguage: "nl" }] }];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    content().querySelector<HTMLButtonElement>(".saved-row")!.click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-context-remove")).toHaveLength(2));
    const remove = content().querySelector<HTMLButtonElement>(".saved-context-remove")!;
    expect(remove.textContent).toBe("Remove context");
    expect(remove.getAttribute("type")).toBe("button");
    remove.click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-context-remove")).toHaveLength(1));
    expect(content().textContent).toContain("De zebra staat bij de ingang.");
    expect(content().textContent).toContain("Saved");
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.removeContext", payload: { itemId: "saved-item", context: { text: "Zebra loopt naar huis.", addedAt: 3, sourceLanguage: "nl" } } });
    content().querySelector<HTMLButtonElement>(".saved-context-remove")!.click();
    await vi.waitFor(() => expect(content().querySelector(".saved-no-context")?.textContent).toBe("No saved page context."));
    expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2);
  });

  it("starts a Saved Context Mission with the newest Dutch context and records one canonical result", async () => {
    learningItems = [learningItems[0], { ...learningItems[1], english: "zebra", contexts: [
      { text: "De zebra loopt buiten.", addedAt: 2, sourceLanguage: "nl" },
      { text: "De zebra staat bij de zebra.", addedAt: 3, sourceLanguage: "nl" },
      { text: "A zebra stands by the entrance.", addedAt: 4, sourceLanguage: "en" },
    ] }];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    content().querySelector<HTMLButtonElement>(".saved-row")!.click();
    await vi.waitFor(() => expect(button("Practise context")).toBeTruthy());
    expect(content().textContent).toContain("A zebra stands by the entrance.");

    button("Practise context").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Context Mission"));
    expect(content().textContent).toContain("De zebra staat bij de zebra.");
    expect(content().textContent).not.toContain("A zebra stands by the entrance.");
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(true);
    expect(button("Reveal")).toBeTruthy();
    expect(content().querySelectorAll(".saved-context-mission-context")).toHaveLength(1);

    button("Reveal").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Englishzebra"));
    const reveal = content().querySelector<HTMLButtonElement>(".rating-actions .button")!;
    expect(reveal.getAttribute("type")).toBe("button");
    button("Got it").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Context practice recorded."));
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.recordMissionResult", payload: { itemId: "saved-item", dimension: "recall", result: "got-it", expectedAttemptCount: 2 } });
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(false);
  });

  it("keeps missing helper meaning reveal-only and does not request a translation", async () => {
    learningItems = [learningItems[0], { ...learningItems[1], english: null, telugu: null, contexts: [{ text: "De zebra staat bij de zebra.", addedAt: 3, sourceLanguage: "nl" }] }];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    content().querySelector<HTMLButtonElement>(".saved-row")!.click();
    await vi.waitFor(() => expect(button("Practise context")).toBeTruthy());
    button("Practise context").click();
    button("Reveal").click();
    await vi.waitFor(() => expect(content().textContent).toContain("EnglishUnavailable"));
    expect(runtime.sendMessage.mock.calls.some(([message]) => message.type === "hoverTranslate.translate")).toBe(false);
    expect(content().textContent).toContain("No saved helper meaning is available for this context.");
    expect(button("Again")).toBeFalsy();
  });

  it("keeps a failed Context Mission result recoverable without false success", async () => {
    learningItems = [learningItems[0], { ...learningItems[1], english: "zebra", contexts: [{ text: "De zebra staat bij de zebra.", addedAt: 3, sourceLanguage: "nl" }] }];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    content().querySelector<HTMLButtonElement>(".saved-row")!.click();
    await vi.waitFor(() => expect(button("Practise context")).toBeTruthy());
    button("Practise context").click();
    button("Reveal").click();
    quizFails = true;
    button("Got it").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Quiz result could not be saved."));
    expect(button("Try again")).toBeTruthy();
    quizFails = false;
    button("Try again").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Context practice recorded."));
  });

  it("rebuilds an eligible Dutch context in stored order and records recall once", async () => {
    learningItems = [learningItems[0], { ...learningItems[1], english: "zebra", contexts: [{ text: "De zebra loopt.", addedAt: 3, sourceLanguage: "nl" }] }];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    button("Saved").click();
    await vi.waitFor(() => expect(content().querySelectorAll<HTMLButtonElement>(".saved-row")).toHaveLength(2));
    content().querySelector<HTMLButtonElement>(".saved-row")!.click();
    await vi.waitFor(() => expect(button("Practise context")).toBeTruthy());
    button("Practise context").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Rebuild the saved Dutch sentence in its original order."));
    expect(content().querySelector(".saved-context-mission-context .saved-context")?.textContent).toContain("__________");
    expect(button("Check").disabled).toBe(true);
    const token = (value: string) => [...content().querySelectorAll<HTMLButtonElement>("[aria-label='Available words'] button")].find((candidate) => candidate.textContent === value)!;
    token("zebra").focus();
    expect(document.activeElement).toBe(token("zebra"));
    token("zebra").click();
    token("loopt.").click();
    token("De").click();
    expect(button("Check").disabled).toBe(false);
    button("Check").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Context practice recorded."));
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.recordMissionResult", payload: { itemId: "saved-item", dimension: "recall", result: "got-it", expectedAttemptCount: 2 } });
    expect(runtime.sendMessage.mock.calls.some(([message]) => message.type === "hoverTranslate.translate")).toBe(false);
  });

  it("exposes Saved backup controls with success and failure feedback", async () => {
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect(content().querySelector(".saved-head .heading")?.textContent).toBe("Saved");
    expect(content().querySelectorAll(".saved-backup-actions .button")).toHaveLength(2);

    button("Export").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Exported 2 saved items."));
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(anchorClick).toHaveBeenCalledOnce();
    expect((anchorClick.mock.instances[0] as unknown as HTMLAnchorElement).download).toMatch(/^dutchmate-learning-\d{4}-\d{2}-\d{2}\.json$/);

    const input = content().querySelector<HTMLInputElement>('input[type="file"]')!;
    const backupDocument = JSON.stringify({ format: "dutchmate-learning-backup", version: 2, exportedAt: 1, learningItems: [], lessonProgress: {}, rhythm: {} });
    const file = new File([backupDocument], "dutchmate.json", { type: "application/json" });
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    input.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(content().textContent).toContain("Imported 1 item. You now have 3 saved items."));
    expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.import", payload: { document: backupDocument } });

    importFails = true;
    button("Import").click();
    const failedInput = content().querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(failedInput, "files", { configurable: true, value: [file] });
    failedInput.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(content().textContent).toContain("This backup is not supported."));

    exportFails = true;
    button("Export").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Could not export saved learning: Local export failed."));
    anchorClick.mockRestore();
  });

  it("keeps the Today lesson resume action centered and consistently styled", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A0 · Hallo, ik ben").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    button("Today").click();
    await vi.waitFor(() => expect(button("Continue lesson")).toBeTruthy());
    const continueLesson = button("Continue lesson");
    expect(continueLesson.classList.contains("lesson-entry-button")).toBe(true);
    expect(continueLesson.classList.contains("secondary-button")).toBe(true);
    expect(content().querySelector(".lesson-completion-meta")?.textContent).toBe("1 lesson completed today");
  });

  it("offers another lesson and shows today's completed lesson count", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Hallo, ik ben"));
    lessonCard("A0 · Hallo, ik ben").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("ben")).toBeTruthy());
    button("ben").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    button("Continue to Practise").click();
    for (let index = 0; index < 4; index += 1) {
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
      button("Got it").click();
    }
    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("You meet someone new"));
    expect(button("Check answer").disabled).toBe(true);
    button("ik ben").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
    const secondCandidate = content().querySelectorAll<HTMLInputElement>(".candidate-choice input")[1];
    secondCandidate.click();
    button("Keep 3 for review").click();
    expect(runtime.sendMessage).toHaveBeenCalledWith(expect.objectContaining({ type: "dutchmate.learning.keepLessonCandidates", payload: expect.objectContaining({ lessonId: "a0-hallo-ik-ben", evidence: expect.arrayContaining([{ candidateId: "ik-ben", dimension: "recognition", result: "got-it" }]) }) }));
    await vi.waitFor(() => expect(content().textContent).toContain("15 small practical stories"));
    button("Today").click();
    await vi.waitFor(() => expect(button("Learn another lesson")).toBeTruthy());
    expect(content().querySelector(".lesson-completion-meta")?.textContent).toBe("1 lesson completed today");
  });

  it("gives each remaining A0 lesson a controlled grammar path and in-lesson transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    for (const lesson of [
      { title: "A0 · Ik heb dit nodig", answer: "heb" },
      { title: "A0 · Ik woon en werk hier", answer: "woon" },
    ]) {
      lessonCard(lesson.title).click();
      await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
      button("Notice the pattern").click();
      await vi.waitFor(() => expect(button(lesson.answer)).toBeTruthy());
      button(lesson.answer).click();
      button("Check answer").click();
      await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
      button("Continue to Practise").click();
      for (let index = 0; index < 4; index += 1) {
        await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
        button("Show answer").click();
        await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
        button("Got it").click();
      }
      await completeAdditionalLessonExercises();
      await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
      button(lesson.title === "A0 · Ik heb dit nodig" ? "ik heb dit nodig" : "ik woon hier").click();
      button("Check answer").click();
      await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
      button("Choose what to keep").click();
      await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
      await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
      button("Exit lesson").click();
      await vi.waitFor(() => expect(lessonCard(lesson.title)).toBeTruthy());
    }

    lessonCard("A0 · Woon je hier?").click();
    await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("Woon")).toBeTruthy());
    for (const token of ["Woon", "je", "hier?"]) button(token).click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    button("Continue to Practise").click();
    for (let index = 0; index < 4; index += 1) {
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
      button("Got it").click();
    }
    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
    button("woon je hier").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
  });

  it("gives the A1 conversation and cafe lessons reduced-support transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    for (const lesson of [
      { title: "A1 · Kunt u dat herhalen?", answer: "kunt u dat herhalen" },
      { title: "A1 · Ik wil graag bestellen", answer: "ik wil graag" },
      { title: "A1 · Kan ik met pin betalen?", answer: "met pin betalen" },
    ]) {
      lessonCard(lesson.title).click();
      await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
      button("Notice the pattern").click();
      await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
      button("Practise").click();
      for (let index = 0; index < 4; index += 1) {
        await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
        button("Show answer").click();
        await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
        button("Got it").click();
      }
      await completeAdditionalLessonExercises();
      await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
      button(lesson.answer).click();
      button("Check answer").click();
      await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
      button("Choose what to keep").click();
      await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
      await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
      button("Exit lesson").click();
      await vi.waitFor(() => expect(lessonCard(lesson.title)).toBeTruthy());
    }
  });

  it("gives the A1 transport lessons reduced-support transfer", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    for (const lesson of [
      { title: "A1 · Waar moet ik overstappen?", answer: "waar moet ik overstappen" },
      { title: "A1 · Mijn trein is vertraagd", answer: "mijn trein is vertraagd" },
    ]) {
      lessonCard(lesson.title).click();
      await vi.waitFor(() => expect(button("Notice the pattern")).toBeTruthy());
      button("Notice the pattern").click();
      await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
      button("Practise").click();
      for (let index = 0; index < 4; index += 1) {
        await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
        button("Show answer").click();
        await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
        button("Got it").click();
      }
      await completeAdditionalLessonExercises();
      await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
      button(lesson.answer).click();
      button("Check answer").click();
      await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
      button("Choose what to keep").click();
      await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
      await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
      button("Exit lesson").click();
      await vi.waitFor(() => expect(lessonCard(lesson.title)).toBeTruthy());
    }
  });

  it("moves the three top-level tabs with arrow keys", async () => {
    const navigation = document.querySelector<HTMLElement>("#primary-navigation")!;
    navigation.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await vi.waitFor(() => expect(content().textContent).toContain("Learn in context"));
    expect(document.activeElement).toBe(document.querySelector("#lessons-tab"));
    navigation.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect(document.activeElement).toBe(document.querySelector("#saved-tab"));
  });

  it("keeps the popup controls named, semantic, and keyboard-ready", async () => {
    const navigation = document.querySelector<HTMLElement>("#primary-navigation")!;
    expect(navigation.getAttribute("role")).toBe("tablist");
    expect(navigation.getAttribute("aria-label")).toBe("Learning areas");
    expect(document.querySelector("#popup-content")?.getAttribute("role")).toBe("tabpanel");
    expect(document.querySelector("#popup-content")?.getAttribute("aria-live")).toBe("polite");
    for (const tab of document.querySelectorAll<HTMLButtonElement>("#primary-navigation [role='tab']")) {
      expect(tab.type).toBe("button");
      expect(tab.textContent?.trim()).not.toBe("");
      expect(tab.getAttribute("tabindex")).toMatch(/^-?\d+$/);
    }
    for (const control of content().querySelectorAll<HTMLButtonElement>("button")) {
      expect(control.textContent?.trim() || control.getAttribute("aria-label")).toBeTruthy();
    }
  });

  it("opens the numbered Practical Stories sub-page from the compact Lessons landing", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".practical-stories-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".practical-stories-entry")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("15 small practical stories"));
    expect(content().querySelector(".lessons-content .heading")?.textContent).toBe("Practical Stories");
    expect(content().textContent).toContain("Choose a situation. Each lesson is 3–5 minutes.");
    expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(15);
    expect(content().querySelectorAll(".lesson-group")).toHaveLength(0);
    expect([...content().querySelectorAll<HTMLElement>(".lesson-number")].map((number) => number.textContent)).toEqual(Array.from({ length: 15 }, (_, index) => String(index + 1).padStart(2, "0")));
  });

  it("keeps Lessons as a compact landing page with sub-pages for each lesson type", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-category-card")).toHaveLength(2));
    expect(content().querySelector(".lesson-library")).toBeNull();
    expect([...content().querySelectorAll<HTMLElement>(".lesson-category-title")].map((title) => title.textContent)).toEqual(["Verb Journeys", "Practical Stories"]);
    expect(content().querySelector(".verb-journey-entry.lesson-category-card svg")).toBeTruthy();
    expect(content().querySelector(".practical-stories-group svg.lesson-category-icon")).toBeTruthy();
    expect(content().querySelector(".verb-journey-entry")?.getAttribute("aria-label")).toBe("Open Verb Journeys");
    expect(content().querySelector(".practical-stories-entry")?.getAttribute("aria-label")).toBe("Open Practical Stories");
    content().querySelector<HTMLButtonElement>(".practical-stories-entry")!.click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(15));
  });

  it("opens the numbered werken read path through story, Notice, and the complete Verb Map", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    const entry = content().querySelector<HTMLButtonElement>(".verb-journey-entry")!;
    expect(entry.getAttribute("aria-label")).toBe("Open Verb Journeys");
    entry.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Verb Journeys"));
    expect(content().textContent).toContain("0 of 8 forms practised");
    expect(content().querySelector(".verb-journey-progress")).toBeNull();
    const werkenEntry = content().querySelector<HTMLElement>(".verb-directory-row.is-openable")!;
    expect(werkenEntry.querySelector(".verb-progress-track")).toBeTruthy();
    expect(werkenEntry.querySelector<HTMLElement>(".verb-progress-fill")?.style.width).toBe("0%");
    expect([...content().querySelectorAll<HTMLElement>(".verb-directory-number")].map((number) => number.textContent)).toEqual(["01", "02", "03", "04"]);
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    expect(content().querySelector(".journey-back-icon")).toBeTruthy();
    expect(content().textContent).toContain("What I completed");
    [...content().querySelectorAll<HTMLButtonElement>(".journey-list-row")].find((row) => row.textContent?.includes("What I completed"))!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een drukke werkdag"));
    expect(content().textContent).toContain("Report one completed work event from a recent situation.");
    expect(content().textContent).toContain("Gisteren heb ik op kantoor gewerkt.");
    expect(content().querySelectorAll(".verb-story-telugu").length).toBeGreaterThan(0);
    button("Notice the pattern →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("The completed event"));
    expect(content().textContent).toContain("FORMULA");
    expect(content().textContent).toContain("VALUABLE CONTRAST");
    expect(button("Place it on the 8-form map →").disabled).toBe(true);
    content().querySelector<HTMLButtonElement>(".verb-notice-choice")!.click();
    await vi.waitFor(() => expect(content().querySelector(".verb-notice-feedback")).toBeTruthy());
    expect(button("Place it on the 8-form map →").disabled).toBe(false);
    expect(content().querySelectorAll(".verb-notice-chip")).toHaveLength(4);
    expect(content().querySelectorAll(".verb-notice-highlight").length).toBeGreaterThanOrEqual(4);
    button("Place it on the 8-form map →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    expect(content().querySelectorAll(".verb-form-card")).toHaveLength(8);
    expect(content().textContent).toContain("Common usage");
    expect(content().textContent).toContain("Not completed");
    expect(content().textContent).toContain("Present");
    expect(content().textContent).toContain("tegenwoordige tijd");
    expect(content().querySelectorAll(".verb-form-status")).toHaveLength(8);
    expect(content().querySelector(".verb-form-status svg")).toBeTruthy();
    const ott = content().querySelector<HTMLButtonElement>(".verb-form-card[aria-label^='OTT']")!;
    ott.click();
    expect(content().querySelector(".verb-detail-example")?.textContent).toBe("Ik werk thuis.");
    expect(content().querySelectorAll(".verb-form-card.selected")).toHaveLength(1);
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.textContent).toContain("Today");
    expect(document.querySelector<HTMLButtonElement>("#lessons-tab")?.getAttribute("aria-selected")).toBe("true");
  });

  it("takes the OTT and OVT core journeys through story, Notice, and their map forms", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));

    for (const journey of [
      { title: "What I normally do", tense: "OTT" },
      { title: "How I worked before", tense: "OVT" },
    ]) {
      [...content().querySelectorAll<HTMLButtonElement>(".journey-list-row")].find((row) => row.textContent?.includes(journey.title))!.click();
      await vi.waitFor(() => expect(content().textContent).toContain(journey.title));
      button("Notice the pattern →").click();
      await vi.waitFor(() => expect(content().textContent).toContain("VALUABLE CONTRAST"));
      const noticeChoice = journey.tense === "OVT" ? "Ik werkte" : "Ik werk";
      [...content().querySelectorAll<HTMLButtonElement>(".verb-notice-choice")].find((choice) => choice.textContent?.includes(noticeChoice))!.click();
      button("Place it on the 8-form map →").click();
      await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
      expect(content().querySelector<HTMLElement>(".verb-form-card.selected")?.getAttribute("aria-label")).toMatch(new RegExp(`^${journey.tense}:`));
      button("Notice").click();
      button("Story").click();
      button(journey.title).click();
      await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    }
  });

  it("opens the later and reference journeys as complete guided lessons", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Learning journeys"));

    for (const journey of [
      { title: "What had already happened", story: "Voordat de vergadering begon" },
      { title: "Plans and possibilities", story: "Een plan voor morgen" },
      { title: "Completed future and unreal past", story: "Voor het einde van de dag" },
    ]) {
      [...content().querySelectorAll<HTMLButtonElement>(".journey-list-row")].find((row) => row.textContent?.includes(journey.title))!.click();
      await vi.waitFor(() => expect(content().textContent).toContain(journey.story));
      expect(button("Notice the pattern →")).toBeTruthy();
      button(journey.title).click();
      await vi.waitFor(() => expect(content().textContent).toContain("Learning journeys"));
    }
  });

  it("shows the compact werken mastery card with both reference map actions", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Your Verb Journey"));
    expect(content().querySelector(".verb-mastery-card .verb-progress-track")).toBeTruthy();
    expect(content().querySelector<HTMLElement>(".verb-mastery-card .verb-progress-fill")?.style.width).toBe("0%");
    expect(button("8 Dutch forms")).toBeTruthy();
    expect(button("12 English forms")).toBeTruthy();
    button("8 Dutch forms").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    button("werken").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Your Verb Journey"));
    button("12 English forms").click();
    await vi.waitFor(() => expect(content().textContent).toContain("12 English forms → Dutch"));
  });

  it("keeps every learning journey number visible while marking completed journeys separately", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Learning journeys"));
    expect([...content().querySelectorAll<HTMLElement>(".journey-list-row .journey-status-number")].map((marker) => marker.textContent)).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(content().querySelector<HTMLElement>(".journey-list-row:first-child .journey-status")?.classList.contains("next")).toBe(true);
    expect(content().querySelector(".journey-list-row:first-child .journey-completion-mark")).toBeNull();
  });

  it("keeps OTT practice on the first journey and marks it after returning", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Learning journeys"));
    [...content().querySelectorAll<HTMLButtonElement>(".journey-list-row")].find((row) => row.textContent?.includes("What I normally do"))!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("What I normally do"));
    button("Notice the pattern →").click();
    [...content().querySelectorAll<HTMLButtonElement>(".verb-notice-choice")].find((choice) => choice.textContent?.includes("Ik werk"))!.click();
    button("Place it on the 8-form map →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    expect(content().textContent).toContain("Practise OTT · 5 questions →");
    button("Practise OTT · 5 questions →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("OTT practice · decision 1 of 5"));
    expect(content().textContent).not.toContain("Ik heb gisteren thuis gewerkt.");

    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click(); button("Continue").click();
    for (const token of ["ik", "werk", "thuis"]) [...content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button")].find((candidate) => candidate.textContent === token && !candidate.disabled)!.click();
    button("Check answer").click(); button("Continue").click();
    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click(); button("Continue").click();
    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click(); button("Continue").click();
    for (const token of ["Op", "maandag", "werk", "ik", "op", "kantoor."]) [...content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button")].find((candidate) => candidate.textContent === token && !candidate.disabled)!.click();
    button("Check answer").click(); button("See completion").click();
    await vi.waitFor(() => expect(content().textContent).toContain("You used werken with OTT."));
    button("Back to werken journeys").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    const firstJourney = content().querySelector<HTMLButtonElement>(".journey-list-row:first-child")!;
    expect(firstJourney.textContent).toContain("Mastered");
    expect(firstJourney.querySelector(".journey-status-number")?.textContent).toBe("01");
    expect(firstJourney.querySelector(".journey-completion-mark")).toBeTruthy();
    expect(content().querySelector<HTMLElement>(".verb-mastery-card .verb-mastery-count")?.textContent).toBe("1 of 8 forms practised");
  });

  it("keeps OVT practice on the third journey and marks it after returning", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    [...content().querySelectorAll<HTMLButtonElement>(".journey-list-row")].find((row) => row.textContent?.includes("How I worked before"))!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("How I worked before"));
    button("Notice the pattern →").click();
    [...content().querySelectorAll<HTMLButtonElement>(".verb-notice-choice")].find((choice) => choice.textContent?.includes("Ik werkte"))!.click();
    button("Place it on the 8-form map →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    button("Practise OVT · 5 questions →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("OVT practice · decision 1 of 5"));

    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click(); button("Continue").click();
    content().querySelector<HTMLButtonElement>(".verb-token-choices .button")!.click();
    button("Check answer").click(); button("Continue").click();
    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click(); button("Continue").click();
    [...content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")].find((choice) => choice.textContent?.startsWith("OVT ·"))!.click();
    button("Check answer").click(); button("Continue").click();
    for (const token of ["Vroeger", "werkte", "ik", "naast", "mijn", "broer."]) [...content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button")].find((candidate) => candidate.textContent === token && !candidate.disabled)!.click();
    button("Check answer").click(); button("See completion").click();
    await vi.waitFor(() => expect(content().textContent).toContain("You used werken with OVT."));
    button("Back to werken journeys").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    const thirdJourney = content().querySelector<HTMLButtonElement>(".journey-list-row:nth-child(3)")!;
    expect(thirdJourney.textContent).toContain("Mastered");
    expect(thirdJourney.querySelector(".journey-status-number")?.textContent).toBe("03");
  });

  it("runs the five bounded VTT decisions, shows completion, and returns to the verb journeys", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    button("Practise VTT · 5 questions →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("decision 1 of 5"));

    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[1].click();
    button("Check answer").click();
    expect(content().querySelector("[role='status']")?.textContent).toContain("Correct");
    button("Continue").click();

    for (const token of ["ik", "heb", "gewerkt"]) [...content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button")].find((candidate) => candidate.textContent === token && !candidate.disabled)!.click();
    button("Check answer").click();
    expect(content().textContent).toContain("Correct. Build VTT");
    button("Continue").click();

    [...content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")].find((candidate) => candidate.textContent === "Ik heb gisteren thuis gewerkt.")!.click();
    button("Check answer").click(); button("Continue").click();
    [...content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")].find((candidate) => candidate.textContent?.startsWith("VTT ·"))!.click();
    button("Check answer").click(); button("Continue").click();

    for (const token of ["Gisteren", "heb", "ik", "thuis", "gewerkt."]) [...content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button")].find((candidate) => candidate.textContent === token && !candidate.disabled)!.click();
    button("Check answer").click();
    button("See completion").click();
    await vi.waitFor(() => expect(content().textContent).toContain("You used werken as a completed event."));
    expect(content().querySelectorAll(".verb-completion-row.correct")).toHaveLength(5);
    expect(content().textContent).toContain("Review the VTT · OVT contrast");
    const completionActions = content().querySelectorAll<HTMLButtonElement>(".verb-completion-screen button");
    const finalCompletionAction = completionActions[completionActions.length - 1];
    expect(finalCompletionAction?.textContent).toBe("Back to werken journeys");
    finalCompletionAction!.click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    expect(content().textContent).toContain("Learning journeys");
    expect([...content().querySelectorAll<HTMLElement>(".journey-list-row")].find((row) => row.textContent?.includes("What I completed"))?.textContent).toContain("Mastered");
  });

  it("opens all twelve English mappings and returns to the selected Verb Map form", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    await vi.waitFor(() => expect(button("12 English forms")).toBeTruthy());
    button("12 English forms").click();
    await vi.waitFor(() => expect(content().textContent).toContain("12 English forms → Dutch"));
    expect(content().querySelectorAll(".verb-english-card")).toHaveLength(4);
    expect(content().textContent).toContain("I am working at home right now.");
    expect(content().textContent).toContain("Common everyday Dutch");
    expect(content().querySelector<HTMLButtonElement>(".verb-english-card")?.getAttribute("aria-expanded")).toBe("true");
    content().querySelector<HTMLButtonElement>(".verb-english-card")!.click();
    expect(content().querySelector<HTMLButtonElement>(".verb-english-card")?.getAttribute("aria-expanded")).toBe("false");
    button("Past · 4").click();
    expect(content().querySelectorAll(".verb-english-card")).toHaveLength(4);
    expect(content().textContent).toContain("I worked at home yesterday.");
    button("werken").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Eight Dutch forms"));
    button("8 Dutch forms").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    content().querySelector<HTMLButtonElement>(".verb-form-card[aria-label^='OVT']")!.click();
    button("Compare 12 English forms →").click();
    await vi.waitFor(() => expect(content().textContent).toContain("12 English forms → Dutch"));
    button("Back to 8-form map").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Werken Verb Map"));
    expect(content().querySelector(".verb-detail-example")?.textContent).toBe("Ik werkte thuis.");
  });

  it("surfaces a weak verb skill through the existing Daily Five review flow", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();
    button("Got it").click();
    await vi.waitFor(() => expect(button("Review 5 more")).toBeTruthy());
    await runtime.sendMessage({ type: "dutchmate.learning.verbJourney.result", payload: { verbId: "verb.werken", formOrSkillId: "skill.werken.vtt-completed", contentVersion: "015-1", exerciseFamily: "meaning", exerciseId: "exercise.werken.vtt.meaning", result: "incorrect", expectedEvidenceRevision: 0 } });
    button("Review 5 more").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Daily Five · Verb Journey"));
    expect(content().textContent).toContain("werken · VTT");
    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[1].click();
    button("Check answer").click();
    await vi.waitFor(() => expect(content().querySelector("[role='status']")?.textContent).toContain("Correct"));
    await vi.waitFor(() => expect(button("Continue").disabled).toBe(false));
    button("Continue").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Five small wins."));
  });

  it("caps an incorrect VTT path at two authored repairs and exposes reset", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    button("Practise VTT · 5 questions →").click();
    const firstChoices = content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button");
    firstChoices[0].click(); button("Check answer").click(); button("Continue").click();
    expect(content().textContent).toContain("Repair");
    const repairChoice = content().querySelector<HTMLButtonElement>(".verb-practice-choices .button")!;
    repairChoice.click(); button("Check answer").click(); button("Continue").click();
    expect(content().textContent).toContain("Repair");
    const repairTokens = content().querySelectorAll<HTMLButtonElement>(".verb-token-choices .button");
    expect(repairTokens.length).toBeGreaterThan(0);
    expect(content().querySelector<HTMLButtonElement>(".verb-reset")).toBeTruthy();
    button("Reset").click();
    expect(content().textContent).toContain("Choose words in order.");
  });

  it("offers a real retry action after incorrect verb practice feedback", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelector(".verb-journey-entry")).toBeTruthy());
    content().querySelector<HTMLButtonElement>(".verb-journey-entry")!.click();
    content().querySelector<HTMLButtonElement>(".verb-directory-row.is-openable")!.click();
    button("Practise VTT · 5 questions →").click();
    content().querySelectorAll<HTMLButtonElement>(".verb-practice-choices .button")[0].click();
    button("Check answer").click();
    expect(button("Try again")).toBeTruthy();
    button("Try again").click();
    expect(button("Try again")).toBeFalsy();
    expect(button("Check answer").disabled).toBe(true);
  });

  it("keeps unstarted A0 patterns quiet without crowding Today", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson library"));
    expect(content().textContent).not.toContain("Pattern: Not started");
    expect(content().textContent).toContain("Next A0 pattern");
    expect(content().querySelector(".foundation-path")).toBeNull();
    button("Today").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Start your Daily Five."));
    expect(content().textContent).not.toContain("Next foundation pattern");
    expect(content().textContent).not.toContain("Next A0 pattern");
  });

  it("filters Lessons by readiness and CEFR level and labels resumable stages", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(15));
    expect(content().querySelectorAll(".lesson-filter")).toHaveLength(8);

    lessonCard("A0 · Hallo, ik ben").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Continue · Read · 3 min left"));

    button("Continue").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(1));
    expect(content().textContent).toContain("first conversations · Continue · Read · 3 min left");

    button("All").click();
    button("A0").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(4));
    expect([...content().querySelectorAll<HTMLElement>(".lesson-number")].map((number) => number.textContent)).toEqual(["01", "02", "03", "04"]);
    expect(content().textContent).toContain("Hallo, ik ben");
    expect(content().textContent).toContain("Ik heb dit nodig");
    expect(content().textContent).toContain("Ik woon en werk hier");
    expect(content().textContent).toContain("Woon je hier?");

    button("Completed").click();
    await vi.waitFor(() => expect(content().textContent).toContain("No lessons match these filters."));
  });

  it("keeps Today visible and locked during focused review", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(false);
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(button("Exit review")).toBeTruthy();
    button("Exit review").click();
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.disabled).toBe(false);
  });

  it("retains Today orientation when continuing a lesson from Today", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A0 · Hallo, ik ben").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    button("Today").click();
    await vi.waitFor(() => expect(button("Continue lesson")).toBeTruthy());
    button("Continue lesson").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.getAttribute("aria-selected")).toBe("true");
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Start your Daily Five."));
  });

  it("keeps Start Daily Five as the only primary action before the daily goal completes", async () => {
    expect(button("Start Daily Five").classList.contains("primary-button")).toBe(true);
    expect(button("Review more")).toBeFalsy();
  });

  it("keeps Today focused after Daily Five completes", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    button("Today").click();
    await vi.waitFor(() => expect(button("Start Daily Five")).toBeTruthy());
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    button("Got it").click();
    await vi.waitFor(() => expect(button("Review 5 more")).toBeTruthy());
    const reviewFiveMore = content().querySelector<HTMLButtonElement>(".next-action .primary-button")!;
    expect(reviewFiveMore.textContent).toBe("Review 5 more");
    expect(content().querySelector(".review-completion-meta")?.textContent).toBe("3 items reviewed today");
    expect(content().querySelector(".action-meta")).toBeFalsy();
    expect(content().textContent).not.toContain("Recognition first");
    expect(content().querySelector(".secondary-actions")).toBeFalsy();
    expect(content().querySelectorAll(".next-action .lesson-entry-button")).toHaveLength(1);
    reviewFiveMore.click();
    await vi.waitFor(() => expect(runtime.sendMessage).toHaveBeenCalledWith({ type: "dutchmate.learning.dailyFive", payload: { continueAfterCompletion: true } }));
  });

  it("renders the empty-vocabulary actions on a fresh Today load", async () => {
    learningItems = [];
    const existingHandler = runtime.sendMessage.getMockImplementation()!;
    runtime.sendMessage.mockImplementation(async (message: { type: string; payload?: Record<string, unknown> }) => {
      if (message.type === "dutchmate.learning.dailyFive") return { ok: true, result: { snapshot: { createdAt: 1, dayStartAt: 0, tasks: [], completedTaskIds: [], goalCompleted: false } } };
      return existingHandler(message);
    });
    vi.resetModules();
    storageChangeListeners.clear();
    document.body.innerHTML = `
      <main class="popup-shell">
        <header class="popup-header"><div class="header-actions"><span id="due-badge"></span><a class="feedback-link" href="https://forms.gle/9KSsqfE1NNZcPEaaA">Feedback</a><button id="settings-button" type="button">Settings</button></div></header>
        <nav id="primary-navigation"><button id="today-tab" type="button">Today</button><button id="lessons-tab" type="button">Lessons</button><button id="saved-tab" type="button">Saved</button></nav>
        <div id="popup-content" tabindex="0"></div>
      </main>`;
    await import("./index");

    await vi.waitFor(() => expect(button("Choose a lesson")).toBeTruthy());
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Nothing saved yet."));
    expect(content().querySelectorAll(".saved-guidelines li").length).toBe(2);
    expect(button("Quiz Saved")).toBeFalsy();
    button("Today").click();
    expect(content().querySelector(".secondary-actions")).toBeFalsy();
    button("Choose a lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Learn in context"));
  });

  it("does not tell learners with saved vocabulary to save more when no review is available", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    button("Got it").click();
    await vi.waitFor(() => expect(button("Review 5 more")).toBeTruthy());

    forceEmptyDailyFive = true;
    button("Review 5 more").click();
    await vi.waitFor(() => expect(button("Choose a lesson")).toBeTruthy());
    expect(button("Review")).toBeFalsy();
  });

  it("keeps the learner in an understandable error state when keeping candidates fails", async () => {
    keepFails = true;
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());

    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("werk")).toBeTruthy());
    button("werk").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy());
    button("Continue to next contrast").click();
    await vi.waitFor(() => expect(button("Morgen werk ik thuis.")).toBeTruthy());
    button("Morgen werk ik thuis.").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy());
    button("Continue to next contrast").click();
    await vi.waitFor(() => expect(button("Morgen")).toBeTruthy());
    for (const token of ["Morgen", "maak", "ik", "een", "afspraak."]) button(token).click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy());
    button("Continue to Practise").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    for (const [index, result] of ["Got it", "Got it", "Got it"].entries()) {
      button("Show answer").click();
      await vi.waitFor(() => expect(button(result)).toBeTruthy());
      button(result).click();
      if (index < 2) await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    }
    await completeAdditionalLessonExercises();
    await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
    button("ik wil graag").click();
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
    await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
    button("Keep 4 for review").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson candidates could not be kept."));
  });

  it("lists the fifteen bundled lessons in order and opens the published lessons with help and trilingual practice", async () => {
    openPracticalStories();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik heb last van…"));
    expect([...content().querySelectorAll<HTMLElement>(".lesson-card .lesson-copy strong")].map((heading) => heading.textContent)).toEqual([
      "Hallo, ik ben…",
      "Ik heb dit nodig",
      "Ik woon en werk hier",
      "Woon je hier?",
      "Kunt u dat herhalen?",
      "Ik wil graag bestellen",
      "Kan ik met pin betalen?",
      "Waar moet ik overstappen?",
      "Mijn trein is vertraagd",
      "Een afspraak maken",
      "Ik heb last van…",
      "Er is iets kapot",
      "Ik ben beschikbaar op…",
      "Wat moet ik meenemen?",
      "Wat staat er in deze brief?",
    ]);

    for (const { title, candidate } of [
      { title: "A1 · Waar moet ik overstappen?", candidate: "waar moet ik overstappen" },
      { title: "A1 · Mijn trein is vertraagd", candidate: "mijn trein is vertraagd" },
      { title: "A1 · Een afspraak maken", candidate: "ik wil graag" },
      { title: "A1 · Ik heb last van…", candidate: "ik heb last van" },
      { title: "A1 · Er is iets kapot", candidate: "er is iets kapot" },
      { title: "A1 · Ik ben beschikbaar op…", candidate: "ik ben beschikbaar" },
      { title: "A1 · Wat moet ik meenemen?", candidate: "wat moet ik meenemen" },
      { title: "A2 · Wat staat er in deze brief?", candidate: "wat staat er in deze brief" },
    ]) {
      lessonCard(title).click();
      await vi.waitFor(() => expect(button("Show line help")).toBeTruthy());
      button("Show line help").click();
      await vi.waitFor(() => expect(content().textContent).toContain("English:"));
      button("Notice the pattern").click();
      if (title === "A1 · Een afspraak maken") {
        await vi.waitFor(() => expect(button("werk")).toBeTruthy());
        button("werk").click(); button("Check answer").click();
        await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy()); button("Continue to next contrast").click();
        await vi.waitFor(() => expect(button("Morgen werk ik thuis.")).toBeTruthy());
        button("Morgen werk ik thuis.").click(); button("Check answer").click();
        await vi.waitFor(() => expect(button("Continue to next contrast")).toBeTruthy()); button("Continue to next contrast").click();
        await vi.waitFor(() => expect(button("Morgen")).toBeTruthy());
        for (const token of ["Morgen", "maak", "ik", "een", "afspraak."]) button(token).click();
        button("Check answer").click();
        await vi.waitFor(() => expect(button("Continue to Practise")).toBeTruthy()); button("Continue to Practise").click();
      } else {
      await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
      button("Practise").click();
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(content().textContent).toContain(candidate));
      expect(content().textContent).toContain("Telugu");
      }
      if (title === "A1 · Waar moet ik overstappen?") {
        for (let index = 0; index < 4; index += 1) {
          button("Got it").click();
          if (index < 3) await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
          if (index < 3) button("Show answer").click();
        }
        await completeAdditionalLessonExercises();
        await vi.waitFor(() => expect(content().textContent).toContain("Apply"));
        button("waar moet ik overstappen").click();
        button("Check answer").click();
        await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
        button("Choose what to keep").click();
        await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
        expect(content().textContent).toContain("Keep 4 for review");
      }
      button("Exit lesson").click();
      await vi.waitFor(() => expect(lessonCard(title)).toBeTruthy());
    }
  });
});

function content(): HTMLElement {
  return document.querySelector<HTMLElement>("#popup-content")!;
}

function button(label: string): HTMLButtonElement {
  return [...document.querySelectorAll<HTMLButtonElement>("button")].find((element) => element.textContent === label)!;
}

function openPracticalStories(): void {
  button("Lessons").click();
  content().querySelector<HTMLButtonElement>(".practical-stories-entry")!.click();
}

async function completeAdditionalLessonExercises(): Promise<void> {
  for (let index = 0; index < 3; index += 1) {
    await vi.waitFor(() => expect(content().querySelector(".lesson-authored-exercise")).toBeTruthy());
    expect(content().querySelector(".lesson-authored-exercise")?.classList.contains("practice-card")).toBe(true);
    expect(content().querySelector<HTMLElement>(".lesson-stage.active")?.textContent).toBe("Practise");
    const token = content().querySelector<HTMLButtonElement>(".lesson-authored-token:not(.is-selected)");
    if (token) {
      while (content().querySelector(".lesson-authored-token:not(.is-selected)")) {
        content().querySelector<HTMLButtonElement>(".lesson-authored-token:not(.is-selected)")!.click();
      }
    } else {
      content().querySelector<HTMLButtonElement>(".lesson-authored-choice")!.click();
    }
    button("Check answer").click();
    await vi.waitFor(() => expect(button("Continue")).toBeTruthy());
    button("Continue").click();
  }
}

function lessonCard(title: string): HTMLButtonElement {
  return [...content().querySelectorAll<HTMLButtonElement>("button.lesson-card")].find((card) => card.textContent?.includes(title.replace(/^[A-Z0-9]+ · /, "")))!;
}

function rhythmFixture() { const today = new Date(); const day = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset).getTime(); return { week: Array.from({ length: 7 }, (_, index) => ({ dayStartAt: day(index - 6), status: index === 5 ? "grace" as const : index === 6 ? "active" as const : "idle" as const })), activity: [{ dayStartAt: day(0), reviews: 3, saved: 1, lessons: 1 }], resetCopy: "A fresh week starts whenever you return.", milestones: [{ id: "first-saved-chunk", label: "First useful phrase saved" }, { id: "balanced-practice", label: "Recognition and recall practised" }] }; }
