import type { TranslationRequest, TranslationResult } from "./provider";

export class TranslationCache {
  private readonly cache = new Map<string, TranslationResult>();

  constructor(private readonly maxEntries: number) {}

  get(request: TranslationRequest): TranslationResult | null {
    return this.cache.get(this.getCacheKey(request)) ?? null;
  }

  set(request: TranslationRequest, result: TranslationResult): void {
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(this.getCacheKey(request), result);
  }

  private getCacheKey(request: TranslationRequest): string {
    return `${request.targetLanguage}:${request.context}:${request.text}`;
  }
}

