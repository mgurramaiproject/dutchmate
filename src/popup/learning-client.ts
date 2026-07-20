import {
  LEARNING_DELETE_MESSAGE,
  LEARNING_LIST_MESSAGE,
  type LearningMessage,
  type LearningMessageResponse,
} from "../background/messages";
import type { LearningItem } from "../vocabulary/learning-record";

export type LearningRuntimeApi = { runtime: { sendMessage(message: LearningMessage): Promise<LearningMessageResponse> } };
export type LearningClient = { list(): Promise<LearningItem[]>; delete(id: string): Promise<void> };

export function createLearningClient(extensionApi: LearningRuntimeApi): LearningClient {
  return {
    async list() {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_LIST_MESSAGE });
      if (response.ok && "items" in response.result) return response.result.items;
      throw new Error(response.ok ? "Learning items are unavailable." : response.error);
    },
    async delete(id) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DELETE_MESSAGE, payload: { id } });
      if (!response.ok || !("deleted" in response.result) || response.result.deleted !== true) throw new Error(response.ok ? "Learning item could not be deleted." : response.error);
    },
  };
}
