import { cache, CacheKeys, CacheTTL } from "../../utils/cache";
import { dashboardRepository } from "./dashboard.repository";

export type DashboardStats = Awaited<
  ReturnType<typeof dashboardRepository.getStats>
> & {
  cache: {
    hit: boolean;
    ttlSeconds: number;
  };
};

export class DashboardService {
  /**
   * Flow:
   * 1) Redis se stats lo
   * 2) Hit → turant return (cache.hit = true)
   * 3) Miss → DB se calculate, Redis mein TTL ke sath save, return
   */
  async getStats(): Promise<DashboardStats> {
    const cached = await cache.get<Awaited<ReturnType<typeof dashboardRepository.getStats>>>(
      CacheKeys.dashboardStats,
    );

    if (cached) {
      return {
        ...cached,
        cache: {
          hit: true,
          ttlSeconds: CacheTTL.dashboardStats,
        },
      };
    }

    const stats = await dashboardRepository.getStats();
    await cache.set(CacheKeys.dashboardStats, stats, CacheTTL.dashboardStats);

    return {
      ...stats,
      cache: {
        hit: false,
        ttlSeconds: CacheTTL.dashboardStats,
      },
    };
  }
}

export const dashboardService = new DashboardService();
