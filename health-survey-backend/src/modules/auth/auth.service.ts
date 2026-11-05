import bcrypt from "bcrypt";
import { AuthLabels } from "../../labels/auth.labels";
import { AppError } from "../../utils/AppError";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import {
  authRepository,
  type AuthUserRecord,
} from "./auth.repository";
import type { LoginInput } from "./auth.validation";

export class AuthService {
  private toPublicUser(user: AuthUserRecord) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      areaId: user.areaId,
      area: user.area
        ? {
            id: user.area.id,
            name: user.area.name,
            code: user.area.code,
          }
        : null,
    };
  }

  private async issueTokens(user: AuthUserRecord) {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.toPublicUser(user),
    };
  }

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email.toLowerCase());
    if (!user) {
      throw new AppError(AuthLabels.INVALID_CREDENTIALS, 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) {
      throw new AppError(AuthLabels.INVALID_CREDENTIALS, 401, "INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
      throw new AppError(AuthLabels.ACCOUNT_INACTIVE, 403, "ACCOUNT_INACTIVE");
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(AuthLabels.INVALID_REFRESH_TOKEN, 401, "INVALID_REFRESH_TOKEN");
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      throw new AppError(AuthLabels.INVALID_REFRESH_TOKEN, 401, "INVALID_REFRESH_TOKEN");
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await authRepository.updateRefreshToken(userId, null);
    return { message: AuthLabels.LOGOUT_SUCCESS };
  }

  async me(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new AppError(AuthLabels.UNAUTHORIZED, 401, "UNAUTHORIZED");
    }

    return this.toPublicUser(user);
  }
}

export const authService = new AuthService();
