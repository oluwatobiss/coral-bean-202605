declare class CoralCache {
    private cache;
    private defaultTTL;
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttl?: number): void;
    clear(): void;
}
export declare const coralCache: CoralCache;
export {};
//# sourceMappingURL=cache.d.ts.map