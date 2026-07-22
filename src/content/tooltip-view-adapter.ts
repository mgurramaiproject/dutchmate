import type { TranslateMessageResponse } from "./runtime-translation-client";
import type { ChunkConfirmation, ContextMission, RecallMission, SaveActionState } from "./webpage-lookup-module";

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
  showRecallOffer(selectedDutch: string, x: number, y: number): void;
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
      max-width: min(360px, calc(100vw - 24px));
      max-height: calc(100vh - 24px);
      box-sizing: border-box;
      overflow-y: auto;
      padding: 8px 10px;
      border: 1px solid #000;
      border-radius: 8px;
      background: #fff;
      color: #000;
      font: 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      pointer-events: auto;
      white-space: pre-line;
    }

    #hover-translate-tooltip .hover-translate-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 8px;
    }

    #hover-translate-tooltip .hover-translate-save {
      appearance: none;
      border: 1px solid rgba(249, 250, 251, 0.42);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      color: inherit;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      line-height: 1.2;
      padding: 4px 8px;
    }

    #hover-translate-tooltip .context-slip-tether { border-left: 4px solid #ff6f00; padding-left: 10px; }
    #hover-translate-tooltip .context-slip-kicker { font-size: 11px; font-weight: 800; margin: 0 0 4px; }
    #hover-translate-tooltip .context-slip-title, #hover-translate-tooltip .context-slip-context { font-family: Georgia, serif; }
    #hover-translate-tooltip .context-slip-title { font-size: 18px; margin: 0 28px 6px 0; }
    #hover-translate-tooltip .context-slip-context { margin: 0 0 10px; }
    #hover-translate-tooltip .context-slip-close { position: absolute; top: 7px; right: 7px; min-width: 44px; min-height: 44px; border: 1px solid #000; background: #fff; color: #000; font-size: 20px; }
    #hover-translate-tooltip .context-slip-fragments { display: flex; flex-wrap: wrap; gap: 6px; min-height: 40px; margin: 8px 0; }
    #hover-translate-tooltip .context-slip-fragment, #hover-translate-tooltip .context-slip-button { min-height: 44px; border: 1px solid #000; border-radius: 6px; background: #fff; color: #000; font: inherit; font-weight: 700; padding: 6px 10px; }
    #hover-translate-tooltip .context-slip-button.primary { background: #ff6f00; }
    #hover-translate-tooltip button:focus-visible { outline: 3px solid #ff6f00; outline-offset: 2px; }
    #hover-translate-tooltip .context-slip-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    #hover-translate-tooltip .context-slip-status { display: block; min-height: 20px; font-weight: 700; }

    #hover-translate-tooltip .hover-translate-save:disabled {
      cursor: default;
      opacity: 0.76;
    }

    #hover-translate-tooltip[data-state="loading"] {
      color: #dbeafe;
    }

    #hover-translate-tooltip[data-state="error"] {
      border-color: rgba(248, 113, 113, 0.65);
      background: #7f1d1d;
      color: #fee2e2;
    }

    #hover-translate-tooltip .hover-translate-row {
      display: block;
    }

    #hover-translate-tooltip .hover-translate-label {
      font-weight: 700;
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
        tooltip.textContent = `Save: ${chunkConfirmation.dutch}\nEnglish: ${chunkConfirmation.english ?? "unavailable"}\nTelugu: ${chunkConfirmation.telugu ?? "unavailable"}\nContext: ${chunkConfirmation.context ?? "unavailable"}`;
      } else if (response.ok && response.result.providerName === "multi-target") {
        renderMultiTargetTooltip(tooltip, truncateTooltipText(response.result.translatedText));
      } else {
        tooltip.textContent = truncateTooltipText(
          response.ok ? response.result.translatedText : response.error,
        );
      }

      renderSaveAction(
        tooltip,
        saveAction,
        callbacks.onSaveClick,
        (button) => {
          currentSaveButton = button;
        },
      );
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

    showRecallOffer(selectedDutch, x, y) {
      currentSaveButton = null;
      lastPosition = { x, y };
      rememberExternalFocus(tooltip, (element) => { returnFocus = element; });
      tooltip.removeAttribute("role");
      tooltip.dataset.state = "recall-offer";
      tooltip.textContent = "";
      const tether = document.createElement("section"); tether.className = "context-slip-tether";
      const kicker = document.createElement("p"); kicker.className = "context-slip-kicker"; kicker.textContent = "Seen before";
      const title = document.createElement("h3"); title.className = "context-slip-title"; title.lang = "nl"; title.textContent = selectedDutch;
      const actions = document.createElement("div"); actions.className = "context-slip-actions";
      const tryFromMemory = actionButton("Try from memory", callbacks.onTryFromMemory, true);
      actions.append(tryFromMemory, actionButton("Translate now", callbacks.onTranslateNow));
      tether.append(kicker, title, actions); tooltip.append(tether); positionTooltip(tooltip, x, y); tooltip.hidden = false;
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
  const title = document.createElement("h3"); title.className = "context-slip-title"; title.textContent = "What does this mean here?";
  const context = document.createElement("p"); context.className = "context-slip-context"; context.lang = "nl"; context.textContent = mission.pageContext;
  tether.append(close, kicker, title, context);
  if (!mission.revealed) {
    tether.append(actionButton("Show meaning", callbacks.onShowMeaning, true));
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
  close.addEventListener("click", callbacks.onClose);
  const kicker = document.createElement("p"); kicker.className = "context-slip-kicker"; kicker.textContent = "Rebuild in context";
  const title = document.createElement("h3"); title.className = "context-slip-title"; title.textContent = mission.result === "got-it" ? "Got it" : mission.result === "again" ? "Again" : "Put the Dutch back";
  const context = document.createElement("p"); context.className = "context-slip-context"; context.lang = "nl";
  context.textContent = (mission.pageContext ?? mission.selectedDutch).replace(mission.selectedDutch, "__________");
  tether.append(close, kicker, title, context);
  if (mission.result) {
    const status = document.createElement("span"); status.className = "context-slip-status"; status.setAttribute("role", "status"); status.textContent = mission.result === "got-it" ? "The Dutch fits." : `Here is the right order: ${mission.selectedDutch}`;
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
    const confirmation = document.createElement("p");
    confirmation.className = "context-slip-capture";
    confirmation.textContent = `Save: ${capture.chunkConfirmation.dutch}\nEnglish: ${capture.chunkConfirmation.english ?? "unavailable"}\nTelugu: ${capture.chunkConfirmation.telugu ?? "unavailable"}\nContext: ${capture.chunkConfirmation.context ?? "unavailable"}`;
    container.append(confirmation);
  }
  renderSaveAction(container, capture.saveAction, onSaveClick, registerSaveButton);
}

function fragmentBank(values: string[], label: string, onClick: (index: number) => void, disabled = false): HTMLDivElement {
  const bank = document.createElement("div"); bank.className = "context-slip-fragments"; bank.setAttribute("aria-label", label);
  values.forEach((value, index) => { const button = actionButton(value, () => onClick(index)); button.className = "context-slip-fragment"; button.dataset.contextSlipFocus = `fragment:${label}:${index}`; button.dataset.contextSlipFragment = value; button.disabled = disabled; bank.append(button); });
  return bank;
}

function actionButton(label: string, onClick: () => void, primary = false): HTMLButtonElement {
  const button = document.createElement("button"); button.type = "button"; button.className = `context-slip-button${primary ? " primary" : ""}`; button.dataset.contextSlipFocus = `action:${label}`; button.textContent = label; button.addEventListener("click", onClick); return button;
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

    const label = document.createElement("span");
    label.className = "hover-translate-label";
    label.textContent = line.slice(0, separatorIndex + 1);

    row.append(label, " " + line.slice(separatorIndex + 1).trimStart());
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

  tooltip.style.left = `${Math.min(x + offset, window.innerWidth - padding)}px`;
  tooltip.style.top = `${Math.min(y + offset, window.innerHeight - padding)}px`;

  const rect = tooltip.getBoundingClientRect();
  const left = Math.max(padding, Math.min(rect.left, window.innerWidth - rect.width - padding));
  const top = Math.max(padding, Math.min(rect.top, window.innerHeight - rect.height - padding));

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}
