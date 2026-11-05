import type { NextFunction, Request, Response } from "express";
import { AuthLabels } from "../labels/auth.labels";
import type { Role } from "../types/role";
import { AppError } from "../utils/AppError";

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(AuthLabels.UNAUTHORIZED, 401, "UNAUTHORIZED"));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new AppError(AuthLabels.FORBIDDEN, 403, "FORBIDDEN"));
    }

    return next();
  };
}
