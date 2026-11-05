import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis";

export const NOTIFICATION_QUEUE = "urgent-notifications";

export type UrgentAssessmentJob = {
  assessmentId: string;
  memberId: string;
  temperature: number | null;
  hasBreathingDifficulty: boolean;
  flaggedForReview: boolean;
};

const connection = createRedisConnection();

export const notificationQueue = new Queue<UrgentAssessmentJob>(
  NOTIFICATION_QUEUE,
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 200,
    },
  },
);

/**
 * Enqueue urgent assessment notification.
 * jobId = assessmentId → same assessment dobara queue mein duplicate nahi hota.
 */
export async function enqueueUrgentAssessment(job: UrgentAssessmentJob) {
  // BullMQ custom jobId cannot contain ':'
  await notificationQueue.add("urgent-assessment", job, {
    jobId: `urgent-assessment-${job.assessmentId}`,
  });
}
export async function enqueueUrgentAssessmentSafe(job: UrgentAssessmentJob) {
  try {
    await enqueueUrgentAssessment(job);
  } catch (error) {
    console.error("[notification-queue] failed to enqueue", {
      assessmentId: job.assessmentId,
      error: error instanceof Error ? error.message : error,
    });
  }
}
