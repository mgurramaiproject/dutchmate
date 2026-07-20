import {
  LEARNING_DELETE_MESSAGE,
  LEARNING_LIST_MESSAGE,
  LEARNING_DAILY_FIVE_MESSAGE,
  LEARNING_DAILY_FIVE_RESULT_MESSAGE,
  type LearningMessage,
  type LearningMessageResponse,
} from "../background/messages";
import type { LearningItem } from "../vocabulary/learning-record";
import type { DailyFiveDimension, DailyFiveResult, DailyFiveSnapshot } from "../vocabulary/daily-five";

export type LearningRuntimeApi = { runtime: { sendMessage(message: LearningMessage): Promise<LearningMessageResponse> } };
export type LearningClient = {
  list(): Promise<LearningItem[]>;
  delete(id: string): Promise<void>;
  getDailyFive(continueAfterCompletion?: boolean): Promise<DailyFiveSnapshot>;
  recordDailyFiveResult(itemId: string, dimension: DailyFiveDimension, result: DailyFiveResult): Promise<{ item: LearningItem; snapshot: DailyFiveSnapshot }>;
};

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
    async getDailyFive(continueAfterCompletion = false) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DAILY_FIVE_MESSAGE, payload: { continueAfterCompletion } });
      if (response.ok && "snapshot" in response.result) return response.result.snapshot;
      throw new Error(response.ok ? "Daily Five is unavailable." : response.error);
    },
    async recordDailyFiveResult(itemId, dimension, result) {
      const response = await extensionApi.runtime.sendMessage({ type: LEARNING_DAILY_FIVE_RESULT_MESSAGE, payload: { itemId, dimension, result } });
      if (response.ok && "item" in response.result && "snapshot" in response.result) return response.result;
      throw new Error(response.ok ? "Your result could not be saved." : response.error);
    },
  };
}
