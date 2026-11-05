import type { Area, Prisma } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const areaSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      workers: true,
      households: true,
    },
  },
} satisfies Prisma.AreaSelect;

export class AreasRepository {
  findById(id: string) {
    return prisma.area.findUnique({
      where: { id },
      select: areaSelect,
    });
  }

  findByName(name: string) {
    return prisma.area.findUnique({ where: { name } });
  }

  findByCode(code: string) {
    return prisma.area.findUnique({ where: { code } });
  }

  list() {
    return prisma.area.findMany({
      select: areaSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  create(data: Prisma.AreaCreateInput): Promise<Area> {
    return prisma.area.create({ data });
  }

  update(id: string, data: Prisma.AreaUpdateInput) {
    return prisma.area.update({
      where: { id },
      data,
      select: areaSelect,
    });
  }
}

export const areasRepository = new AreasRepository();
