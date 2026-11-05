export const apiContentTypes = {
  applicationJson: "application/json",
} as const;

export const zIndex = {
  selectMenu: 1500,
  backdrop: 30,
  sidebar: 40,
  toast: 1600,
};

export const toastPosition = "top-right" as const;

export const fieldSize = {
  height: 48,
};

export const breakpoints = {
  desktop: 1024,
};

export const fonts = {
  sans: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  FIELD_WORKER: "FIELD_WORKER",
} as const;

export type UserRole = (typeof roles)[keyof typeof roles];
