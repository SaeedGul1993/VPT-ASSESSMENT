import { MemberLabels } from "../../labels/member.labels";
import type { AuthUser } from "../../middleware/authenticate";
import { AppError } from "../../utils/AppError";
import { invalidateDashboardCache } from "../../utils/cache";
import { membersRepository } from "./members.repository";
import type { CreateMemberInput, UpdateMemberInput } from "./members.validation";

export class MembersService {
  private async getActor(user: AuthUser) {
    const actor = await membersRepository.findUserById(user.id);
    if (!actor || !actor.isActive) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }
    return actor;
  }

  private assertAreaAccess(
    actor: { role: string; areaId: string | null },
    householdAreaId: string,
  ) {
    if (actor.role === "SUPER_ADMIN") return;
    if (!actor.areaId || actor.areaId !== householdAreaId) {
      throw new AppError(MemberLabels.FORBIDDEN_AREA, 403, "FORBIDDEN_AREA");
    }
  }

  async create(user: AuthUser, householdId: string, input: CreateMemberInput) {
    const actor = await this.getActor(user);
    const household = await membersRepository.findHouseholdById(householdId);

    if (!household || household.deletedAt) {
      throw new AppError(MemberLabels.HOUSEHOLD_NOT_FOUND, 404, "HOUSEHOLD_NOT_FOUND");
    }

    this.assertAreaAccess(actor, household.areaId);

    if (input.id) {
      const existing = await membersRepository.findById(input.id);
      if (existing) {
        throw new AppError("Member already exists", 409, "ALREADY_EXISTS");
      }
    }

    const member = await membersRepository.create({
      id: input.id,
      householdId,
      name: input.name.trim(),
      age: input.age,
      gender: input.gender,
      relationship: input.relationship,
    });
    await invalidateDashboardCache();
    return member;
  }

  async listByHousehold(user: AuthUser, householdId: string) {
    const actor = await this.getActor(user);
    const household = await membersRepository.findHouseholdById(householdId);

    if (!household || household.deletedAt) {
      throw new AppError(MemberLabels.HOUSEHOLD_NOT_FOUND, 404, "HOUSEHOLD_NOT_FOUND");
    }

    this.assertAreaAccess(actor, household.areaId);
    return membersRepository.listByHousehold(householdId);
  }

  async getById(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const member = await membersRepository.findById(id);

    if (!member || member.deletedAt || member.household.deletedAt) {
      throw new AppError(MemberLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, member.household.areaId);
    return member;
  }

  async update(user: AuthUser, id: string, input: UpdateMemberInput) {
    const actor = await this.getActor(user);
    const member = await membersRepository.findById(id);

    if (!member || member.deletedAt || member.household.deletedAt) {
      throw new AppError(MemberLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, member.household.areaId);

    return membersRepository.update(id, {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.age !== undefined ? { age: input.age } : {}),
      ...(input.gender ? { gender: input.gender } : {}),
      ...(input.relationship ? { relationship: input.relationship } : {}),
    });
  }

  async softDelete(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const member = await membersRepository.findById(id);

    if (!member || member.household.deletedAt) {
      throw new AppError(MemberLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    if (member.deletedAt) {
      throw new AppError(MemberLabels.ALREADY_DELETED, 400, "ALREADY_DELETED");
    }

    this.assertAreaAccess(actor, member.household.areaId);
    const deleted = await membersRepository.softDelete(id);
    await invalidateDashboardCache();
    return deleted;
  }
}

export const membersService = new MembersService();
