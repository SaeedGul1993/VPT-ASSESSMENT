import { memo } from "react";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import labels from "../../assets/labels";
import { themeModes, type ThemeMode } from "../../constants/Theme.constants";

type Props = {
  eyebrow?: string;
  accent?: string;
  title?: string;
  user?: { name: string; role?: string } | null;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onMenuClick?: () => void;
};

const Navbar = ({
  eyebrow,
  accent,
  title,
  user,
  theme = themeModes.light,
  onToggleTheme,
  onMenuClick,
}: Props) => {
  const isDark = theme === themeModes.dark;
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "";

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 border-b border-border-card bg-surface-container-lowest px-3 py-3 sm:gap-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        {onMenuClick ? (
          <button
            type="button"
            aria-label={labels.openMenu}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface hover:bg-surface-container lg:hidden"
            onClick={onMenuClick}
          >
            <MenuOutlined fontSize="small" />
          </button>
        ) : null}
        <div className="min-w-0 text-left">
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
              {eyebrow}
            </p>
          ) : null}
          <p className="text-base font-semibold leading-tight text-on-surface">
            {accent ? <span className="text-primary">{accent}</span> : null}
            {accent && title ? " " : null}
            {title}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={isDark ? labels.switchToLight : labels.switchToDark}
          className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
          onClick={onToggleTheme}
        >
          {isDark ? (
            <LightModeOutlined fontSize="small" />
          ) : (
            <DarkModeOutlined fontSize="small" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2 rounded-lg px-1 py-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
              {initial}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-medium text-on-surface">
                {user.name}
              </span>
              {user.role ? (
                <span className="block text-xs text-on-surface-variant">
                  {user.role}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default memo(Navbar);
