import { createRedisConnection } from "../config/redis";

/**
 * Redis cache helper
 * -----------------
 * - TTL: cache automatically expires after N seconds
 * - Invalidation: on write we delete keys so next read is fresh
 * - If Redis is down, we fall back to DB (API still works)
 */

const redis = createRedisConnection();

export const CacheKeys = {
  dashboardStats: "cache:dashboard:stats",
  householdsListPrefix: "cache:households:list:",
} as const;

export const CacheTTL = {
  dashboardStats: 60, // 60 seconds
  householdsList: 30, // 30 seconds
} as const;

function householdsListKey(parts: {
  role: string;
  areaId?: string | null;
  search?: string;
  includeDeleted?: boolean;
}) {
  return (
    CacheKeys.householdsListPrefix +
    [
      parts.role,
      parts.areaId ?? "all",
      parts.search ?? "",
      parts.includeDeleted ? "1" : "0",
    ].join(":")
  );
}

export const cache = {
  householdsListKey,

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error("[cache] get failed", key, error);
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
      console.error("[cache] set failed", key, error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("[cache] del failed", key, error);
    }
  },

  async delByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error("[cache] delByPrefix failed", prefix, error);
    }
  },
};

/** Call after household / worker / assessment writes */
export async function invalidateDashboardCache() {
  await cache.del(CacheKeys.dashboardStats);
}

/** Call after household create/update/delete (and sync household ops) */
export async function invalidateHouseholdListCache() {
  await cache.delByPrefix(CacheKeys.householdsListPrefix);
}
