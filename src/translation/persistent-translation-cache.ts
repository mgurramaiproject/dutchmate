import type { TranslationRequest, TranslationResult } from "./provider";
import {
  normalizeCacheText,
  shouldPersistTranslation,
} from "./persistent-cache-policy";

const DEFAULT_CACHE_KEY = "dutchmate.translationCache.v1";
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 1000;

export type PersistentTranslationCacheStorage = {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
};

type PersistentTranslationCacheOptions = {
  cacheKey?: string;
  maxEntries?: number;
  ttlMs?: number;
  now?: () => number;
  shouldPersist?: (request: TranslationRequest) => boolean;
};

type PersistentTranslationCacheEntry = {
  request: TranslationRequest;
  result: TranslationResult;
  createdAt: number;
};

type PersistentTranslationCacheData = {
  entries: Record<string, PersistentTranslationCacheEntry>;
};

export class PersistentTranslationCache {
  private readonly cacheKey: string;
  private readonly maxEntries: number;
  private readonly ttlMs: number;
  private readonly now: () => number;
  private readonly shouldPersist: (request: TranslationRequest) => boolean;

  constructor(
    private readonly storage: PersistentTranslationCacheStorage,
    options: PersistentTranslationCacheOptions = {},
  ) {
    this.cacheKey = options.cacheKey ?? DEFAULT_CACHE_KEY;
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    this.now = options.now ?? Date.now;
    this.shouldPersist = options.shouldPersist ?? shouldPersistTranslation;
  }

  async get(request: TranslationRequest): Promise<TranslationResult | null> {
    if (!this.shouldPersist(request)) {
      return null;
    }

    const data = await this.readData();
    const freshData = this.removeExpiredEntries(data);
    const entry = freshData.entries[getPersistentCacheEntryKey(request)] ?? null;

    if (freshData !== data) {
      await this.writeData(freshData);
    }

    return entry?.result ?? null;
  }

  async set(request: TranslationRequest, result: TranslationResult): Promise<void> {
    if (!this.shouldPersist(request)) {
      return;
    }

    const data = this.removeExpiredEntries(await this.readData());
    data.entries[getPersistentCacheEntryKey(request)] = {
      request: {
        ...request,
        text: normalizeCacheText(request.text),
      },
      result,
      createdAt: this.now(),
    };

    await this.writeData(this.enforceMaxEntries(data));
  }

  private async readData(): Promise<PersistentTranslationCacheData> {
    return parsePersistentCacheData(await this.storage.get(this.cacheKey));
  }

  private async writeData(data: PersistentTranslationCacheData): Promise<void> {
    await this.storage.set(this.cacheKey, data);
  }

  private removeExpiredEntries(
    data: PersistentTranslationCacheData,
  ): PersistentTranslationCacheData {
    const oldestAllowed = this.now() - this.ttlMs;
    const entries = Object.fromEntries(
      Object.entries(data.entries).filter(([, entry]) => entry.createdAt >= oldestAllowed),
    );

    return Object.keys(entries).length === Object.keys(data.entries).length
      ? data
      : { entries };
  }

  private enforceMaxEntries(data: PersistentTranslationCacheData): PersistentTranslationCacheData {
    const entries = Object.entries(data.entries);

    if (entries.length <= this.maxEntries) {
      return data;
    }

    return {
      entries: Object.fromEntries(
        entries
          .sort(([, first], [, second]) => first.createdAt - second.createdAt)
          .slice(entries.length - this.maxEntries),
      ),
    };
  }
}

export function getPersistentCacheEntryKey(request: TranslationRequest): string {
  return [
    normalizeCacheText(request.text),
    request.sourceLanguage,
    request.targetLanguage,
    request.context,
  ].join("\u001f");
}

function parsePersistentCacheData(value: unknown): PersistentTranslationCacheData {
  if (
    typeof value === "object" &&
    value !== null &&
    "entries" in value &&
    typeof value.entries === "object" &&
    value.entries !== null
  ) {
    return {
      entries: value.entries as Record<string, PersistentTranslationCacheEntry>,
    };
  }

  return { entries: {} };
}
