import type { Request, Response } from "express";
import { AssessmentLabels } from "../../labels/assessment.labels";
import { assessmentsService } from "./assessments.service";
import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from "./assessments.validation";

export class AssessmentsController {
  async create(req: Request, res: Response) {
    const assessment = await assessmentsService.create(
      req.user!,
      req.params.memberId as string,
      req.body as CreateAssessmentInput,
    );

    return res.status(201).json({
      success: true,
      message: AssessmentLabels.CREATED,
      data: { assessment },
    });
  }

  async listByMember(req: Request, res: Response) {
    const assessments = await assessmentsService.listByMember(
      req.user!,
      req.params.memberId as string,
    );

    return res.status(200).json({
      success: true,
      message: AssessmentLabels.LISTED,
      data: { assessments },
    });
  }

  async getById(req: Request, res: Response) {
    const assessment = await assessmentsService.getById(
      req.user!,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: AssessmentLabels.FETCHED,
      data: { assessment },
    });
  }

  async update(req: Request, res: Response) {
    const assessment = await assessmentsService.update(
      req.user!,
      req.params.id as string,
      req.body as UpdateAssessmentInput,
    );

    return res.status(200).json({
      success: true,
      message: AssessmentLabels.UPDATED,
      data: { assessment },
    });
  }

  async softDelete(req: Request, res: Response) {
    const assessment = await assessmentsService.softDelete(
      req.user!,
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      message: AssessmentLabels.DELETED,
      data: { assessment },
    });
  }
}

export const assessmentsController = new AssessmentsController();
