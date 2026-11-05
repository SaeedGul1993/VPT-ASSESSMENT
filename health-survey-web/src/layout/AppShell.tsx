import type { ReactNode } from "react";
import labels from "../assets/labels";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { zIndex } from "../constants/Common.constants";
import {
  sidebarBrand,
  sidebarFooter,
  sidebarItems,
} from "../constants/Sidebar.constants";
import useAppShell from "./hook/useAppShell";

const AppShell = ({ children }: { children: ReactNode }) => {
  const {
    pathname,
    navbarUser,
    mode,
    toggleTheme,
    menuOpen,
    openMenu,
    closeMenu,
    handleSelect,
    handleLogout,
  } = useAppShell();

  return (
    <div className="flex h-svh w-full overflow-hidden text-left">
      {menuOpen ? (
        <button
          type="button"
          aria-label={labels.closeMenu}
          className="fixed inset-0 bg-black/40 lg:hidden"
          style={{ zIndex: zIndex.backdrop }}
          onClick={closeMenu}
        />
      ) : null}

      <Sidebar
        brand={sidebarBrand}
        items={sidebarItems}
        activeId={pathname}
        open={menuOpen}
        onClose={closeMenu}
        onSelect={handleSelect}
        footer={{
          ...sidebarFooter,
          onClick: handleLogout,
        }}
      />

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          eyebrow={labels.workspace}
          accent={labels.brandAccent}
          title={labels.brandRest}
          user={navbarUser}
          theme={mode}
          onToggleTheme={toggleTheme}
          onMenuClick={openMenu}
        />
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
};

export default AppShell;
