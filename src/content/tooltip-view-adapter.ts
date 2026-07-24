import type { TranslateMessageResponse } from "./runtime-translation-client";
import type { ChunkConfirmation, ContextMission, RecallMission, SaveActionState } from "./webpage-lookup-module";
import { getSimpleTeluguPhonetics } from "../vocabulary/telugu-phonetics";

const MAX_TOOLTIP_TEXT_LENGTH = 1000;

export type TooltipViewAdapter = {
  isTooltipEvent(event: Event): boolean;
  showLoading(message: string, x: number, y: number): void;
  showError(message: string, x: number, y: number): void;
  showResult(
    response: TranslateMessageResponse,
    x: number,
    y: number,
    saveAction: SaveActionState,
    chunkConfirmation?: ChunkConfirmation,
    practiceAvailable?: true,
  ): void;
  showMission(mission: ContextMission): void;
  showRecallOffer(selectedDutch: string, pageContext: string, x: number, y: number): void;
  showRecallMission(mission: RecallMission): void;
  showSeenBefore(): void;
  updateSaveButton(saveAction: SaveActionState): void;
  hide(): void;
};

export function createTooltipViewAdapter(callbacks: {
  onSaveClick(): void;
  onPractice(): void;
  onTryFromMemory(): void;
  onTranslateNow(): void;
  onShowMeaning(): void;
  onRecallResult(result: "again" | "got-it"): void;
  onReplayRecall(): void;
  onAddFragment(index: number): void;
  onRemoveFragment(index: number): void;
  onReset(): void;
  onCheck(): void;
  onReplay(): void;
  onClose(): void;
}): TooltipViewAdapter {
  const tooltip = document.createElement("div");
  tooltip.id = "hover-translate-tooltip";
  tooltip.setAttribute("role", "status");
  tooltip.hidden = true;
  tooltip.textContent = "Translation will appear here.";

  const style = document.createElement("style");
  style.textContent = `
    #hover-translate-tooltip {
      position: fixed;
      z-index: 2147483647;
      min-width: min(220px, calc(100vw - 24px));
      max-width: min(360px, calc(100vw - 24px));
      max-height: calc(100vh - 24px);
      box-sizing: border-box;
      overflow-y: auto;
      padding: 12px 14px;
      border: 1px solid #000;
      border-radius: 8px;
      background: #fff;
      color: #000;
      font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: auto;
      white-space: normal;
    }

    #hover-translate-tooltip .hover-translate-actions {
      display: flex;
      gap: 8px;
      align-items: stretch;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(0, 0, 0, .16);
    }

    #hover-translate-tooltip .hover-translate-save {
      appearance: none;
      min-height: 44px;
      border: 1px solid #000;
      border-radius: 8px;
      background: #000;
      color: #fff;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      line-height: 1.2;
      padding: 6px 10px;
      width: 100%;
    }

    #hover-translate-tooltip .context-slip-tether { display: grid; gap: 10px; border-left: 4px solid #ff6f00; padding-left: 10px; }
    #hover-translate-tooltip .context-slip-kicker { color: #000; font-size: 11px; font-weight: 800; letter-spacing: .05em; margin: 0; text-transform: uppercase; }
    #hover-translate-tooltip .context-slip-title, #hover-translate-tooltip .context-slip-context { font-family: Georgia, serif; }
    #hover-translate-tooltip .context-slip-title { font-size: 19px; line-height: 1.1; margin: 0 40px 0 0; overflow-wrap: anywhere; }
    #hover-translate-tooltip .context-slip-context { margin: 0; padding: 8px 10px; border-left: 2px solid rgba(255, 111, 0, .42); background: rgba(255, 111, 0, .08); font-size: 14px; line-height: 1.4; }
    #hover-translate-tooltip .context-slip-copy, #hover-translate-tooltip .context-slip-prompt { margin: 0; color: rgba(0, 0, 0, .72); font-size: 13px; line-height: 1.45; }
    #hover-translate-tooltip .context-slip-prompt { color: #000; font-weight: 750; }
    #hover-translate-tooltip .context-slip-hidden-answer { margin: 0; padding: 9px 10px; border: 1px dashed rgba(0, 0, 0, .34); background: rgba(0, 0, 0, .035); font-size: 13px; }
    #hover-translate-tooltip .context-slip-result { display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center; padding: 11px; border: 1px solid #000; border-left: 6px solid #ff6f00; border-radius: 7px; background: #fff; }
    #hover-translate-tooltip .context-slip-result-mark { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 50%; background: #000; color: #fff; font-weight: 900; }
    #hover-translate-tooltip .context-slip-result-title { display: block; font-family: Georgia, serif; font-size: 17px; line-height: 1.05; }
    #hover-translate-tooltip .context-slip-result-copy { display: block; margin-top: 3px; color: rgba(0, 0, 0, .72); font-size: 13px; line-height: 1.35; }
    #hover-translate-tooltip .context-slip-capture { display: grid; gap: 0; border: 1px solid rgba(0, 0, 0, .28); border-radius: 7px; overflow: hidden; }
    #hover-translate-tooltip .context-slip-capture-heading { margin: 0; padding: 8px 10px; background: rgba(255, 111, 0, .12); color: #000; font-size: 11px; font-weight: 850; letter-spacing: .05em; text-transform: uppercase; }
    #hover-translate-tooltip .context-slip-details { display: grid; margin: 0; }
    #hover-translate-tooltip .context-slip-detail { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 8px; padding: 8px 10px; border-top: 1px solid rgba(0, 0, 0, .15); }
    #hover-translate-tooltip .context-slip-detail dt { color: rgba(0, 0, 0, .62); font-size: 10px; font-weight: 850; letter-spacing: .05em; text-transform: uppercase; }
    #hover-translate-tooltip .context-slip-detail dd { margin: 0; overflow-wrap: anywhere; font-size: 13px; line-height: 1.35; }
    #hover-translate-tooltip .context-slip-close { position: absolute; top: 7px; right: 7px; min-width: 44px; min-height: 44px; border: 1px solid #000; border-radius: 8px; background: #fff; color: #000; font-size: 20px; }
    #hover-translate-tooltip .context-slip-fragments { display: flex; flex-wrap: wrap; gap: 6px; min-height: 40px; margin: 8px 0; }
    #hover-translate-tooltip .context-slip-fragment, #hover-translate-tooltip .context-slip-button { min-height: 44px; border: 1px solid #000; border-radius: 6px; background: #fff; color: #000; font: inherit; font-weight: 700; padding: 6px 10px; }
    #hover-translate-tooltip .context-slip-button.primary { background: #ff6f00; }
    #hover-translate-tooltip button:focus-visible { outline: 3px solid #ff6f00; outline-offset: 2px; }
    #hover-translate-tooltip .context-slip-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    #hover-translate-tooltip .context-slip-status { display: block; min-height: 20px; font-weight: 700; }
    #hover-translate-tooltip .hover-translate-result { margin: 0; font-family: Georgia, serif; font-size: 18px; line-height: 1.25; overflow-wrap: anywhere; }
    #hover-translate-tooltip .hover-translate-row { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px; align-items: baseline; padding: 5px 0; }
    #hover-translate-tooltip .hover-translate-label { color: #000; font-size: 11px; font-weight: 850; letter-spacing: .04em; text-transform: uppercase; }
    #hover-translate-tooltip .hover-translate-value { min-width: 0; overflow-wrap: anywhere; }
    #hover-translate-tooltip .hover-translate-phonetics { grid-column: 2; color: rgba(0, 0, 0, .68); font-size: 12px; }
    #hover-translate-tooltip .context-slip-fragment:hover:not(:disabled), #hover-translate-tooltip .context-slip-button:hover:not(:disabled), #hover-translate-tooltip .context-slip-close:hover:not(:disabled), #hover-translate-tooltip .hover-translate-save:hover:not(:disabled) { background: #ff6f00; color: #000; }
    #hover-translate-tooltip .context-slip-button.primary:hover:not(:disabled) { background: #000; color: #fff; }

    #hover-translate-tooltip .hover-translate-save:disabled {
      cursor: default;
      opacity: 0.76;
    }

    #hover-translate-tooltip[data-state="loading"] {
      min-width: 132px;
      padding: 11px 14px;
      border-left: 4px solid #ff6f00;
      background: #fff;
      color: #000;
      font-size: 14px;
      font-weight: 750;
      letter-spacing: .01em;
    }

    #hover-translate-tooltip[data-state="error"] {
      border-left: 4px solid #000;
      background: #fff;
      color: #000;
    }

  `;

  document.documentElement.append(style, tooltip);

  let currentSaveButton: HTMLButtonElement | null = null;
  let returnFocus: HTMLElement | null = null;
  let lastPosition = { x: 12, y: 12 };

  window.addEventListener("resize", () => {
    if (!tooltip.hidden) positionTooltip(tooltip, lastPosition.x, lastPosition.y);
  });

  return {
    isTooltipEvent(event) {
      return event.target instanceof Node && tooltip.contains(event.target);
    },

    showLoading(message, x, y) {
      currentSaveButton = null;
      lastPosition = { x, y };
      tooltip.setAttribute("role", "status");
      tooltip.dataset.state = "loading";
      tooltip.textContent = message;
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
    },

    showError(message, x, y) {
      currentSaveButton = null;
      lastPosition = { x, y };
      tooltip.setAttribute("role", "status");
      tooltip.dataset.state = "error";
      tooltip.textContent = message;
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
    },

    showResult(response, x, y, saveAction, chunkConfirmation, practiceAvailable) {
      currentSaveButton = null;
      lastPosition = { x, y };
      rememberExternalFocus(tooltip, (element) => { returnFocus = element; });
      tooltip.setAttribute("role", "status");
      tooltip.dataset.state = response.ok ? "success" : "error";

      if (chunkConfirmation) {
        tooltip.textContent = "";
        renderChunkConfirmation(tooltip, chunkConfirmation);
      } else if (response.ok && response.result.providerName === "multi-target") {
        renderMultiTargetTooltip(tooltip, truncateTooltipText(response.result.translatedText));
      } else {
        const result = document.createElement("p");
        result.className = "hover-translate-result";
        result.textContent = truncateTooltipText(response.ok ? response.result.translatedText : response.error);
        tooltip.replaceChildren(result);
      }

      if (response.ok) {
        renderSaveAction(
          tooltip,
          saveAction,
          callbacks.onSaveClick,
          (button) => {
            currentSaveButton = button;
          },
        );
      }
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
      if (practiceAvailable) renderPracticeAction(tooltip, callbacks.onPractice);
    },

    updateSaveButton(saveAction) {
      if (!currentSaveButton || saveAction.status === "hidden") {
        return;
      }

      currentSaveButton.disabled = saveAction.disabled;
      currentSaveButton.textContent = saveAction.label;
      currentSaveButton.title = saveAction.status === "retry" ? saveAction.title : "";
    },

    showSeenBefore() {
      if (!tooltip.hidden && !tooltip.querySelector(".hover-translate-seen-before")) renderSeenBefore(tooltip);
    },

    showMission(mission) {
      currentSaveButton = null;
      tooltip.removeAttribute("role");
      const focus = tooltip.dataset.state === "mission" ? describeTooltipFocus(tooltip) : undefined;
      const isOpening = tooltip.dataset.state !== "mission";
      tooltip.dataset.state = "mission";
      renderMission(tooltip, mission, callbacks, (button) => {
        currentSaveButton = button;
      });
      positionTooltip(tooltip, lastPosition.x, lastPosition.y);
      tooltip.hidden = false;
      if (isOpening) tooltip.querySelector<HTMLButtonElement>(".context-slip-close")?.focus();
      else restoreTooltipFocus(tooltip, focus);
    },

    showRecallOffer(selectedDutch, pageContext, x, y) {
      currentSaveButton = null;
      lastPosition = { x, y };
      rememberExternalFocus(tooltip, (element) => { returnFocus = element; });
      tooltip.removeAttribute("role");
      tooltip.dataset.state = "recall-offer";
      tooltip.textContent = "";
      const tether = document.createElement("section"); tether.className = "context-slip-tether";
      const close = actionButton("×", callbacks.onClose); close.className = "context-slip-close"; close.setAttribute("aria-label", "Close Context Mission");
      const kicker = document.createElement("p"); kicker.className = "context-slip-kicker"; kicker.textContent = "Seen before";
      const title = document.createElement("h3"); title.className = "context-slip-title"; title.lang = "nl"; title.textContent = selectedDutch;
      const context = document.createElement("p"); context.className = "context-slip-context"; context.lang = "nl"; context.textContent = pageContext;
      const copy = document.createElement("p"); copy.className = "context-slip-copy"; copy.textContent = "You saved this. Try its meaning before DutchMate reveals it, or translate it as usual.";
      const actions = document.createElement("div"); actions.className = "context-slip-actions";
      const tryFromMemory = actionButton("Try from memory", callbacks.onTryFromMemory, true);
      actions.append(tryFromMemory, actionButton("Translate now", callbacks.onTranslateNow));
      tether.append(close, kicker, title, context, copy, actions); tooltip.append(tether); positionTooltip(tooltip, x, y); tooltip.hidden = false;
    },

    showRecallMission(mission) {
      currentSaveButton = null;
      tooltip.removeAttribute("role");
      const focus = tooltip.dataset.state === "recall-mission" ? describeTooltipFocus(tooltip) : undefined;
      const isOpening = tooltip.dataset.state !== "recall-mission";
      tooltip.dataset.state = "recall-mission";
      renderRecallMission(tooltip, mission, callbacks);
      tooltip.hidden = false;
      positionTooltip(tooltip, lastPosition.x, lastPosition.y);
      if (isOpening) tooltip.querySelector<HTMLButtonElement>(".context-slip-close")?.focus();
      else restoreTooltipFocus(tooltip, focus);
    },

    hide() {
      currentSaveButton = null;
      tooltip.hidden = true;
      delete tooltip.dataset.state;
      if (returnFocus?.isConnected) returnFocus.focus();
      returnFocus = null;
    },
  };
}

