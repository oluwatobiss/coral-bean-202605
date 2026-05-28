class CoralCache {
    cache = new Map();
    defaultTTL = 30 * 1000; // 30 seconds
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        const isExpired = Date.now() - entry.timestamp > this.defaultTTL;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    set(key, data, ttl) {
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
    clear() {
        this.cache.clear();
    }
}
export const coralCache = new CoralCache();
//# sourceMappingURL=cache.js.map