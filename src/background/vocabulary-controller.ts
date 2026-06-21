import {
  CLEAR_VOCABULARY_MESSAGE,
  DELETE_VOCABULARY_MESSAGE,
  LIST_VOCABULARY_MESSAGE,
  SAVE_VOCABULARY_BATCH_MESSAGE,
  SAVE_VOCABULARY_MESSAGE,
  type VocabularyMessage,
  type VocabularyMessageResponse,
} from "./messages";
import type { SavedVocabularyStore } from "../vocabulary/saved-vocabulary";

export async function handleVocabularyMessage(
  message: VocabularyMessage,
  store: SavedVocabularyStore,
): Promise<VocabularyMessageResponse> {
  try {
    if (message.type === SAVE_VOCABULARY_MESSAGE) {
      return {
        ok: true,
        result: await store.save(message.payload),
      };
    }

    if (message.type === SAVE_VOCABULARY_BATCH_MESSAGE) {
      const results = [];

      for (const entry of message.payload.entries) {
        results.push(await store.save(entry));
      }

      return {
        ok: true,
        result: {
          results,
        },
      };
    }

    if (message.type === LIST_VOCABULARY_MESSAGE) {
      return {
        ok: true,
        result: {
          entries: await store.list(),
        },
      };
    }

    if (message.type === DELETE_VOCABULARY_MESSAGE) {
      await store.delete(message.payload.id);
      return {
        ok: true,
        result: {
          deleted: true,
        },
      };
    }

    if (message.type === CLEAR_VOCABULARY_MESSAGE) {
      await store.clear();
      return {
        ok: true,
        result: {
          cleared: true,
        },
      };
    }

    return {
      ok: false,
      error: "Unsupported vocabulary message.",
    };
  } catch {
    return {
      ok: false,
      error: "Saved vocabulary is unavailable.",
    };
  }
}
