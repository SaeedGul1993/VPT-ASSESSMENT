import { HouseholdLabels } from "../../labels/household.labels";
import type { AuthUser } from "../../middleware/authenticate";
import { AppError } from "../../utils/AppError";
import {
  cache,
  CacheTTL,
  invalidateDashboardCache,
  invalidateHouseholdListCache,
} from "../../utils/cache";
import { householdsRepository } from "./households.repository";
import type {
  CreateHouseholdInput,
  ListHouseholdsQuery,
  UpdateHouseholdInput,
} from "./households.validation";

export class HouseholdsService {
  private async getActor(user: AuthUser) {
    const actor = await householdsRepository.findUserById(user.id);
    if (!actor || !actor.isActive) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }
    return actor;
  }

  private assertAreaAccess(actor: { role: string; areaId: string | null }, areaId: string) {
    if (actor.role === "SUPER_ADMIN") return;
    if (!actor.areaId || actor.areaId !== areaId) {
      throw new AppError(HouseholdLabels.FORBIDDEN_AREA, 403, "FORBIDDEN_AREA");
    }
  }

  async create(user: AuthUser, input: CreateHouseholdInput) {
    const actor = await this.getActor(user);

    let ownerId = actor.id;
    let assignedAreaId: string | null = null;

    if (actor.role === "FIELD_WORKER") {
      if (!actor.areaId) {
        throw new AppError(HouseholdLabels.AREA_REQUIRED, 400, "AREA_REQUIRED");
      }
      assignedAreaId = actor.areaId;
      ownerId = actor.id;

      // If areaId is sent, it must be the worker's assigned area
      if (input.areaId && input.areaId !== assignedAreaId) {
        throw new AppError(HouseholdLabels.AREA_NOT_ASSIGNED, 403, "AREA_NOT_ASSIGNED");
      }
    } else {
      // SUPER_ADMIN must create on behalf of a field worker
      if (!input.fieldWorkerId) {
        throw new AppError(
          HouseholdLabels.FIELD_WORKER_REQUIRED,
          400,
          "FIELD_WORKER_REQUIRED",
        );
      }

      const worker = await householdsRepository.findUserById(input.fieldWorkerId);
      if (!worker || worker.role !== "FIELD_WORKER" || !worker.isActive) {
        throw new AppError(
          HouseholdLabels.FIELD_WORKER_NOT_FOUND,
          404,
          "FIELD_WORKER_NOT_FOUND",
        );
      }
      if (!worker.areaId) {
        throw new AppError(HouseholdLabels.AREA_REQUIRED, 400, "AREA_REQUIRED");
      }

      assignedAreaId = worker.areaId;
      ownerId = worker.id;

      // If areaId is sent, it must match that field worker's assigned area
      if (input.areaId && input.areaId !== assignedAreaId) {
        throw new AppError(HouseholdLabels.AREA_NOT_ASSIGNED, 403, "AREA_NOT_ASSIGNED");
      }
    }

    const area = await householdsRepository.findAreaById(assignedAreaId!);
    if (!area) {
      throw new AppError(HouseholdLabels.AREA_NOT_FOUND, 404, "AREA_NOT_FOUND");
    }

    const code = input.code.trim().toUpperCase();
    const existing = await householdsRepository.findByCode(code);
    if (existing) {
      throw new AppError(HouseholdLabels.CODE_EXISTS, 409, "CODE_EXISTS");
    }

    if (input.id) {
      const existingById = await householdsRepository.findById(input.id);
      if (existingById) {
        throw new AppError(HouseholdLabels.CODE_EXISTS, 409, "ALREADY_EXISTS");
      }
    }

    const household = await householdsRepository.create({
      id: input.id,
      code,
      address: input.address.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      areaId: assignedAreaId!,
      createdById: ownerId,
    });

    // Write hone ke baad purani list/stats cache hatao
    await invalidateHouseholdListCache();
    await invalidateDashboardCache();

    return household;
  }

  async list(user: AuthUser, query: ListHouseholdsQuery) {
    const actor = await this.getActor(user);

    let areaId = query.areaId;
    if (actor.role === "FIELD_WORKER") {
      if (!actor.areaId) {
        return {
          households: [],
          cache: { hit: false, ttlSeconds: CacheTTL.householdsList },
        };
      }
      areaId = actor.areaId;
    }

    const cacheKey = cache.householdsListKey({
      role: actor.role,
      areaId,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    const cached = await cache.get<unknown[]>(cacheKey);
    if (cached) {
      return {
        households: cached,
        cache: { hit: true, ttlSeconds: CacheTTL.householdsList },
      };
    }

    const households = await householdsRepository.list({
      areaId,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    await cache.set(cacheKey, households, CacheTTL.householdsList);

    return {
      households,
      cache: { hit: false, ttlSeconds: CacheTTL.householdsList },
    };
  }

  async getById(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const household = await householdsRepository.findById(id);
    if (!household || household.deletedAt) {
      throw new AppError(HouseholdLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, household.areaId);
    return household;
  }

  async update(user: AuthUser, id: string, input: UpdateHouseholdInput) {
    const actor = await this.getActor(user);
    const household = await householdsRepository.findById(id);
    if (!household || household.deletedAt) {
      throw new AppError(HouseholdLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, household.areaId);

    if (input.code) {
      const code = input.code.trim().toUpperCase();
      const existing = await householdsRepository.findByCode(code);
      if (existing && existing.id !== id) {
        throw new AppError(HouseholdLabels.CODE_EXISTS, 409, "CODE_EXISTS");
      }
    }

    const updated = await householdsRepository.update(id, {
      ...(input.code ? { code: input.code.trim().toUpperCase() } : {}),
      ...(input.address ? { address: input.address.trim() } : {}),
      ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
      ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    });

    await invalidateHouseholdListCache();
    await invalidateDashboardCache();

    return updated;
  }

  async softDelete(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const household = await householdsRepository.findById(id);
    if (!household) {
      throw new AppError(HouseholdLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    if (household.deletedAt) {
      throw new AppError(HouseholdLabels.ALREADY_DELETED, 400, "ALREADY_DELETED");
    }

    this.assertAreaAccess(actor, household.areaId);
    const deleted = await householdsRepository.softDelete(id);

    await invalidateHouseholdListCache();
    await invalidateDashboardCache();

    return deleted;
  }
}

export const householdsService = new HouseholdsService();