function renderRecallMission(tooltip: HTMLDivElement, mission: RecallMission, callbacks: Parameters<typeof createTooltipViewAdapter>[0]): void {
  tooltip.textContent = "";
  const tether = document.createElement("section"); tether.className = "context-slip-tether";
  const close = actionButton("×", callbacks.onClose); close.className = "context-slip-close"; close.setAttribute("aria-label", "Close Context Mission");
  const kicker = document.createElement("p"); kicker.className = "context-slip-kicker"; kicker.textContent = "Recall meaning";
  const title = document.createElement("h3"); title.className = "context-slip-title"; title.lang = "nl"; title.textContent = mission.selectedDutch;
  const prompt = document.createElement("p"); prompt.className = "context-slip-prompt"; prompt.textContent = "What does this mean here?";
  const context = document.createElement("p"); context.className = "context-slip-context"; context.lang = "nl"; context.textContent = mission.pageContext;
  tether.append(close, kicker, title, prompt, context);
  if (!mission.revealed) {
    const hiddenAnswer = document.createElement("p"); hiddenAnswer.className = "context-slip-hidden-answer"; hiddenAnswer.textContent = "Think of the English or Telugu meaning before you reveal it.";
    const actions = document.createElement("div"); actions.className = "context-slip-actions"; actions.append(actionButton("Show meaning", callbacks.onShowMeaning, true));
    tether.append(hiddenAnswer, actions);
  } else {
    const meaning = document.createElement("p"); meaning.className = "context-slip-status"; meaning.setAttribute("role", "status");
    meaning.textContent = [mission.english && `English: ${mission.english}`, mission.telugu && `Telugu: ${mission.telugu}`].filter(Boolean).join("\n");
    tether.append(meaning);
    if (mission.result) {
      const result = document.createElement("p"); result.className = "context-slip-status"; result.setAttribute("role", "status"); result.textContent = mission.result === "got-it" ? "Got it" : "Again";
      tether.append(result, actionButton("Replay", callbacks.onReplayRecall), actionButton("Back to page", callbacks.onClose, true));
    } else if (mission.evidenceRecorded) {
      tether.append(actionButton("Back to page", callbacks.onClose, true));
    } else {
      const actions = document.createElement("div"); actions.className = "context-slip-actions";
      const again = actionButton("Again", () => callbacks.onRecallResult("again"));
      const gotIt = actionButton("Got it", () => callbacks.onRecallResult("got-it"), true);
      again.disabled = Boolean(mission.submitting); gotIt.disabled = Boolean(mission.submitting);
      actions.append(again, gotIt); tether.append(actions);
    }
  }
  if (mission.error) { const error = document.createElement("p"); error.className = "context-slip-status"; error.setAttribute("role", "alert"); error.textContent = mission.error; tether.append(error, actionButton("Back to page", callbacks.onClose)); }
  tooltip.append(tether);
}

