export const roles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FIELD_WORKER: 'FIELD_WORKER',
} as const;

export type UserRole = (typeof roles)[keyof typeof roles];

export const apiContentTypes = {
  applicationJson: 'application/json',
} as const;
