import type { MvpLanguageCode } from "../shared/languages";

export const SAVED_VOCABULARY_STORAGE_KEY = "dutchmate.savedVocabulary.v1";
export const DEFAULT_SAVED_VOCABULARY_MAX_ENTRIES = 1000;

export type SavedVocabularySourceLanguage = MvpLanguageCode | "auto";

export type SavedVocabularyEntry = {
  id: string;
  text: string;
  normalizedText: string;
  sourceLanguage: SavedVocabularySourceLanguage;
  detectedSourceLanguage?: MvpLanguageCode;
  targetLanguage: MvpLanguageCode;
  translatedText: string;
  providerName: string;
  createdAt: number;
  updatedAt: number;
};

export type SaveVocabularyInput = {
  text: string;
  sourceLanguage: SavedVocabularySourceLanguage;
  detectedSourceLanguage?: MvpLanguageCode;
  targetLanguage: MvpLanguageCode;
  translatedText: string;
  providerName: string;
};

export type SaveVocabularyResult =
  | {
      status: "saved";
      entry: SavedVocabularyEntry;
    }
  | {
      status: "already-saved";
      entry: SavedVocabularyEntry;
    }
  | {
      status: "not-eligible";
      reason: "not-single-word";
    }
  | {
      status: "max-entries-reached";
      maxEntries: number;
    };

export type SavedVocabularyStorage = {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
};

type SavedVocabularyData = {
  entries: Record<string, SavedVocabularyEntry>;
};

type SavedVocabularyStoreOptions = {
  storageKey?: string;
  maxEntries?: number;
  now?: () => number;
};

export class SavedVocabularyStore {
  private readonly storageKey: string;
  private readonly maxEntries: number;
  private readonly now: () => number;

  constructor(
    private readonly storage: SavedVocabularyStorage,
    options: SavedVocabularyStoreOptions = {},
  ) {
    this.storageKey = options.storageKey ?? SAVED_VOCABULARY_STORAGE_KEY;
    this.maxEntries = options.maxEntries ?? DEFAULT_SAVED_VOCABULARY_MAX_ENTRIES;
    this.now = options.now ?? Date.now;
  }

  async list(): Promise<SavedVocabularyEntry[]> {
    const data = await this.readData();
    return Object.values(data.entries).sort(
      (first, second) => second.createdAt - first.createdAt || first.id.localeCompare(second.id),
    );
  }

  async save(input: SaveVocabularyInput): Promise<SaveVocabularyResult> {
    const normalizedText = normalizeSavedVocabularyText(input.text);

    if (!isSingleSavedVocabularyWord(normalizedText)) {
      return {
        status: "not-eligible",
        reason: "not-single-word",
      };
    }

    const data = await this.readData();
    const id = getSavedVocabularyEntryId({
      ...input,
      text: normalizedText,
    });
    const existingEntry = data.entries[id];

    if (existingEntry) {
      return {
        status: "already-saved",
        entry: existingEntry,
      };
    }

    if (Object.keys(data.entries).length >= this.maxEntries) {
      return {
        status: "max-entries-reached",
        maxEntries: this.maxEntries,
      };
    }

    const timestamp = this.now();
    const entry: SavedVocabularyEntry = {
      id,
      text: normalizedText,
      normalizedText,
      sourceLanguage: input.sourceLanguage,
      detectedSourceLanguage: input.detectedSourceLanguage,
      targetLanguage: input.targetLanguage,
      translatedText: input.translatedText,
      providerName: input.providerName,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.writeData({
      entries: {
        ...data.entries,
        [id]: entry,
      },
    });

    return {
      status: "saved",
      entry,
    };
  }

  async delete(id: string): Promise<void> {
    const data = await this.readData();

    if (!(id in data.entries)) {
      return;
    }

    const { [id]: _deletedEntry, ...remainingEntries } = data.entries;
    await this.writeData({ entries: remainingEntries });
  }

  async clear(): Promise<void> {
    await this.writeData({ entries: {} });
  }

  private async readData(): Promise<SavedVocabularyData> {
    return parseSavedVocabularyData(await this.storage.get(this.storageKey));
  }

  private async writeData(data: SavedVocabularyData): Promise<void> {
    await this.storage.set(this.storageKey, data);
  }
}

export function getSavedVocabularyEntryId(input: {
  text: string;
  sourceLanguage: SavedVocabularySourceLanguage;
  detectedSourceLanguage?: MvpLanguageCode;
  targetLanguage: MvpLanguageCode;
}): string {
  const sourceLanguage = input.detectedSourceLanguage ?? input.sourceLanguage;
  return [
    sourceLanguage,
    normalizeSavedVocabularyText(input.text),
    input.targetLanguage,
  ].join("\u001f");
}

export function normalizeSavedVocabularyText(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function isSingleSavedVocabularyWord(text: string): boolean {
  return /^[\p{Letter}\p{Number}'-]+$/u.test(text);
}

function parseSavedVocabularyData(value: unknown): SavedVocabularyData {
  if (
    typeof value === "object" &&
    value !== null &&
    "entries" in value &&
    typeof value.entries === "object" &&
    value.entries !== null
  ) {
    return {
      entries: value.entries as Record<string, SavedVocabularyEntry>,
    };
  }

  return { entries: {} };
}
