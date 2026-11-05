import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { areasController } from "./areas.controller";
import {
  areaIdParamsSchema,
  createAreaSchema,
  updateAreaSchema,
} from "./areas.validation";

const areasRouter = Router();

areasRouter.use(authenticate, authorize("SUPER_ADMIN"));

areasRouter.post(
  "/",
  validate(createAreaSchema),
  asyncHandler((req, res) => areasController.create(req, res)),
);

areasRouter.get(
  "/",
  asyncHandler((req, res) => areasController.list(req, res)),
);

areasRouter.get(
  "/:id",
  validate(areaIdParamsSchema, "params"),
  asyncHandler((req, res) => areasController.getById(req, res)),
);

areasRouter.patch(
  "/:id",
  validate(areaIdParamsSchema, "params"),
  validate(updateAreaSchema),
  asyncHandler((req, res) => areasController.update(req, res)),
);

export default areasRouter;
