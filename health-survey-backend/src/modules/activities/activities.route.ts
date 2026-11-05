import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { activitiesController } from "./activities.controller";

const activityIdParamsSchema = z.object({
  id: z.uuid(),
});

const activitiesRouter = Router();

activitiesRouter.use(authenticate, authorize("SUPER_ADMIN"));

activitiesRouter.get(
  "/",
  asyncHandler((req, res) => activitiesController.list(req, res)),
);

activitiesRouter.patch(
  "/:id/read",
  validate(activityIdParamsSchema, "params"),
  asyncHandler((req, res) => activitiesController.markRead(req, res)),
);

export default activitiesRouter;
