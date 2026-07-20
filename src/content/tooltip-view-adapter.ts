import type { TranslateMessageResponse } from "./runtime-translation-client";
import type { ChunkConfirmation, SaveActionState } from "./webpage-lookup-module";

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
  ): void;
  showSeenBefore(): void;
  updateSaveButton(saveAction: SaveActionState): void;
  hide(): void;
};

export function createTooltipViewAdapter(onSaveClick: () => void): TooltipViewAdapter {
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
      padding: 8px 10px;
      border: 1px solid rgba(15, 23, 42, 0.18);
      border-radius: 6px;
      background: #111827;
      color: #f9fafb;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);
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

  return {
    isTooltipEvent(event) {
      return event.target instanceof Node && tooltip.contains(event.target);
    },

    showLoading(message, x, y) {
      currentSaveButton = null;
      tooltip.dataset.state = "loading";
      tooltip.textContent = message;
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
    },

    showError(message, x, y) {
      currentSaveButton = null;
      tooltip.dataset.state = "error";
      tooltip.textContent = message;
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
    },

    showResult(response, x, y, saveAction, chunkConfirmation) {
      currentSaveButton = null;
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
        onSaveClick,
        (button) => {
          currentSaveButton = button;
        },
      );
      positionTooltip(tooltip, x, y);
      tooltip.hidden = false;
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

    hide() {
      currentSaveButton = null;
      tooltip.hidden = true;
      delete tooltip.dataset.state;
    },
  };
}

function renderSeenBefore(tooltip: HTMLDivElement): void {
  const cue = document.createElement("span");
  cue.className = "hover-translate-seen-before";
  cue.textContent = "Seen before";
  tooltip.append(" ", cue);
}

function renderSaveAction(
  tooltip: HTMLDivElement,
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
