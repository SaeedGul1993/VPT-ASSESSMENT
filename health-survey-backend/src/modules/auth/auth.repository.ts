import type { Prisma, User } from "../../generated/prisma";
import { prisma } from "../../utils/prisma";

const authUserSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  areaId: true,
  refreshToken: true,
  area: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
} satisfies Prisma.UserSelect;

export type AuthUserRecord = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;

export class AuthRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: authUserSelect,
    });
  }

  updateRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }
}

export const authRepository = new AuthRepository();
