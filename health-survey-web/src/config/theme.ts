import { createTheme } from "@mui/material/styles";
import { colors, darkColors } from "../constants/Colors.constants";
import { fonts } from "../constants/Common.constants";
import { themeModes, type ThemeMode } from "../constants/Theme.constants";

export const createAppTheme = (mode: ThemeMode = themeModes.light) => {
  const palette = mode === themeModes.dark ? darkColors : colors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: palette.primary,
        dark: palette.primaryDark,
        light: palette.primaryContainer,
        contrastText: palette.onPrimary,
      },
      secondary: {
        main: palette.secondary,
        dark: palette.secondaryDark,
        light: palette.secondaryContainer,
        contrastText: palette.onSecondary,
      },
      error: {
        main: palette.error,
        contrastText: palette.onError,
      },
      success: {
        main: palette.success,
      },
      warning: {
        main: palette.warning,
      },
      background: {
        default: palette.background,
        paper: palette.surfaceContainerLowest,
      },
      text: {
        primary: palette.onSurface,
        secondary: palette.onSurfaceVariant,
      },
      divider: palette.outlineVariant,
    },
    typography: {
      fontFamily: fonts.sans,
    },
    components: {
      MuiButton: {
        defaultProps: {
          color: "primary",
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "medium",
        },
      },
    },
  });
};

export default createAppTheme();
