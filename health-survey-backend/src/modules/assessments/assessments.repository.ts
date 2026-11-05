import type { Prisma } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const assessmentSelect = {
  id: true,
  memberId: true,
  recordedBy: true,
  temperature: true,
  hasFever: true,
  hasCough: true,
  hasBreathingDifficulty: true,
  systolicBp: true,
  diastolicBp: true,
  notes: true,
  flaggedForReview: true,
  isUrgent: true,
  assessedAt: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  member: {
    select: {
      id: true,
      name: true,
      age: true,
      gender: true,
      deletedAt: true,
      household: {
        select: {
          id: true,
          code: true,
          areaId: true,
          deletedAt: true,
          area: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.HealthAssessmentSelect;

export class AssessmentsRepository {
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

  findMemberById(id: string) {
    return prisma.householdMember.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        deletedAt: true,
        household: {
          select: {
            id: true,
            areaId: true,
            deletedAt: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return prisma.healthAssessment.findUnique({
      where: { id },
      select: assessmentSelect,
    });
  }

  listByMember(memberId: string, includeDeleted = false) {
    return prisma.healthAssessment.findMany({
      where: {
        memberId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      select: assessmentSelect,
      orderBy: { assessedAt: "desc" },
    });
  }

  create(data: Prisma.HealthAssessmentUncheckedCreateInput) {
    return prisma.healthAssessment.create({
      data,
      select: assessmentSelect,
    });
  }

  update(id: string, data: Prisma.HealthAssessmentUncheckedUpdateInput) {
    return prisma.healthAssessment.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      select: assessmentSelect,
    });
  }

  softDelete(id: string) {
    return prisma.healthAssessment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
      select: assessmentSelect,
    });
  }
}

export const assessmentsRepository = new AssessmentsRepository();
