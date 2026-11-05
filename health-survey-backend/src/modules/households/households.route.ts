import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { householdsController } from "./households.controller";
import {
  createHouseholdSchema,
  householdIdParamsSchema,
  listHouseholdsQuerySchema,
  updateHouseholdSchema,
} from "./households.validation";

const householdsRouter = Router();

householdsRouter.use(authenticate, authorize("SUPER_ADMIN", "FIELD_WORKER"));

householdsRouter.post(
  "/",
  validate(createHouseholdSchema),
  asyncHandler((req, res) => householdsController.create(req, res)),
);

householdsRouter.get(
  "/",
  validate(listHouseholdsQuerySchema, "query"),
  asyncHandler((req, res) => householdsController.list(req, res)),
);

householdsRouter.get(
  "/:id",
  validate(householdIdParamsSchema, "params"),
  asyncHandler((req, res) => householdsController.getById(req, res)),
);

householdsRouter.patch(
  "/:id",
  validate(householdIdParamsSchema, "params"),
  validate(updateHouseholdSchema),
  asyncHandler((req, res) => householdsController.update(req, res)),
);

householdsRouter.delete(
  "/:id",
  validate(householdIdParamsSchema, "params"),
  asyncHandler((req, res) => householdsController.softDelete(req, res)),
);

export default householdsRouter;
