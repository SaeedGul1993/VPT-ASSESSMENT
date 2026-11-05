import { Role, type Prisma, type User } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  areaId: true,
  createdAt: true,
  updatedAt: true,
  area: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} satisfies Prisma.UserSelect;

export class FieldWorkersRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findAreaById(areaId: string) {
    return prisma.area.findUnique({ where: { id: areaId } });
  }

  findFieldWorkerById(id: string) {
    return prisma.user.findFirst({
      where: { id, role: Role.FIELD_WORKER },
      select: publicUserSelect,
    });
  }

  listFieldWorkers() {
    return prisma.user.findMany({
      where: { role: Role.FIELD_WORKER },
      select: publicUserSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  createFieldWorker(data: {
    name: string;
    email: string;
    password: string;
    areaId?: string | null;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: Role.FIELD_WORKER,
        isActive: true,
        areaId: data.areaId ?? null,
      },
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: publicUserSelect,
    });
  }

  assignArea(id: string, areaId: string | null) {
    return prisma.user.update({
      where: { id },
      data: { areaId },
      select: publicUserSelect,
    });
  }
}

export const fieldWorkersRepository = new FieldWorkersRepository();
