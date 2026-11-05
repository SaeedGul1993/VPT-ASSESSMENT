import { Gender, Relationship, SyncResult } from "../../generated/prisma";
import { asNumber, asString, finishOp } from "./sync.helpers";
import { syncRepository } from "./sync.repository";
import type { OpResult, SyncWorker } from "./sync.types";
import type { SyncOpInput } from "./sync.validation";

export async function applyMember(
  worker: SyncWorker,
  op: SyncOpInput,
): Promise<OpResult> {
  const existing = await syncRepository.findMember(op.entityId);

  if (op.action === "CREATE") {
    if (existing) {
      if (existing.household.areaId !== worker.areaId) {
        return finishOp(worker.id, op, SyncResult.REJECTED, null, "Member belongs to another area");
      }
      return finishOp(worker.id, op, SyncResult.APPLIED, existing);
    }

    const householdId = asString(op.payload.householdId);
    if (!householdId) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "householdId is required");
    }

    const household = await syncRepository.findHousehold(householdId);
    if (!household || household.deletedAt || household.areaId !== worker.areaId) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "Household not found in your area");
    }

    const name = asString(op.payload.name)?.trim();
    const age = asNumber(op.payload.age);
    const gender = asString(op.payload.gender) as Gender | undefined;
    const relationship = asString(op.payload.relationship) as Relationship | undefined;

    if (!name || age == null || !gender || !relationship) {
      return finishOp(
        worker.id,
        op,
        SyncResult.REJECTED,
        null,
        "name, age, gender, relationship are required",
      );
    }
    if (!Object.values(Gender).includes(gender)) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "Invalid gender");
    }
    if (!Object.values(Relationship).includes(relationship)) {
      return finishOp(worker.id, op, SyncResult.REJECTED, null, "Invalid relationship");
    }

    const created = await syncRepository.prisma.householdMember.create({
      data: {
        id: op.entityId,
        householdId,
        name,
        age,
        gender,
        relationship,
      },
    });
    return finishOp(worker.id, op, SyncResult.APPLIED, created);
  }

  if (!existing || existing.household.areaId !== worker.areaId) {
    return finishOp(worker.id, op, SyncResult.REJECTED, null, "Member not found in your area");
  }

  if (op.action === "UPDATE") {
    if (existing.deletedAt) {
      return finishOp(worker.id, op, SyncResult.REJECTED, existing, "Member is deleted");
    }
    if (op.clientVersion == null || op.clientVersion !== existing.version) {
      return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
    }

    const gender = asString(op.payload.gender) as Gender | undefined;
    const relationship = asString(op.payload.relationship) as Relationship | undefined;

    const updated = await syncRepository.prisma.householdMember.update({
      where: { id: op.entityId },
      data: {
        ...(asString(op.payload.name) ? { name: asString(op.payload.name)!.trim() } : {}),
        ...(asNumber(op.payload.age) != null ? { age: asNumber(op.payload.age) } : {}),
        ...(gender && Object.values(Gender).includes(gender) ? { gender } : {}),
        ...(relationship && Object.values(Relationship).includes(relationship)
          ? { relationship }
          : {}),
        version: { increment: 1 },
      },
    });
    return finishOp(worker.id, op, SyncResult.APPLIED, updated);
  }

  if (existing.deletedAt) {
    return finishOp(worker.id, op, SyncResult.APPLIED, existing);
  }
  if (op.clientVersion != null && op.clientVersion !== existing.version) {
    return finishOp(worker.id, op, SyncResult.CONFLICT, existing, "Version conflict");
  }

  const deleted = await syncRepository.prisma.householdMember.update({
    where: { id: op.entityId },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
  return finishOp(worker.id, op, SyncResult.APPLIED, deleted);
}
