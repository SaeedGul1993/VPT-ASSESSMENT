import { SyncResult } from "../../generated/prisma";
import {
  invalidateDashboardCache,
  invalidateHouseholdListCache,
} from "../../utils/cache";
import { asNumber, asString, finishOp } from "./sync.helpers";
import { syncRepository } from "./sync.repository";
import type { OpResult, SyncWorker } from "./sync.types";
import type { SyncOpInput } from "./sync.validation";

async function bustHouseholdCaches() {
  await invalidateHouseholdListCache();
  await invalidateDashboardCache();
}

export async function applyHousehold(
  worker: SyncWorker,
  op: SyncOpInput,
): Promise<OpResult> {
  const existing = await syncRepository.findHousehold(op.entityId);

  if (op.action === "CREATE") {
    if (existing) {
      if (existing.areaId !== worker.areaId) {
        return finishOp(worker.id, op, SyncResult.REJECTED, null, "Household belongs to another area");
      }
      return finishOp(worker.id, op, SyncResult.APPLIED, existing);
    }

    const code = asString(op.payload.code)?.trim().toUpperCase();
    const address = asString(op.payload.address)?.trim();
    if (!code || !address) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "code and address are required");
    }

    const created = await syncRepository.prisma.household.create({
      data: {
        id: op.entityId,
        code,
        address,
        latitude: asNumber(op.payload.latitude) ?? null,
        longitude: asNumber(op.payload.longitude) ?? null,
        areaId: worker.areaId,
        createdById: worker.id,
      },
    });
    await bustHouseholdCaches();
    return finishOp(worker.id, op, SyncResult.APPLIED, created);
  }

  if (!existing || existing.areaId !== worker.areaId) {
    return finishOp(worker.id, op, SyncResult.REJECTED, null, "Household not found in your area");
  }

  if (op.action === "UPDATE") {
    if (existing.deletedAt) {
      return finishOp(worker.id, op, SyncResult.REJECTED, existing, "Household is deleted");
    }
    if (op.clientVersion == null || op.clientVersion !== existing.version) {
      return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
    }

    const updated = await syncRepository.prisma.household.update({
      where: { id: op.entityId },
      data: {
        ...(asString(op.payload.code)
          ? { code: asString(op.payload.code)!.trim().toUpperCase() }
          : {}),
        ...(asString(op.payload.address)
          ? { address: asString(op.payload.address)!.trim() }
          : {}),
        ...(op.payload.latitude !== undefined
          ? { latitude: asNumber(op.payload.latitude) ?? null }
          : {}),
        ...(op.payload.longitude !== undefined
          ? { longitude: asNumber(op.payload.longitude) ?? null }
          : {}),
        version: { increment: 1 },
      },
    });
    await bustHouseholdCaches();
    return finishOp(worker.id, op, SyncResult.APPLIED, updated);
  }

  // DELETE
  if (existing.deletedAt) {
    return finishOp(worker.id, op, SyncResult.APPLIED, existing);
  }
  if (op.clientVersion != null && op.clientVersion !== existing.version) {
    return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
  }

  const deleted = await syncRepository.prisma.household.update({
    where: { id: op.entityId },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
  await bustHouseholdCaches();
  return finishOp(worker.id, op, SyncResult.APPLIED, deleted);
}