function renderPracticeAction(tooltip: HTMLDivElement, onPractice: () => void): void {
  const actions = tooltip.querySelector(".hover-translate-actions") ?? tooltip.appendChild(document.createElement("div"));
  actions.classList.add("hover-translate-actions");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "context-slip-button primary";
  button.textContent = "Practise this";
  button.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); onPractice(); });
  actions.append(button);
}

function renderMission(
  tooltip: HTMLDivElement,
  mission: ContextMission,
  callbacks: Parameters<typeof createTooltipViewAdapter>[0],
  registerSaveButton: (button: HTMLButtonElement | null) => void,
): void {
  tooltip.textContent = "";
  const tether = document.createElement("section");
  tether.className = "context-slip-tether";
  const close = document.createElement("button");
  close.type = "button"; close.className = "context-slip-close"; close.setAttribute("aria-label", "Close Context Mission"); close.textContent = "×";
  close.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); callbacks.onClose(); });
  const kicker = document.createElement("p"); kicker.className = "context-slip-kicker"; kicker.textContent = "Rebuild in context";
  const title = document.createElement("h3"); title.className = "context-slip-title"; title.textContent = mission.result === "got-it" ? "Correct" : mission.result === "again" ? "Try again" : "Put the Dutch back";
  const context = document.createElement("p"); context.className = "context-slip-context"; context.lang = "nl";
  context.textContent = (mission.pageContext ?? mission.selectedDutch).replace(mission.selectedDutch, "__________");
  tether.append(close, kicker, title, context);
  if (mission.result) {
    const status = renderMissionResult(mission);
    const actions = document.createElement("div"); actions.className = "context-slip-actions";
    actions.append(actionButton("Replay", callbacks.onReplay), actionButton("Back to page", callbacks.onClose, true));
    tether.append(status, actions);
    if (mission.capture) {
      renderMissionCapture(tether, mission.capture, callbacks.onSaveClick, registerSaveButton);
    }
  } else {
    const placed = fragmentBank(mission.placed, "Your answer", callbacks.onRemoveFragment, Boolean(mission.evidence?.submitting));
    const available = fragmentBank(mission.available, "Available words", callbacks.onAddFragment, Boolean(mission.evidence?.submitting));
    const actions = document.createElement("div"); actions.className = "context-slip-actions";
    const reset = actionButton("Reset", callbacks.onReset); reset.disabled = Boolean(mission.evidence?.submitting);
    const check = actionButton("Check", callbacks.onCheck, true); check.disabled = mission.placed.length !== mission.available.length + mission.placed.length || Boolean(mission.evidence?.submitting);
    actions.append(reset, check);
    const status = document.createElement("span"); status.className = "context-slip-status"; status.setAttribute("aria-live", "polite"); status.textContent = `${mission.placed.length} of ${mission.placed.length + mission.available.length} words placed`;
    tether.append(placed, available, actions, status);
    if (mission.evidence?.error) {
      const error = document.createElement("p"); error.className = "context-slip-status"; error.setAttribute("role", "alert"); error.textContent = mission.evidence.error;
      tether.append(error);
    }
  }
  tooltip.append(tether);
}

