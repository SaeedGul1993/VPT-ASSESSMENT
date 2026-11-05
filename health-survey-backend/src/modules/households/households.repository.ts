import type { Prisma } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const householdSelect = {
  id: true,
  code: true,
  address: true,
  latitude: true,
  longitude: true,
  areaId: true,
  createdById: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  area: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.HouseholdSelect;

export class HouseholdsRepository {
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

  findAreaById(areaId: string) {
    return prisma.area.findUnique({ where: { id: areaId } });
  }

  findByCode(code: string) {
    return prisma.household.findUnique({ where: { code } });
  }

  findById(id: string) {
    return prisma.household.findUnique({
      where: { id },
      select: householdSelect,
    });
  }

  list(filters: {
    areaId?: string;
    search?: string;
    includeDeleted?: boolean;
  }) {
    const where: Prisma.HouseholdWhereInput = {};

    if (!filters.includeDeleted) {
      where.deletedAt = null;
    }

    if (filters.areaId) {
      where.areaId = filters.areaId;
    }

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.household.findMany({
      where,
      select: householdSelect,
      orderBy: { updatedAt: "desc" },
    });
  }

  create(data: {
    id?: string;
    code: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    areaId: string;
    createdById: string;
  }) {
    return prisma.household.create({
      data: {
        ...(data.id ? { id: data.id } : {}),
        code: data.code,
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        areaId: data.areaId,
        createdById: data.createdById,
      },
      select: householdSelect,
    });
  }

  update(
    id: string,
    data: {
      code?: string;
      address?: string;
      latitude?: number | null;
      longitude?: number | null;
    },
  ) {
    return prisma.household.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      select: householdSelect,
    });
  }

  softDelete(id: string) {
    return prisma.household.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
      select: householdSelect,
    });
  }
}

export const householdsRepository = new HouseholdsRepository();
