import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { authController } from "./auth.controller";
import { loginSchema, refreshSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler((req, res) => authController.login(req, res)),
);

authRouter.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler((req, res) => authController.refresh(req, res)),
);

authRouter.post(
  "/logout",
  authenticate,
  asyncHandler((req, res) => authController.logout(req, res)),
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler((req, res) => authController.me(req, res)),
);

export default authRouter;