function renderMissionCapture(
  container: HTMLElement,
  capture: NonNullable<ContextMission["capture"]>,
  onSaveClick: () => void,
  registerSaveButton: (button: HTMLButtonElement | null) => void,
): void {
  if (capture.chunkConfirmation) {
    renderChunkConfirmation(container, capture.chunkConfirmation);
  }
  renderSaveAction(container, capture.saveAction, onSaveClick, registerSaveButton);
}

function renderChunkConfirmation(container: HTMLElement, confirmationData: ChunkConfirmation): void {
  const confirmation = document.createElement("section");
  confirmation.className = "context-slip-capture";
  const heading = document.createElement("p"); heading.className = "context-slip-capture-heading"; heading.textContent = "Keep this phrase";
  const details = document.createElement("dl"); details.className = "context-slip-details";
  for (const [label, value] of [
    ["Dutch", confirmationData.dutch],
    ["English", confirmationData.english ?? "Unavailable"],
    ["Telugu", confirmationData.telugu ?? "Unavailable"],
    ["Context", confirmationData.context ?? "Unavailable"],
  ]) {
    const row = document.createElement("div"); row.className = "context-slip-detail"; row.dataset.label = label;
    const term = document.createElement("dt"); term.textContent = label;
    const description = document.createElement("dd"); description.textContent = value;
    row.append(term, description); details.append(row);
  }
  confirmation.append(heading, details);
  container.append(confirmation);
}

