import { SyncResult } from "../../generated/prisma";
import { SyncLabels } from "../../labels/sync.labels";
import type { AuthUser } from "../../middleware/authenticate";
import { AppError } from "../../utils/AppError";
import { applyAssessment } from "./apply-assessment";
import { applyHousehold } from "./apply-household";
import { applyMember } from "./apply-member";
import { finishOp, sortOps } from "./sync.helpers";
import { syncRepository } from "./sync.repository";
import type { OpResult, SyncWorker } from "./sync.types";
import type {
  SyncOpInput,
  SyncPullQuery,
  SyncPushInput,
} from "./sync.validation";

export class SyncService {
  private async getWorker(user: AuthUser): Promise<SyncWorker> {
    const actor = await syncRepository.findUserById(user.id);
    if (!actor || !actor.isActive) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }
    if (actor.role !== "FIELD_WORKER") {
      throw new AppError(SyncLabels.FORBIDDEN, 403, "FORBIDDEN");
    }
    if (!actor.areaId) {
      throw new AppError(SyncLabels.AREA_REQUIRED, 400, "AREA_REQUIRED");
    }
    return { id: actor.id, areaId: actor.areaId };
  }

  private async applyOne(
    worker: SyncWorker,
    op: SyncOpInput,
  ): Promise<OpResult> {
    // Same opId again? return old result (no duplicate)
    const existingOp = await syncRepository.findSyncOp(worker.id, op.opId);
    if (existingOp) {
      const stored = (existingOp.response ?? {}) as {
        entity?: unknown;
        message?: string;
      };
      return {
        opId: op.opId,
        entityType: op.entityType,
        entityId: op.entityId,
        action: op.action,
        result: existingOp.result,
        entity: stored.entity ?? null,
        message: stored.message,
      };
    }

    try {
      if (op.entityType === "HOUSEHOLD") return applyHousehold(worker, op);
      if (op.entityType === "MEMBER") return applyMember(worker, op);
      return applyAssessment(worker, op);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync op failed";
      return finishOp(worker.id, op, SyncResult.REJECTED, null, message);
    }
  }

  /** Mobile → Server: pending offline changes */
  async push(user: AuthUser, input: SyncPushInput) {
    const worker = await this.getWorker(user);
    const results: OpResult[] = [];

    for (const op of sortOps(input.ops)) {
      results.push(await this.applyOne(worker, op));
    }

    return { results };
  }

  /** Server → Mobile: area changes since last sync */
  async pull(user: AuthUser, query: SyncPullQuery) {
    const worker = await this.getWorker(user);
    const since = query.since ? new Date(query.since) : undefined;
    const serverTime = new Date();

    const households = await syncRepository.pullHouseholds(
      worker.areaId,
      since,
    );

    // Members/assessments for all area households (even if household itself unchanged)
    const areaHouseholds = await syncRepository.findAreaHouseholdIds(
      worker.areaId,
    );
    const householdIds = areaHouseholds.map((h) => h.id);

    const members = await syncRepository.pullMembers(householdIds, since);
    const memberIds = (
      await syncRepository.prisma.householdMember.findMany({
        where: { householdId: { in: householdIds } },
        select: { id: true },
      })
    ).map((m) => m.id);

    const assessments = await syncRepository.pullAssessments(memberIds, since);

    return {
      serverTime,
      since: since ?? null,
      households,
      members,
      assessments,
      counts: {
        households: households.length,
        members: members.length,
        assessments: assessments.length,
      },
    };
  }
}

export const syncService = new SyncService();
