// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSettings } from "../shared/settings";

const runtime = vi.hoisted(() => ({ sendMessage: vi.fn() }));

vi.mock("webextension-polyfill", () => ({
  default: { runtime, storage: { sync: { get: vi.fn() } } },
}));

describe("lesson popup", () => {
  let progressByLesson: Record<string, Record<string, unknown> | null>;
  let keepFails: boolean;
  let rhythmResponse: { week: Array<{ dayStartAt: number; status: "active" | "grace" | "idle" }>; activity: Array<{ dayStartAt: number; reviews: number | null; saved: number | null }>; resetCopy: string | null; milestones: Array<{ id: string; label: string }> };

  beforeEach(async () => {
    vi.resetModules();
    progressByLesson = {};
    keepFails = false;
    rhythmResponse = rhythmFixture();
    const dailyItem = { id: "daily-item", learningLanguage: "nl", normalizedDutch: "huis", dutch: "huis", kind: "word", english: "house", telugu: null, sources: [], contexts: [], encounters: { count: 0, lastEncounterAt: null }, recognition: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, recall: { state: "new", dueAt: null, intervalDays: 0, attemptCount: 0, successfulStreak: 0, lastPractisedAt: null }, createdAt: 1, updatedAt: 1 };
    runtime.sendMessage.mockImplementation(async (message: { type: string; payload?: Record<string, unknown> }) => {
      if (message.type === "dutchmate.learning.list") return { ok: true, result: { items: [dailyItem] } };
      if (message.type === "dutchmate.learning.rhythm") return { ok: true, result: { rhythm: rhythmResponse } };
      if (message.type === "dutchmate.learning.dailyFive") return { ok: true, result: { snapshot: { createdAt: 1, dayStartAt: 0, tasks: [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [], goalCompleted: false } } };
      if (message.type === "dutchmate.learning.dailyFive.result") return { ok: true, result: { item: dailyItem, snapshot: { createdAt: 1, dayStartAt: 0, tasks: [{ itemId: dailyItem.id, dimension: "recognition" }], completedTaskIds: [`${dailyItem.id}\u001frecognition`], goalCompleted: true } } };
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
        <header class="popup-header"><div class="header-actions"><span id="due-badge"></span><button id="settings-button" type="button">Settings</button></div></header>
        <nav id="primary-navigation"><button id="today-tab" type="button">Today</button><button id="lessons-tab" type="button">Lessons</button></nav>
        <div id="popup-content" tabindex="0"></div>
      </main>`;
    await import("./index");
    await vi.waitFor(() => expect(content().textContent).toContain("Your next five."));
  });

  it("renders the appointment lesson through read, notice, practise, replay, selection, keep, and exit", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));

    lessonCard("A1 · Een afspraak maken").querySelector<HTMLButtonElement>("button")!.click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    expect(document.activeElement).toBe(content());
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(true);
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
    await vi.waitFor(() => expect(content().textContent).toContain("Completed · appointments and healthcare · (A1)"));

    const replay = lessonCard("A1 · Een afspraak maken").querySelector<HTMLButtonElement>("button")!;
    expect(replay.textContent).toBe("Replay");
    replay.click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(false);
  });

  it("keeps the weekly rhythm compact and exposes milestone copy to keyboard users", async () => {
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day")).toHaveLength(7));
    expect(content().textContent).toContain("First useful phrase saved");
    expect(content().textContent).toContain("Recognition and recall practised");
    expect(content().querySelector<HTMLElement>(".rhythm-day.grace")?.getAttribute("aria-label")).toContain("grace day");
    expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.tabIndex).toBe(0);
    expect(content().querySelector<HTMLButtonElement>(".period-tab.is-active")?.textContent).toBe("week");
    expect(content().querySelector<HTMLElement>(".rhythm-day.active")?.getAttribute("aria-label")).toContain("3 reviews, 1 saved item");
    expect(content().querySelector<HTMLElement>(".rhythm-day.idle")?.getAttribute("aria-label")).toContain("0 reviews, 0 saved items");
    button("month").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day").length).toBeGreaterThanOrEqual(28));
    const monthLabel = content().querySelector<HTMLElement>(".period-label")?.textContent;
    button("Previous period").click();
    await vi.waitFor(() => expect(content().querySelector<HTMLElement>(".period-label")?.textContent).not.toBe(monthLabel));
    button("year").click();
    await vi.waitFor(() => expect(content().querySelectorAll(".rhythm-day")).toHaveLength(365));
  });

  it("keeps Start Daily Five as the only primary action before the daily goal completes", async () => {
    expect(button("Start Daily Five").classList.contains("primary-button")).toBe(true);
    expect(button("Review more")).toBeFalsy();
  });

  it("offers Review more only after Daily Five completes", async () => {
    button("Start Daily Five").click();
    await vi.waitFor(() => expect(button("Show answer")).toBeTruthy());
    button("Show answer").click();
    await vi.waitFor(() => expect(button("Got it")).toBeTruthy());
    button("Got it").click();
    await vi.waitFor(() => expect(button("Review more")).toBeTruthy());
  });

  it("keeps the learner in an understandable error state when keeping candidates fails", async () => {
    keepFails = true;
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("Een afspraak maken"));
    lessonCard("A1 · Een afspraak maken").querySelector<HTMLButtonElement>("button")!.click();
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
    expect([...content().querySelectorAll<HTMLElement>(".lesson-card h1")].map((heading) => heading.textContent)).toEqual([
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
      lessonCard(title).querySelector<HTMLButtonElement>("button")!.click();
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

function lessonCard(title: string): HTMLElement {
  return [...content().querySelectorAll<HTMLElement>(".lesson-card")].find((card) => card.textContent?.includes(title.replace(/^[A-Z0-9]+ · /, "")))!;
}

function rhythmFixture() { const today = new Date(); const day = (offset: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset).getTime(); return { week: Array.from({ length: 7 }, (_, index) => ({ dayStartAt: day(index - 6), status: index === 5 ? "grace" as const : index === 6 ? "active" as const : "idle" as const })), activity: [{ dayStartAt: day(0), reviews: 3, saved: 1 }], resetCopy: "A fresh week starts whenever you return.", milestones: [{ id: "first-saved-chunk", label: "First useful phrase saved" }, { id: "balanced-practice", label: "Recognition and recall practised" }] }; }