function fragmentBank(values: string[], label: string, onClick: (index: number) => void, disabled = false): HTMLDivElement {
  const bank = document.createElement("div"); bank.className = "context-slip-fragments"; bank.setAttribute("aria-label", label);
  values.forEach((value, index) => { const button = actionButton(value, () => onClick(index)); button.className = "context-slip-fragment"; button.dataset.contextSlipFocus = `fragment:${label}:${index}`; button.dataset.contextSlipFragment = value; button.disabled = disabled; bank.append(button); });
  return bank;
}

function actionButton(label: string, onClick: () => void, primary = false): HTMLButtonElement {
  const button = document.createElement("button"); button.type = "button"; button.className = `context-slip-button${primary ? " primary" : ""}`; button.dataset.contextSlipFocus = `action:${label}`; button.textContent = label; button.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); onClick(); }); return button;
}

function renderMissionResult(mission: ContextMission): HTMLElement {
  const result = document.createElement("section"); result.className = "context-slip-result"; result.setAttribute("role", "status");
  const mark = document.createElement("span"); mark.className = "context-slip-result-mark"; mark.textContent = mission.result === "got-it" ? "✓" : "↺";
  const copy = document.createElement("span");
  const title = document.createElement("strong"); title.className = "context-slip-result-title"; title.textContent = mission.result === "got-it" ? "Correct" : "Try again";
  const detail = document.createElement("span"); detail.className = "context-slip-result-copy"; detail.textContent = mission.result === "got-it" ? "Your word order matches the original sentence." : `The right order is: ${mission.selectedDutch}`;
  copy.append(title, detail); result.append(mark, copy);
  return result;
}

