import { LRUCache } from 'lru-cache';

// In-Memory cache for volatile Web3 data (balances, gas estimates, quotes)
export const rpcCache = new LRUCache<string, any>({
  max: 500, // max items in cache
  ttl: 15 * 1000, // 15 seconds TTL
  allowStale: false,
  updateAgeOnGet: false,
});

// Cache for reference token prices (60 seconds TTL)
export const priceCache = new LRUCache<string, any>({
  max: 200,
  ttl: 60 * 1000, // 60 seconds TTL
});

/**
 * Cache helper: retrieves cached item or executes fallback fetcher function
 */
export async function getOrSetCache<T>(
  cache: LRUCache<string, any>,
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key) as T | undefined;
  if (cached !== undefined) {
    return cached;
  }

  const fresh = await fetcher();
  cache.set(key, fresh);
  return fresh;
}
