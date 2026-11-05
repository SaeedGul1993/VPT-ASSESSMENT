import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "../../config/theme";
import { themeModes, type ThemeMode } from "../../constants/Theme.constants";
import { applyTheme, getStoredTheme } from "../../utils/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(getStoredTheme);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () =>
        setMode((current) =>
          current === themeModes.dark ? themeModes.light : themeModes.dark,
        ),
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={createAppTheme(mode)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return ctx;
};

export default AppThemeProvider;