type TooltipFocus = { key: string; fragment?: string };

function describeTooltipFocus(tooltip: HTMLDivElement): TooltipFocus | undefined {
  const active = document.activeElement;
  if (!(active instanceof HTMLButtonElement) || !tooltip.contains(active)) return undefined;
  return active.dataset.contextSlipFocus ? { key: active.dataset.contextSlipFocus, fragment: active.dataset.contextSlipFragment } : undefined;
}

function restoreTooltipFocus(tooltip: HTMLDivElement, focus: TooltipFocus | undefined): void {
  if (!focus) return;
  const buttons = Array.from(tooltip.querySelectorAll<HTMLButtonElement>("button"));
  const candidate = (focus.fragment ? buttons.find((button) => button.dataset.contextSlipFragment === focus.fragment && !button.disabled) : undefined)
    ?? buttons.find((button) => button.dataset.contextSlipFocus === focus.key && !button.disabled);
  candidate?.focus();
}

function rememberExternalFocus(tooltip: HTMLDivElement, remember: (element: HTMLElement) => void): void {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body && !tooltip.contains(active)) remember(active);
}

function renderSeenBefore(tooltip: HTMLDivElement): void {
  const cue = document.createElement("span");
  cue.className = "hover-translate-seen-before";
  cue.textContent = "Seen before";
  tooltip.append(" ", cue);
}

