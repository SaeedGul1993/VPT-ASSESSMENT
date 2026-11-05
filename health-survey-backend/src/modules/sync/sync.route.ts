import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { syncController } from "./sync.controller";
import { syncPullQuerySchema, syncPushSchema } from "./sync.validation";

const syncRouter = Router();

syncRouter.use(authenticate, authorize("FIELD_WORKER"));

syncRouter.post(
  "/push",
  validate(syncPushSchema),
  asyncHandler((req, res) => syncController.push(req, res)),
);

syncRouter.get(
  "/pull",
  validate(syncPullQuerySchema, "query"),
  asyncHandler((req, res) => syncController.pull(req, res)),
);

export default syncRouter;
