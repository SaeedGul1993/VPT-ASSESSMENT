import type { Gender, Prisma, Relationship } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const memberSelect = {
  id: true,
  householdId: true,
  name: true,
  age: true,
  gender: true,
  relationship: true,
  version: true,
  createdAt: true,
  updatedAt: true,
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
} satisfies Prisma.HouseholdMemberSelect;

export class MembersRepository {
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

  findHouseholdById(id: string) {
    return prisma.household.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        areaId: true,
        deletedAt: true,
      },
    });
  }

  findById(id: string) {
    return prisma.householdMember.findUnique({
      where: { id },
      select: memberSelect,
    });
  }

  listByHousehold(householdId: string, includeDeleted = false) {
    return prisma.householdMember.findMany({
      where: {
        householdId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      select: memberSelect,
      orderBy: { createdAt: "asc" },
    });
  }

  create(data: {
    id?: string;
    householdId: string;
    name: string;
    age: number;
    gender: Gender;
    relationship: Relationship;
  }) {
    return prisma.householdMember.create({
      data: {
        ...(data.id ? { id: data.id } : {}),
        householdId: data.householdId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        relationship: data.relationship,
      },
      select: memberSelect,
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      age?: number;
      gender?: Gender;
      relationship?: Relationship;
    },
  ) {
    return prisma.householdMember.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
      select: memberSelect,
    });
  }

  softDelete(id: string) {
    return prisma.householdMember.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
      select: memberSelect,
    });
  }
}

export const membersRepository = new MembersRepository();
