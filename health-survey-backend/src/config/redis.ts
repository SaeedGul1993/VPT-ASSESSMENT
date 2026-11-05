import IORedis from "ioredis";
import { env } from "./env";

/** Shared Redis connection for BullMQ (maxRetriesPerRequest must be null for workers) */
export function createRedisConnection() {
  return new IORedis(env.redisUrl, {
    maxRetriesPerRequest: null,
  });
}