function renderSaveAction(
  tooltip: HTMLElement,
  saveAction: SaveActionState,
  onSaveClick: () => void,
  registerButton: (button: HTMLButtonElement | null) => void,
): void {
  registerButton(null);

  if (saveAction.status === "hidden") {
    return;
  }

  const actions = document.createElement("div");
  actions.className = "hover-translate-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "hover-translate-save";
  saveButton.disabled = saveAction.disabled;
  saveButton.textContent = saveAction.label;
  saveButton.title = saveAction.status === "retry" ? saveAction.title : "";
  registerButton(saveButton);
  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSaveClick();
  });

  actions.append(saveButton);
  tooltip.appendChild(actions);
}

function renderMultiTargetTooltip(tooltip: HTMLDivElement, text: string): void {
  const rows = text.split("\n").map((line) => {
    const separatorIndex = line.indexOf(":");
    const row = document.createElement("span");
    row.className = "hover-translate-row";

    if (separatorIndex === -1) {
      row.textContent = line;
      return row;
    }

    const labelText = line.slice(0, separatorIndex + 1);
    const valueText = line.slice(separatorIndex + 1).trimStart();
    const label = document.createElement("span");
    label.className = "hover-translate-label";
    label.textContent = labelText;

    const value = document.createElement("span");
    value.className = "hover-translate-value";
    value.textContent = valueText;

    row.append(label, value);
    if (labelText.toLocaleLowerCase().startsWith("telugu:")) {
      const phonetics = getSimpleTeluguPhonetics(valueText);
      if (phonetics) {
        const helper = document.createElement("small");
        helper.className = "hover-translate-phonetics";
        helper.textContent = `Say it: ${phonetics}`;
        row.append(helper);
      }
    }
    return row;
  });

  tooltip.textContent = "";
  for (const row of rows) {
    tooltip.appendChild(row);
  }
}

function truncateTooltipText(text: string): string {
  if (text.length <= MAX_TOOLTIP_TEXT_LENGTH) {
    return text;
  }

  return `${text.slice(0, MAX_TOOLTIP_TEXT_LENGTH).trimEnd()}...`;
}

function positionTooltip(tooltip: HTMLDivElement, x: number, y: number): void {
  const padding = 12;
  const offset = 14;
  const rect = tooltip.getBoundingClientRect();
  const roomOnRight = window.innerWidth - (x + offset) >= rect.width + padding;
  const preferredLeft = roomOnRight ? x + offset : x - rect.width - offset;
  const roomBelow = window.innerHeight - (y + offset) >= rect.height + padding;
  const preferredTop = roomBelow ? y + offset : y - rect.height - offset;
  const left = Math.max(padding, Math.min(preferredLeft, window.innerWidth - rect.width - padding));
  const top = Math.max(padding, Math.min(preferredTop, window.innerHeight - rect.height - padding));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}
