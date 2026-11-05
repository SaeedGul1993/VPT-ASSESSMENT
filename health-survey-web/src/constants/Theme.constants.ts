export const themeModes = {
  light: "light",
  dark: "dark",
} as const;

export type ThemeMode = (typeof themeModes)[keyof typeof themeModes];

export const themeStorageKey = "theme";
