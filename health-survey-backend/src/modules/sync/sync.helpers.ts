import type { Prisma, SyncAction, SyncEntity, SyncResult } from "../../generated/prisma";
import { syncRepository } from "./sync.repository";
import type { OpResult } from "./sync.types";
import type { SyncOpInput } from "./sync.validation";

export function computeIsUrgent(input: {
  temperature?: number | null;
  hasBreathingDifficulty?: boolean;
  flaggedForReview?: boolean;
}) {
  const highTemp = input.temperature != null && input.temperature >= 39;
  return Boolean(highTemp || input.hasBreathingDifficulty || input.flaggedForReview);
}

export function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export function asNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function actionRank(action: SyncAction) {
  if (action === "CREATE") return 0;
  if (action === "UPDATE") return 1;
  return 2;
}

function entityRank(entityType: SyncEntity, action: SyncAction) {
  if (action === "DELETE") {
    if (entityType === "ASSESSMENT") return 0;
    if (entityType === "MEMBER") return 1;
    return 2;
  }
  if (entityType === "HOUSEHOLD") return 0;
  if (entityType === "MEMBER") return 1;
  return 2;
}

/** CREATE first, then UPDATE, then DELETE. Parents before children. */
export function sortOps(ops: SyncOpInput[]) {
  return [...ops].sort((a, b) => {
    const byAction = actionRank(a.action) - actionRank(b.action);
    if (byAction !== 0) return byAction;
    return entityRank(a.entityType, a.action) - entityRank(b.entityType, b.action);
  });
}

/** Save SyncOperation (idempotency) + return result to mobile */
export async function finishOp(
  workerId: string,
  op: SyncOpInput,
  result: SyncResult,
  entity: unknown,
  message?: string,
): Promise<OpResult> {
  const response = { result, entity, message };
  await syncRepository.createSyncOp({
    opId: op.opId,
    userId: workerId,
    entityType: op.entityType,
    entityId: op.entityId,
    action: op.action,
    result,
    response: response as Prisma.InputJsonValue,
  });

  return {
    opId: op.opId,
    entityType: op.entityType,
    entityId: op.entityId,
    action: op.action,
    result,
    entity,
    message,
  };
}
