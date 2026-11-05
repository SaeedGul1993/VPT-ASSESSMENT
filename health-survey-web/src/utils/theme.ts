import { themeModes, themeStorageKey, type ThemeMode } from "../constants/Theme.constants";

export const getStoredTheme = (): ThemeMode => {
  const saved = localStorage.getItem(themeStorageKey);
  return saved === themeModes.dark ? themeModes.dark : themeModes.light;
};

export const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem(themeStorageKey, mode);
};
