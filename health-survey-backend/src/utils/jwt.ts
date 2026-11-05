import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { Role } from "../types/role";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: Role;
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  type: "refresh";
};

type AccessTokenInput = {
  id: string;
  email: string;
  role: Role;
};

type RefreshTokenInput = {
  id: string;
};

export function signAccessToken(user: AccessTokenInput): string {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: "access",
  };

  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
  } as jwt.SignOptions);
}

export function signRefreshToken(user: RefreshTokenInput): string {
  const payload: RefreshTokenPayload = {
    sub: user.id,
    type: "refresh",
  };

  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtl,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;

  if (payload.type !== "access") {
    throw new Error("Invalid access token type");
  }

  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;

  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }

  return payload;
}
