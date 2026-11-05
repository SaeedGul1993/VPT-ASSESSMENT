import { memo, useEffect } from "react";
import labels from "../../assets/labels";
import { breakpoints, zIndex } from "../../constants/Common.constants";
import type { SidebarItem } from "../../constants/Sidebar.constants";

type Props = {
  brand?: {
    accent: string;
    rest: string;
    tagline: string;
  };
  items?: SidebarItem[];
  activeId: string;
  open?: boolean;
  onClose?: () => void;
  onSelect?: (id: string) => void;
  footer?: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  };
};

const rowClass = (active: boolean) =>
  active
    ? "bg-sidebar-active-bg text-sidebar-text-active"
    : "text-sidebar-text hover:bg-sidebar-hover";

const Sidebar = ({
  brand,
  items = [],
  activeId,
  open = false,
  onClose,
  onSelect,
  footer,
}: Props) => {
  useEffect(() => {
    const desktop = window.matchMedia(`(min-width: ${breakpoints.desktop}px)`);
    const lockScroll = () => {
      document.body.style.overflow = open && !desktop.matches ? "hidden" : "";
    };
    lockScroll();
    desktop.addEventListener("change", lockScroll);
    return () => {
      desktop.removeEventListener("change", lockScroll);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (id: string) =>
    activeId === id || activeId.startsWith(`${id}/`);

  return (
    <div
      className={`fixed inset-y-0 left-0 flex h-svh max-w-full shrink-0 transition-transform duration-300 lg:static lg:h-full lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ zIndex: zIndex.sidebar }}
    >
      <nav className="flex w-56 flex-col bg-sidebar">
        {brand ? (
          <div className="border-b border-[var(--pd-sidebar-border)] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--pd-primary-container)]">
                <svg
                  className="h-5 w-5 text-[var(--pd-on-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight text-sidebar-text-active">
                  <span className="text-secondary">{brand.accent}</span>{" "}
                  {brand.rest}
                </h1>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--pd-sidebar-text)] opacity-80">
                  {brand.tagline}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col overflow-y-auto py-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${rowClass(isActive(item.id))}`}
              onClick={() => {
                onSelect?.(item.id);
                onClose?.();
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {footer ? (
          <button
            type="button"
            aria-label={labels.logout}
            className="flex items-center gap-3 border-t border-sidebar-border px-4 py-3 text-left text-sm text-sidebar-text hover:bg-sidebar-hover"
            onClick={footer.onClick}
          >
            {footer.icon}
            <span>{footer.label}</span>
          </button>
        ) : null}
      </nav>
    </div>
  );
};

export default memo(Sidebar);
