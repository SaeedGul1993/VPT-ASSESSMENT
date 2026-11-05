import { prisma } from "../../utils/prisma";

export class ActivitiesRepository {
  list(unreadOnly = false) {
    return prisma.activityLog.findMany({
      where: unreadOnly ? { readAt: null } : undefined,
      include: {
        assessment: {
          select: {
            id: true,
            temperature: true,
            hasBreathingDifficulty: true,
            flaggedForReview: true,
            isUrgent: true,
            member: {
              select: {
                id: true,
                name: true,
                household: {
                  select: {
                    id: true,
                    code: true,
                    area: {
                      select: { id: true, name: true, code: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return prisma.activityLog.findUnique({ where: { id } });
  }

  markRead(id: string) {
    return prisma.activityLog.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }
}

export const activitiesRepository = new ActivitiesRepository();
