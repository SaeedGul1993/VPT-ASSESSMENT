import { Role } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

export class DashboardRepository {
  async getStats() {
    const [
      totalHouseholds,
      totalFieldWorkers,
      activeFieldWorkers,
      totalMembers,
      totalAssessments,
      urgentAssessments,
      unreadActivities,
    ] = await Promise.all([
      prisma.household.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: Role.FIELD_WORKER } }),
      prisma.user.count({ where: { role: Role.FIELD_WORKER, isActive: true } }),
      prisma.householdMember.count({ where: { deletedAt: null } }),
      prisma.healthAssessment.count({ where: { deletedAt: null } }),
      prisma.healthAssessment.count({ where: { deletedAt: null, isUrgent: true } }),
      prisma.activityLog.count({ where: { readAt: null } }),
    ]);

    return {
      totalHouseholds,
      totalFieldWorkers,
      activeFieldWorkers,
      totalMembers,
      totalAssessments,
      urgentAssessments,
      unreadActivities,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const dashboardRepository = new DashboardRepository();
