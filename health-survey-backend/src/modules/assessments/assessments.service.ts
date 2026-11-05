import { AssessmentLabels } from "../../labels/assessment.labels";
import type { AuthUser } from "../../middleware/authenticate";
import { upsertUrgentActivity } from "../activities/urgentActivity";
import { enqueueUrgentAssessmentSafe } from "../../queues/notification.queue";
import { AppError } from "../../utils/AppError";
import { invalidateDashboardCache } from "../../utils/cache";
import { assessmentsRepository } from "./assessments.repository";
import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from "./assessments.validation";

async function notifyUrgentAssessment(assessment: {
  id: string;
  memberId: string;
  temperature: number | null;
  hasBreathingDifficulty: boolean;
  flaggedForReview: boolean;
}) {
  // Activity pehle sync likho — Redis/worker down ho to bhi dashboard pe dikhe
  await upsertUrgentActivity({
    assessmentId: assessment.id,
    temperature: assessment.temperature,
    hasBreathingDifficulty: assessment.hasBreathingDifficulty,
    flaggedForReview: assessment.flaggedForReview,
  });

  await enqueueUrgentAssessmentSafe({
    assessmentId: assessment.id,
    memberId: assessment.memberId,
    temperature: assessment.temperature,
    hasBreathingDifficulty: assessment.hasBreathingDifficulty,
    flaggedForReview: assessment.flaggedForReview,
  });
}

function computeIsUrgent(input: {
  temperature?: number | null;
  hasBreathingDifficulty?: boolean;
  flaggedForReview?: boolean;
}) {
  const highTemp = input.temperature != null && input.temperature >= 39;
  return Boolean(
    highTemp || input.hasBreathingDifficulty || input.flaggedForReview,
  );
}

export class AssessmentsService {
  private async getActor(user: AuthUser) {
    const actor = await assessmentsRepository.findUserById(user.id);
    if (!actor || !actor.isActive) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }
    return actor;
  }

  private assertAreaAccess(
    actor: { role: string; areaId: string | null },
    areaId: string,
  ) {
    if (actor.role === "SUPER_ADMIN") return;
    if (!actor.areaId || actor.areaId !== areaId) {
      throw new AppError(AssessmentLabels.FORBIDDEN_AREA, 403, "FORBIDDEN_AREA");
    }
  }

  async create(user: AuthUser, memberId: string, input: CreateAssessmentInput) {
    const actor = await this.getActor(user);
    const member = await assessmentsRepository.findMemberById(memberId);

    if (!member || member.deletedAt || member.household.deletedAt) {
      throw new AppError(AssessmentLabels.MEMBER_NOT_FOUND, 404, "MEMBER_NOT_FOUND");
    }

    this.assertAreaAccess(actor, member.household.areaId);

    if (input.id) {
      const existing = await assessmentsRepository.findById(input.id);
      if (existing) {
        throw new AppError("Assessment already exists", 409, "ALREADY_EXISTS");
      }
    }

    const isUrgent = computeIsUrgent({
      temperature: input.temperature,
      hasBreathingDifficulty: input.hasBreathingDifficulty,
      flaggedForReview: input.flaggedForReview,
    });

    const assessment = await assessmentsRepository.create({
      ...(input.id ? { id: input.id } : {}),
      memberId,
      recordedBy: actor.id,
      temperature: input.temperature ?? null,
      hasFever: input.hasFever ?? false,
      hasCough: input.hasCough ?? false,
      hasBreathingDifficulty: input.hasBreathingDifficulty ?? false,
      systolicBp: input.systolicBp ?? null,
      diastolicBp: input.diastolicBp ?? null,
      notes: input.notes ?? null,
      flaggedForReview: input.flaggedForReview ?? false,
      isUrgent,
      ...(input.assessedAt ? { assessedAt: new Date(input.assessedAt) } : {}),
    });

    if (assessment.isUrgent) {
      await notifyUrgentAssessment(assessment);
    }

    await invalidateDashboardCache();
    return assessment;
  }

  async listByMember(user: AuthUser, memberId: string) {
    const actor = await this.getActor(user);
    const member = await assessmentsRepository.findMemberById(memberId);

    if (!member || member.deletedAt || member.household.deletedAt) {
      throw new AppError(AssessmentLabels.MEMBER_NOT_FOUND, 404, "MEMBER_NOT_FOUND");
    }

    this.assertAreaAccess(actor, member.household.areaId);
    return assessmentsRepository.listByMember(memberId);
  }

  async getById(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const assessment = await assessmentsRepository.findById(id);

    if (
      !assessment ||
      assessment.deletedAt ||
      assessment.member.deletedAt ||
      assessment.member.household.deletedAt
    ) {
      throw new AppError(AssessmentLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, assessment.member.household.areaId);
    return assessment;
  }

  async update(user: AuthUser, id: string, input: UpdateAssessmentInput) {
    const actor = await this.getActor(user);
    const existing = await assessmentsRepository.findById(id);

    if (
      !existing ||
      existing.deletedAt ||
      existing.member.deletedAt ||
      existing.member.household.deletedAt
    ) {
      throw new AppError(AssessmentLabels.NOT_FOUND, 404, "NOT_FOUND");
    }

    this.assertAreaAccess(actor, existing.member.household.areaId);

    const next = {
      temperature:
        input.temperature !== undefined ? input.temperature : existing.temperature,
      hasBreathingDifficulty:
        input.hasBreathingDifficulty !== undefined
          ? input.hasBreathingDifficulty
          : existing.hasBreathingDifficulty,
      flaggedForReview:
        input.flaggedForReview !== undefined
          ? input.flaggedForReview
          : existing.flaggedForReview,
    };

    const updated = await assessmentsRepository.update(id, {
      ...(input.temperature !== undefined ? { temperature: input.temperature } : {}),
      ...(input.hasFever !== undefined ? { hasFever: input.hasFever } : {}),
      ...(input.hasCough !== undefined ? { hasCough: input.hasCough } : {}),
      ...(input.hasBreathingDifficulty !== undefined
        ? { hasBreathingDifficulty: input.hasBreathingDifficulty }
        : {}),
      ...(input.systolicBp !== undefined ? { systolicBp: input.systolicBp } : {}),
      ...(input.diastolicBp !== undefined ? { diastolicBp: input.diastolicBp } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.flaggedForReview !== undefined
        ? { flaggedForReview: input.flaggedForReview }
        : {}),
      ...(input.assessedAt ? { assessedAt: new Date(input.assessedAt) } : {}),
      isUrgent: computeIsUrgent(next),
    });

    if (updated.isUrgent) {
      await notifyUrgentAssessment(updated);
    }

    await invalidateDashboardCache();
    return updated;
  }

  async softDelete(user: AuthUser, id: string) {
    const actor = await this.getActor(user);
    const assessment = await assessmentsRepository.findById(id);

    if (!assessment || assessment.member.deletedAt || assessment.member.household.deletedAt) {
      throw new AppError(AssessmentLabels.NOT_FOUND, 404, "NOT_FOUND");
    }
    if (assessment.deletedAt) {
      throw new AppError(AssessmentLabels.ALREADY_DELETED, 400, "ALREADY_DELETED");
    }

    this.assertAreaAccess(actor, assessment.member.household.areaId);
    const deleted = await assessmentsRepository.softDelete(id);
    await invalidateDashboardCache();
    return deleted;
  }
}

export const assessmentsService = new AssessmentsService();
