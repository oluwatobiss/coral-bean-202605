interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CoralCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 30 * 1000; // 30 seconds

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.defaultTTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const coralCache = new CoralCache();
