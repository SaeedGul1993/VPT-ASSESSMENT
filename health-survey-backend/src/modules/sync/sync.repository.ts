import type {
  Prisma,
  SyncAction,
  SyncEntity,
  SyncResult,
} from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

export class SyncRepository {
  findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        isActive: true,
        areaId: true,
      },
    });
  }

  findSyncOp(userId: string, opId: string) {
    return prisma.syncOperation.findUnique({
      where: {
        userId_opId: { userId, opId },
      },
    });
  }

  createSyncOp(data: {
    opId: string;
    userId: string;
    entityType: SyncEntity;
    entityId: string;
    action: SyncAction;
    result: SyncResult;
    response: Prisma.InputJsonValue;
  }) {
    return prisma.syncOperation.create({ data });
  }

  findHousehold(id: string) {
    return prisma.household.findUnique({ where: { id } });
  }

  findMember(id: string) {
    return prisma.householdMember.findUnique({
      where: { id },
      include: {
        household: {
          select: { id: true, areaId: true, deletedAt: true },
        },
      },
    });
  }

  findAssessment(id: string) {
    return prisma.healthAssessment.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            deletedAt: true,
            household: {
              select: { id: true, areaId: true, deletedAt: true },
            },
          },
        },
      },
    });
  }

  findAreaHouseholdIds(areaId: string) {
    return prisma.household.findMany({
      where: { areaId },
      select: { id: true },
    });
  }

  pullHouseholds(areaId: string, since?: Date) {
    return prisma.household.findMany({
      where: {
        areaId,
        ...(since ? { updatedAt: { gt: since } } : {}),
      },
      orderBy: { updatedAt: "asc" },
    });
  }

  pullMembers(householdIds: string[], since?: Date) {
    if (householdIds.length === 0) return Promise.resolve([]);
    return prisma.householdMember.findMany({
      where: {
        householdId: { in: householdIds },
        ...(since ? { updatedAt: { gt: since } } : {}),
      },
      orderBy: { updatedAt: "asc" },
    });
  }

  pullAssessments(memberIds: string[], since?: Date) {
    if (memberIds.length === 0) return Promise.resolve([]);
    return prisma.healthAssessment.findMany({
      where: {
        memberId: { in: memberIds },
        ...(since ? { updatedAt: { gt: since } } : {}),
      },
      orderBy: { updatedAt: "asc" },
    });
  }

  get prisma() {
    return prisma;
  }
}

export const syncRepository = new SyncRepository();
