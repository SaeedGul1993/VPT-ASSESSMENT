import "dotenv/config";
import { Worker } from "bullmq";
import { createRedisConnection } from "../config/redis";
import { upsertUrgentActivity } from "../modules/activities/urgentActivity";
import {
  NOTIFICATION_QUEUE,
  type UrgentAssessmentJob,
} from "../queues/notification.queue";
import { prisma } from "../utils/prisma";

const worker = new Worker<UrgentAssessmentJob>(
  NOTIFICATION_QUEUE,
  async (job) => {
    const data = job.data;

    await upsertUrgentActivity({
      assessmentId: data.assessmentId,
      temperature: data.temperature,
      hasBreathingDifficulty: data.hasBreathingDifficulty,
      flaggedForReview: data.flaggedForReview,
    });

    console.log("[notification-worker] activity logged", {
      assessmentId: data.assessmentId,
      jobId: job.id,
    });
  },
  {
    connection: createRedisConnection(),
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`[notification-worker] completed job ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`[notification-worker] failed job ${job?.id}`, error.message);
});

worker.on("error", (error) => {
  console.error("[notification-worker] error", error.message);
});

console.log(`[notification-worker] listening on queue "${NOTIFICATION_QUEUE}"`);

async function shutdown() {
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
