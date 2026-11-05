import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { asyncHandler } from "../../utils/asyncHandler";
import { dashboardController } from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize("SUPER_ADMIN"));

dashboardRouter.get(
  "/stats",
  asyncHandler((req, res) => dashboardController.stats(req, res)),
);

export default dashboardRouter;
