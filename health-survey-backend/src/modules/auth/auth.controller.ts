import type { Request, Response } from "express";
import { AuthLabels } from "../../labels/auth.labels";
import { authService } from "./auth.service";
import type { LoginInput, RefreshInput } from "./auth.validation";

export class AuthController {
  async login(req: Request, res: Response) {
    const body = req.body as LoginInput;
    const result = await authService.login(body);

    return res.status(200).json({
      success: true,
      message: AuthLabels.LOGIN_SUCCESS,
      data: result,
    });
  }

  async refresh(req: Request, res: Response) {
    const body = req.body as RefreshInput;
    const result = await authService.refresh(body.refreshToken);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async logout(req: Request, res: Response) {
    const result = await authService.logout(req.user!.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  async me(req: Request, res: Response) {
    const user = await authService.me(req.user!.id);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  }
}

export const authController = new AuthController();
