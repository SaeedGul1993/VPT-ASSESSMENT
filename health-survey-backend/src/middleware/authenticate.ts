import type { NextFunction, Request, Response } from "express";
import { AuthLabels } from "../labels/auth.labels";
import type { Role } from "../types/role";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(AuthLabels.UNAUTHORIZED, 401, "UNAUTHORIZED"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch {
    return next(new AppError(AuthLabels.UNAUTHORIZED, 401, "UNAUTHORIZED"));
  }
}
