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

  beforeEach(async () => {
    vi.resetModules();
    progressByLesson = {};
    keepFails = false;
    runtime.sendMessage.mockImplementation(async (message: { type: string; payload?: Record<string, unknown> }) => {
      if (message.type === "dutchmate.learning.list") return { ok: true, result: { items: [] } };
      if (message.type === "dutchmate.learning.rhythm") return { ok: true, result: { rhythm: { week: [], resetCopy: null, milestones: [] } } };
      if (message.type === "dutchmate.learning.dailyFive") return { ok: true, result: { snapshot: { createdAt: 1, dayStartAt: 0, tasks: [], completedTaskIds: [], goalCompleted: false } } };
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
    await vi.waitFor(() => expect(content().textContent).toContain("One calm practice action."));
  });

  it("renders the appointment lesson through read, notice, practise, replay, selection, keep, and exit", async () => {
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("A1 · Een afspraak maken"));

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
    await vi.waitFor(() => expect(content().textContent).toContain("Completed · replay any time"));

    const replay = lessonCard("A1 · Een afspraak maken").querySelector<HTMLButtonElement>("button")!;
    expect(replay.textContent).toBe("Replay lesson");
    replay.click();
    await vi.waitFor(() => expect(button("Exit lesson")).toBeTruthy());
    button("Exit lesson").click();
    await vi.waitFor(() => expect(content().textContent).toContain("A1 · Een afspraak maken"));
    expect(document.querySelector("#primary-navigation")?.hasAttribute("hidden")).toBe(false);
  });

  it("keeps the learner in an understandable error state when keeping candidates fails", async () => {
    keepFails = true;
    button("Lessons").click();
    await vi.waitFor(() => expect(content().textContent).toContain("A1 · Een afspraak maken"));
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
    await vi.waitFor(() => expect(content().textContent).toContain("A1 · Ik heb last van…"));
    expect([...content().querySelectorAll<HTMLElement>(".lesson-card h1")].map((heading) => heading.textContent)).toEqual([
      "A0 · Hallo, ik ben…",
      "A1 · Kunt u dat herhalen?",
      "A1 · Ik wil graag bestellen",
      "A1 · Kan ik met pin betalen?",
      "A1 · Waar moet ik overstappen?",
      "A1 · Mijn trein is vertraagd",
      "A1 · Een afspraak maken",
      "A1 · Ik heb last van…",
      "A1 · Er is iets kapot",
      "A1 · Ik ben beschikbaar op…",
      "A1 · Wat moet ik meenemen?",
      "A2 · Wat staat er in deze brief?",
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
  return [...content().querySelectorAll<HTMLElement>(".lesson-card")].find((card) => card.textContent?.includes(title))!;
}
