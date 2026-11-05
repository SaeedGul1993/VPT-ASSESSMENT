import { ActivityType } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

export type UrgentActivityInput = {
  assessmentId: string;
  temperature: number | null;
  hasBreathingDifficulty: boolean;
  flaggedForReview: boolean;
};

export function buildUrgentActivityMessage(input: UrgentActivityInput) {
  const reasons: string[] = [];
  if (input.temperature != null && input.temperature >= 39) {
    reasons.push(`high temperature (${input.temperature}°C)`);
  }
  if (input.hasBreathingDifficulty) {
    reasons.push("breathing difficulty");
  }
  if (input.flaggedForReview) {
    reasons.push("manually flagged for review");
  }
  const reasonText = reasons.length > 0 ? reasons.join(", ") : "urgent criteria";
  return `Urgent health assessment requires review: ${reasonText}`;
}

/** Sync write — activity Redis/worker ke baghair bhi create hojaye */
export async function upsertUrgentActivity(input: UrgentActivityInput) {
  const message = buildUrgentActivityMessage(input);

  return prisma.activityLog.upsert({
    where: {
      type_assessmentId: {
        type: ActivityType.URGENT_ASSESSMENT,
        assessmentId: input.assessmentId,
      },
    },
    create: {
      type: ActivityType.URGENT_ASSESSMENT,
      assessmentId: input.assessmentId,
      message,
    },
    update: {
      message,
    },
  });
}
