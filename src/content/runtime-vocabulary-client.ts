import type { CreateOrMergeLearningItemInput, LearningItem } from "../vocabulary/learning-record";

const LEARNING_CREATE_OR_MERGE_MESSAGE = "dutchmate.learning.createOrMerge";
const LEARNING_LIST_MESSAGE = "dutchmate.learning.list";
const LEARNING_RECORD_ENCOUNTER_MESSAGE = "dutchmate.learning.recordEncounter";
const DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS = 7000;

export type RuntimeVocabularyExtensionApi = { runtime: { lastError?: { message?: string }; sendMessage(message: unknown, callback: (response?: unknown) => void): void } };
export type RuntimeLearningSaveResponse = { ok: true; result: { item: LearningItem } } | { ok: false; error: string };
export type RuntimeLearningListResponse = { ok: true; result: { items: LearningItem[] } } | { ok: false; error: string };
export type RuntimeLearningEncounterResponse = { ok: true; result: { recorded: true } } | { ok: false; error: string };

export function requestRuntimeCreateLearningItem(api: RuntimeVocabularyExtensionApi | undefined, payload: CreateOrMergeLearningItemInput, timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS): Promise<RuntimeLearningSaveResponse> {
  return requestRuntimeLearningMessage(api, { type: LEARNING_CREATE_OR_MERGE_MESSAGE, payload }, timeoutMs, (response): response is RuntimeLearningSaveResponse => typeof response === "object" && response !== null && "ok" in response && (response.ok === false ? "error" in response && typeof response.error === "string" : "result" in response && typeof response.result === "object" && response.result !== null && "item" in response.result));
}
export function requestRuntimeLearningItems(api: RuntimeVocabularyExtensionApi | undefined, timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS): Promise<RuntimeLearningListResponse> {
  return requestRuntimeLearningMessage(api, { type: LEARNING_LIST_MESSAGE }, timeoutMs, (response): response is RuntimeLearningListResponse => typeof response === "object" && response !== null && "ok" in response && (response.ok === false ? "error" in response && typeof response.error === "string" : "result" in response && typeof response.result === "object" && response.result !== null && "items" in response.result && Array.isArray(response.result.items)));
}
export function requestRuntimeRecordLearningEncounter(api: RuntimeVocabularyExtensionApi | undefined, payload: { id: string; context: string }, timeoutMs = DEFAULT_RUNTIME_RESPONSE_TIMEOUT_MS): Promise<RuntimeLearningEncounterResponse> {
  return requestRuntimeLearningMessage(api, { type: LEARNING_RECORD_ENCOUNTER_MESSAGE, payload }, timeoutMs, (response): response is RuntimeLearningEncounterResponse => typeof response === "object" && response !== null && "ok" in response && (response.ok === false ? "error" in response && typeof response.error === "string" : "result" in response && typeof response.result === "object" && response.result !== null && "recorded" in response.result && response.result.recorded === true));
}
function requestRuntimeLearningMessage<T>(api: RuntimeVocabularyExtensionApi | undefined, message: unknown, timeoutMs: number, isResponse: (response: unknown) => response is T): Promise<T | { ok: false; error: string }> {
  if (!api) return Promise.resolve({ ok: false, error: "Extension runtime is unavailable." });
  return new Promise((resolve) => { let settled = false; const finish = (response: T | { ok: false; error: string }) => { if (!settled) { settled = true; globalThis.clearTimeout(timeout); resolve(response); } }; const timeout = globalThis.setTimeout(() => finish({ ok: false, error: "Learning request timed out before the extension background worker responded." }), timeoutMs); api.runtime.sendMessage(message, (response) => { if (api.runtime.lastError) return finish({ ok: false, error: api.runtime.lastError.message ?? "Learning request failed." }); finish(isResponse(response) ? response : { ok: false, error: "No learning response received." }); }); });
}
