import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { membersController } from "./members.controller";
import {
  createMemberSchema,
  householdIdParamsSchema,
  memberIdParamsSchema,
  updateMemberSchema,
} from "./members.validation";

// Nested under /api/households/:householdId/members
export const householdMembersRouter = Router({ mergeParams: true });

householdMembersRouter.use(authenticate, authorize("SUPER_ADMIN", "FIELD_WORKER"));

householdMembersRouter.post(
  "/",
  validate(householdIdParamsSchema, "params"),
  validate(createMemberSchema),
  asyncHandler((req, res) => membersController.create(req, res)),
);

householdMembersRouter.get(
  "/",
  validate(householdIdParamsSchema, "params"),
  asyncHandler((req, res) => membersController.listByHousehold(req, res)),
);

// Flat under /api/members
export const membersRouter = Router();

membersRouter.use(authenticate, authorize("SUPER_ADMIN", "FIELD_WORKER"));

membersRouter.get(
  "/:id",
  validate(memberIdParamsSchema, "params"),
  asyncHandler((req, res) => membersController.getById(req, res)),
);

membersRouter.patch(
  "/:id",
  validate(memberIdParamsSchema, "params"),
  validate(updateMemberSchema),
  asyncHandler((req, res) => membersController.update(req, res)),
);

membersRouter.delete(
  "/:id",
  validate(memberIdParamsSchema, "params"),
  asyncHandler((req, res) => membersController.softDelete(req, res)),
);
