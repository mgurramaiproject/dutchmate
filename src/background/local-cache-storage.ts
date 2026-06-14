import type { PersistentTranslationCacheStorage } from "../translation/persistent-translation-cache";

export type LocalCacheExtensionApi = {
  storage: {
    local: {
      get(keys: string | string[], callback: (items: Record<string, unknown>) => void): void;
      set(items: Record<string, unknown>, callback?: () => void): void;
    };
  };
  runtime: {
    lastError?: { message?: string };
  };
};

export class LocalCacheStorage implements PersistentTranslationCacheStorage {
  constructor(private readonly extensionApi: LocalCacheExtensionApi | undefined) {}

  async get(key: string): Promise<unknown> {
    if (!this.extensionApi) {
      return undefined;
    }

    return new Promise((resolve) => {
      this.extensionApi?.storage.local.get(key, (items) => {
        if (this.extensionApi?.runtime.lastError) {
          resolve(undefined);
          return;
        }

        resolve(items[key]);
      });
    });
  }

  async set(key: string, value: unknown): Promise<void> {
    if (!this.extensionApi) {
      return;
    }

    return new Promise((resolve) => {
      this.extensionApi?.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }
}
