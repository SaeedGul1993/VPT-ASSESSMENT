import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { assessmentsController } from "./assessments.controller";
import {
  assessmentIdParamsSchema,
  createAssessmentSchema,
  memberIdParamsSchema,
  updateAssessmentSchema,
} from "./assessments.validation";

// Nested under /api/members/:memberId/assessments
export const memberAssessmentsRouter = Router({ mergeParams: true });

memberAssessmentsRouter.use(authenticate, authorize("SUPER_ADMIN", "FIELD_WORKER"));

memberAssessmentsRouter.post(
  "/",
  validate(memberIdParamsSchema, "params"),
  validate(createAssessmentSchema),
  asyncHandler((req, res) => assessmentsController.create(req, res)),
);

memberAssessmentsRouter.get(
  "/",
  validate(memberIdParamsSchema, "params"),
  asyncHandler((req, res) => assessmentsController.listByMember(req, res)),
);

// Flat under /api/assessments
export const assessmentsRouter = Router();

assessmentsRouter.use(authenticate, authorize("SUPER_ADMIN", "FIELD_WORKER"));

assessmentsRouter.get(
  "/:id",
  validate(assessmentIdParamsSchema, "params"),
  asyncHandler((req, res) => assessmentsController.getById(req, res)),
);

assessmentsRouter.patch(
  "/:id",
  validate(assessmentIdParamsSchema, "params"),
  validate(updateAssessmentSchema),
  asyncHandler((req, res) => assessmentsController.update(req, res)),
);

assessmentsRouter.delete(
  "/:id",
  validate(assessmentIdParamsSchema, "params"),
  asyncHandler((req, res) => assessmentsController.softDelete(req, res)),
);
