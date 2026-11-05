import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { fieldWorkersController } from "./field-workers.controller";
import {
  assignFieldWorkerAreaSchema,
  createFieldWorkerSchema,
  fieldWorkerIdParamsSchema,
  updateFieldWorkerStatusSchema,
} from "./field-workers.validation";

const fieldWorkersRouter = Router();

fieldWorkersRouter.use(authenticate, authorize("SUPER_ADMIN"));

fieldWorkersRouter.post(
  "/",
  validate(createFieldWorkerSchema),
  asyncHandler((req, res) => fieldWorkersController.create(req, res)),
);

fieldWorkersRouter.get(
  "/",
  asyncHandler((req, res) => fieldWorkersController.list(req, res)),
);

fieldWorkersRouter.get(
  "/:id",
  validate(fieldWorkerIdParamsSchema, "params"),
  asyncHandler((req, res) => fieldWorkersController.getById(req, res)),
);

fieldWorkersRouter.patch(
  "/:id/status",
  validate(fieldWorkerIdParamsSchema, "params"),
  validate(updateFieldWorkerStatusSchema),
  asyncHandler((req, res) => fieldWorkersController.updateStatus(req, res)),
);

fieldWorkersRouter.patch(
  "/:id/area",
  validate(fieldWorkerIdParamsSchema, "params"),
  validate(assignFieldWorkerAreaSchema),
  asyncHandler((req, res) => fieldWorkersController.assignArea(req, res)),
);

export default fieldWorkersRouter;
