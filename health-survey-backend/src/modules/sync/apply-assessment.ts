import { SyncResult } from "../../generated/prisma";
import { upsertUrgentActivity } from "../activities/urgentActivity";
import { enqueueUrgentAssessmentSafe } from "../../queues/notification.queue";
import { asBoolean, asNumber, asString, computeIsUrgent, finishOp } from "./sync.helpers";
import { syncRepository } from "./sync.repository";
import type { OpResult, SyncWorker } from "./sync.types";
import type { SyncOpInput } from "./sync.validation";

async function maybeEnqueueUrgent(assessment: {
  id: string;
  memberId: string;
  temperature: number | null;
  hasBreathingDifficulty: boolean;
  flaggedForReview: boolean;
  isUrgent: boolean;
}) {
  if (!assessment.isUrgent) return;

  await upsertUrgentActivity({
    assessmentId: assessment.id,
    temperature: assessment.temperature,
    hasBreathingDifficulty: assessment.hasBreathingDifficulty,
    flaggedForReview: assessment.flaggedForReview,
  });

  await enqueueUrgentAssessmentSafe({
    assessmentId: assessment.id,
    memberId: assessment.memberId,
    temperature: assessment.temperature,
    hasBreathingDifficulty: assessment.hasBreathingDifficulty,
    flaggedForReview: assessment.flaggedForReview,
  });
}

export async function applyAssessment(
  worker: SyncWorker,
  op: SyncOpInput,
): Promise<OpResult> {
  const existing = await syncRepository.findAssessment(op.entityId);

  if (op.action === "CREATE") {
    if (existing) {
      if (existing.member.household.areaId !== worker.areaId) {
        return finishOp(
          worker.id,
          op,
          SyncResult.REJECTED,
          null,
          "Assessment belongs to another area",
        );
      }
      return finishOp(worker.id, op, SyncResult.APPLIED, existing);
    }

    const memberId = asString(op.payload.memberId);
    if (!memberId) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "memberId is required");
    }

    const member = await syncRepository.findMember(memberId);
    if (
      !member ||
      member.deletedAt ||
      member.household.deletedAt ||
      member.household.areaId !== worker.areaId
    ) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "Member not found in your area");
    }

    const temperature = asNumber(op.payload.temperature) ?? null;
    const hasBreathingDifficulty = asBoolean(op.payload.hasBreathingDifficulty) ?? false;
    const flaggedForReview = asBoolean(op.payload.flaggedForReview) ?? false;

    const created = await syncRepository.prisma.healthAssessment.create({
      data: {
        id: op.entityId,
        memberId,
        recordedBy: worker.id,
        temperature,
        hasFever: asBoolean(op.payload.hasFever) ?? false,
        hasCough: asBoolean(op.payload.hasCough) ?? false,
        hasBreathingDifficulty,
        systolicBp: asNumber(op.payload.systolicBp) ?? null,
        diastolicBp: asNumber(op.payload.diastolicBp) ?? null,
        notes: asString(op.payload.notes) ?? null,
        flaggedForReview,
        isUrgent: computeIsUrgent({
          temperature,
          hasBreathingDifficulty,
          flaggedForReview,
        }),
      },
    });
    await maybeEnqueueUrgent(created);
    return finishOp(worker.id, op, SyncResult.APPLIED, created);
  }

  if (!existing || existing.member.household.areaId !== worker.areaId) {
    return finishOp(worker.id, op, SyncResult.REJECTED, null, "Assessment not found in your area");
  }

  if (op.action === "UPDATE") {
    if (existing.deletedAt) {
      return finishOp(worker.id, op, SyncResult.REJECTED, existing, "Assessment is deleted");
    }
    if (op.clientVersion == null || op.clientVersion !== existing.version) {
      return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
    }

    const temperature =
      op.payload.temperature !== undefined
        ? (asNumber(op.payload.temperature) ?? null)
        : existing.temperature;
    const hasBreathingDifficulty =
      op.payload.hasBreathingDifficulty !== undefined
        ? (asBoolean(op.payload.hasBreathingDifficulty) ?? false)
        : existing.hasBreathingDifficulty;
    const flaggedForReview =
      op.payload.flaggedForReview !== undefined
        ? (asBoolean(op.payload.flaggedForReview) ?? false)
        : existing.flaggedForReview;

    const updated = await syncRepository.prisma.healthAssessment.update({
      where: { id: op.entityId },
      data: {
        ...(op.payload.temperature !== undefined ? { temperature } : {}),
        ...(op.payload.hasFever !== undefined
          ? { hasFever: asBoolean(op.payload.hasFever) ?? false }
          : {}),
        ...(op.payload.hasCough !== undefined
          ? { hasCough: asBoolean(op.payload.hasCough) ?? false }
          : {}),
        ...(op.payload.hasBreathingDifficulty !== undefined
          ? { hasBreathingDifficulty }
          : {}),
        ...(op.payload.systolicBp !== undefined
          ? { systolicBp: asNumber(op.payload.systolicBp) ?? null }
          : {}),
        ...(op.payload.diastolicBp !== undefined
          ? { diastolicBp: asNumber(op.payload.diastolicBp) ?? null }
          : {}),
        ...(op.payload.notes !== undefined
          ? { notes: asString(op.payload.notes) ?? null }
          : {}),
        ...(op.payload.flaggedForReview !== undefined ? { flaggedForReview } : {}),
        isUrgent: computeIsUrgent({
          temperature,
          hasBreathingDifficulty,
          flaggedForReview,
        }),
        version: { increment: 1 },
      },
    });
    await maybeEnqueueUrgent(updated);
    return finishOp(worker.id, op, SyncResult.APPLIED, updated);
  }

  if (existing.deletedAt) {
    return finishOp(worker.id, op, SyncResult.APPLIED, existing);
  }
  if (op.clientVersion != null && op.clientVersion !== existing.version) {
    return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
  }

  const deleted = await syncRepository.prisma.healthAssessment.update({
    where: { id: op.entityId },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
  return finishOp(worker.id, op, SyncResult.APPLIED, deleted);
}
