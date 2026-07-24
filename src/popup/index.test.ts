// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSettings } from "../shared/settings";

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
  let forceEmptyDailyFive: boolean;
  let learningItems: Array<Record<string, unknown>>;
  let rhythmResponse: { week: Array<{ dayStartAt: number; status: "active" | "grace" | "idle" }>; activity: Array<{ dayStartAt: number; reviews: number | null; saved: number | null; lessons: number | null; lessonAdditions?: number }>; resetCopy: string | null; milestones: Array<{ id: string; label: string }> };

  beforeEach(async () => {
    vi.resetModules();
    storageChangeListeners.clear();
    progressByLesson = {};
    keepFails = false;
    listFails = false;
    importFails = false;
    exportFails = false;
    forceEmptyDailyFive = false;
    rhythmResponse = rhythmFixture();
    const dailyItem = { id: "daily-item", learningLanguage: "nl", normalizedDutch: "huis", dutch: "huis", kind: "word", english: "house", telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1 };
    learningItems = [dailyItem, { ...dailyItem, id: "saved-item", normalizedDutch: "zebra", dutch: "zebra", english: null, telugu: "జీబ్రా", sources: [{ type: "webpage", addedAt: 2 }], contexts: [{ text: "De zebra staat bij de ingang.", addedAt: 2 }], createdAt: 2, updatedAt: 2, recognition: { ...dailyItem.recognition, state: "strong", attemptCount: 3 }, recall: { ...dailyItem.recall, state: "familiar", attemptCount: 2 } }];
    runtime.sendMessage.mockImplementation(async (message: { type: string; payload?: Record<string, unknown> }) => {
      if (message.type === "dutchmate.learning.list") return listFails ? { ok: false, error: "Local read failed" } : { ok: true, result: { items: learningItems } };
      if (message.type === "dutchmate.learning.export") return exportFails ? { ok: false, error: "Local export failed." } : { ok: true, result: { backup: { format: "dutchmate-learning-backup", version: 2, exportedAt: 1, learningItems, lessonProgress: {}, rhythm: {} } } };
      if (message.type === "dutchmate.learning.import") {
        if (importFails) return { ok: false, error: "This backup is not supported." };
        learningItems = [...learningItems, { ...learningItems[0], id: "imported-item", normalizedDutch: "fiets", dutch: "fiets", createdAt: 3, updatedAt: 3 }];
        return { ok: true, result: { importedCount: 1, totalCount: learningItems.length, items: learningItems } };
      }
      if (message.type === "dutchmate.learning.rhythm") return { ok: true, result: { rhythm: rhythmResponse } };
      if (message.type === "dutchmate.learning.dailyFive") {
        const emptyContinuation = message.payload?.continueAfterCompletion === true && (learningItems.length === 0 || forceEmptyDailyFive);
        return { ok: true, result: { snapshot: { createdAt: 1, dayStartAt: 0, tasks: emptyContinuation ? [] : [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [], goalCompleted: false } } };
      }
      if (message.type === "dutchmate.learning.dailyFive.result") {
        const item = learningItems.find((candidate) => candidate.id === message.payload?.itemId)!;
        const dimension = message.payload?.dimension as "recognition" | "recall";
        return { ok: true, result: { item: { ...item, [dimension]: { ...(item[dimension] as Record<string, unknown>), dueAt: Date.now() + 86_400_000 } }, snapshot: { createdAt: 1, dayStartAt: 0, tasks: [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [`${dailyItem.id}\u001frecognition`], goalCompleted: true } } };
      }
      if (message.type === "dutchmate.review.settings") return { ok: true, result: { settings: defaultSettings } };
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
        <nav id="primary-navigation"><button id="today-tab" type="button">Today</button><button id="lessons-tab" type="button">Lessons</button><button id="saved-tab" type="button">Saved</button></nav>
        <div id="popup-content" tabindex="0"></div>
      </main>`;
    await import("./index");
    await vi.waitFor(() => expect(content().textContent).toContain("Start your Daily Five."));
  });

  it("renders the appointment lesson through read, notice, practise, replay, selection, keep, and exit", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));

    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    expect(document.activeElement).toBe(content());
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(false);
    expect(document.querySelector<HTMLButtonElement>("#lessons-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#lessons-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.disabled).toBe(true);
    expect(document.querySelector("#settings-button")?.hasAttribute("hidden")).toBe(true);

    button("Show line help").click();
    await vi.waitFor(() => expect(content().textContent).toContain("English: Receptionist: Good morning. How can I help you?"));
    button("Notice the pattern").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Use Ik wil graag…"));
    button("Practise").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());

    for (const [index, result] of ["Got it", "Again", "Got it"].entries()) {
      button("Show answer").click();
      await vi.waitFor(() => expect(button(result)).toBeTruthy());
      button(result).click();
      await vi.waitFor(() => expect(index === 2 ? button("Choose what to keep") : button("Show answer")).toBeTruthy());
    }

    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Choose what to keep for review."));
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
  });

  it("keeps the mockup history controls and uses heatmaps for month and year", async () => {
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day")).toHaveLength(7));
    expect(content().querySelector(".insights")).toBeNull();
    expect(content().textContent).toContain("Practise five useful words. Start now.");
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
    expect(content().querySelector<HTMLElement>(".rhythm-day.active .activity-total")?.textContent).toBe("4+");
  });

  it("shows a new lesson completed on a legacy activity day as a lower-bound count", async () => {
    rhythmResponse.activity[0] = { ...rhythmResponse.activity[0], lessons: null, lessonAdditions: 1 };
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");

    await vi.waitFor(() => expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.getAttribute("aria-label")).toContain("1 new lesson; historical lesson count unavailable"));
    expect(content().querySelector<HTMLElement>(".rhythm-day.active .activity-total")?.textContent).toBe("5+");
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
    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    button("Got it").click();

    await vi.waitFor(() => expect(document.querySelector<HTMLElement>("#due-badge")?.textContent).toBe("1"));
    expect(document.querySelector<HTMLElement>("#due-badge")?.hidden).toBe(false);
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
    expect(content().textContent).toContain("ContextEen huis staat daar.");
    expect(content().textContent).toContain("English: A house stands there.");
    expect(content().textContent).toContain("Telugu: అక్కడ ఒక ఇల్లు ఉంది.");
    expect(document.activeElement).toBe(content().querySelector<HTMLButtonElement>(".rating-actions .button"));
  });

  it("keeps missing legacy helpers and context explicitly unavailable after reveal", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();

    expect(content().textContent).toContain("Teluguunavailable");
    expect(content().textContent).toContain("Contextunavailable");
    expect(content().textContent).toContain("English: unavailable");
    expect(content().querySelector(".telugu-phonetics")).toBeNull();
  });

  it("keeps Today selected on open and renders Saved as a browse-only shelf with stable numbering", async () => {
    expect(document.querySelector<HTMLButtonElement>("#today-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector<HTMLButtonElement>("#saved-tab")?.getAttribute("aria-selected")).toBe("false");
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect([...content().querySelectorAll<HTMLElement>(".saved-row")].map((row) => row.textContent)).toEqual([
      expect.stringContaining("2zebra"),
      expect.stringContaining("1huis"),
    ]);
    expect(content().textContent).toMatch(/EN\s*unavailable/);
    expect(content().textContent).toMatch(/TE\s*జీబ్రా/);
    expect(content().textContent).toContain("Familiar");
    expect(content().textContent).not.toContain("Practise now");
    expect(content().querySelectorAll("button").length).toBe(6);

    button("A–Z").click();
    await vi.waitFor(() => expect([...content().querySelectorAll<HTMLElement>(".saved-row")][0]?.textContent).toContain("1huis"));
    expect([...content().querySelectorAll<HTMLElement>(".saved-row")][1]?.textContent).toContain("2zebra");
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

    learningItems = [learningItems[0]];
    for (const listener of storageChangeListeners) listener({ "dutchmate.learningRecord.v2": {} }, "local");
    await vi.waitFor(() => expect(content().querySelectorAll(".saved-row")).toHaveLength(1));
    expect(content().querySelector(".saved-detail")).toBeNull();
  });

  it("exposes Saved backup controls with success and failure feedback", async () => {
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    button("Saved").click();
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect(content().querySelector(".saved-head .heading")?.textContent).toBe("Saved");
    expect(content().querySelectorAll(".saved-backup-actions .button")).toHaveLength(2);

    button("Export").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Exported 2 saved items."));
    expect(URL.createObjectURL).toHaveBeenCalledOnce();

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
  });

  it("moves the three top-level tabs with arrow keys", async () => {
    const navigation = document.querySelector<HTMLElement>("#primary-navigation")!;
    navigation.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await vi.waitFor(() => expect(content().textContent).toContain("12 small practical stories"));
    expect(document.activeElement).toBe(document.querySelector("#lessons-tab"));
    navigation.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await vi.waitFor(() => expect(content().textContent).toContain("2 saved items"));
    expect(document.activeElement).toBe(document.querySelector("#saved-tab"));
  });

  it("renders Lessons as the compact numbered library from the approved mockup", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("12 small practical stories"));
    expect(content().querySelector(".lessons-content .heading")?.textContent).toBe("Lesson library");
    expect(content().textContent).toContain("Choose a situation. Each lesson is 3–5 minutes.");
    expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(12);
    expect(content().querySelectorAll(".lesson-group")).toHaveLength(0);
  });

  it("filters Lessons by readiness and practical pathway and labels resumable stages", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(12));
    expect(content().querySelectorAll(".lesson-filter")).toHaveLength(11);

    lessonCard("A0 · Hallo, ik ben").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Continue · Read · 3 min left"));

    button("Continue").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(1));
    expect(content().textContent).toContain("first conversations · Continue · Read · 3 min left");

    button("All").click();
    button("Transport").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".lesson-library .lesson-row")).toHaveLength(2));
    expect([...content().querySelectorAll<HTMLElement>(".lesson-copy small")].every((meta) => meta.textContent?.startsWith("transport ·"))).toBe(true);

    button("Continue").click();
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
    button("Lessons").click();
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

  it("stacks Continue lesson and Review more after Daily Five completes", async () => {
    button("Lessons").click();
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
    await vi.waitFor(() => expect(button("Review more")).toBeTruthy());
    const reviewFiveMore = content().querySelector<HTMLButtonElement>(".next-action .button")!;
    expect(reviewFiveMore.textContent).toBe("Review 5 more");
    expect(content().textContent).not.toContain("Recognition first");
    expect([...content().querySelectorAll<HTMLButtonElement>(".secondary-actions .button")].map((action) => action.textContent)).toEqual(["Continue lesson", "Review more"]);
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

    await vi.waitFor(() => expect(button("Start a lesson")).toBeTruthy());
    expect([...content().querySelectorAll<HTMLButtonElement>(".secondary-actions .button")].map((action) => action.textContent)).toEqual(["Start a lesson", "Review"]);
    const reviewHint = content().querySelector<HTMLElement>(".empty-review-hint");
    expect(reviewHint?.hidden).toBe(true);
    expect(reviewHint?.getAttribute("role")).toBe("status");
    expect(button("Review").getAttribute("aria-controls")).toBe("empty-review-hint");

    button("Review").click();
    expect(content().querySelector<HTMLElement>(".empty-review-hint")?.hidden).toBe(false);
    button("Start a lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("12 small practical stories"));
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
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A1 · Een afspraak maken").click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());

    button("Notice the pattern").click();
    await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
    button("Practise").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    for (const [index, result] of ["Got it", "Got it", "Got it"].entries()) {
      button("Show answer").click();
      await vi.waitFor(() => expect(button(result)).toBeTruthy());
      button(result).click();
      await vi.waitFor(() => expect(index === 2 ? button("Choose what to keep") : button("Show answer")).toBeTruthy());
    }
    await vi.waitFor(() => expect(button("Choose what to keep")).toBeTruthy());
    button("Choose what to keep").click();
    await vi.waitFor(() => expect(button("Keep 4 for review")).toBeTruthy());
    button("Keep 4 for review").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Lesson candidates could not be kept."));
  });

  it("lists the twelve bundled lessons in order and opens the published lessons with help and trilingual practice", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Ik heb last van…"));
    expect([...content().querySelectorAll<HTMLElement>(".lesson-card .lesson-copy strong")].map((heading) => heading.textContent)).toEqual([
      "Hallo, ik ben…",
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
      await vi.waitFor(() => expect(button("Practise")).toBeTruthy());
      button("Practise").click();
      await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
      button("Show answer").click();
      await vi.waitFor(() => expect(content().textContent).toContain(candidate));
      expect(content().textContent).toContain("Telugu");
      if (title === "A1 · Waar moet ik overstappen?") {
        for (let index = 0; index < 4; index += 1) {
          button("Got it").click();
          await vi.waitFor(() => expect(index === 3 ? button("Choose what to keep") : button("Show answer")).toBeTruthy());
          if (index < 3) button("Show answer").click();
        }
        expect(content().textContent).toContain("Replay");
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

function lessonCard(title: string): HTMLButtonElement {
  return [...content().querySelectorAll<HTMLButtonElement>("button.lesson-card")].find((card) => card.textContent?.includes(title.replace(/^[A-Z0-9]+ · /, "")))!;
}

function rhythmFixture() { const today = new Date(); const day = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset).getTime(); return { week: Array.from({ length: 7 }, (_, index) => ({ dayStartAt: day(index - 6), status: index === 5 ? "grace" as const : index === 6 ? "active" as const : "idle" as const })), activity: [{ dayStartAt: day(0), reviews: 3, saved: 1, lessons: 1 }], resetCopy: "A fresh week starts whenever you return.", milestones: [{ id: "first-saved-chunk", label: "First useful phrase saved" }, { id: "balanced-practice", label: "Recognition and recall practised" }] }; }
