import type { AuthUser } from './models';

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
