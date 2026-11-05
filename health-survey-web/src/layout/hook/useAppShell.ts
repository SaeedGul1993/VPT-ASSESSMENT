import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeMode } from "../../components/themeProvider/ThemeProvider";
import { useLogoutMutation } from "../../services/AuthService";
import baseApi from "../../services/api";
import { logout, selectUser } from "../../store/authSlice";
import { getErrorMessage } from "../../utils/apiError";
import { showError, showSuccess } from "../../utils/toast";

const useAppShell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector(selectUser);
  const { mode, toggleTheme } = useThemeMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutRequest] = useLogoutMutation();

  const navbarUser = useMemo(
    () => ({
      name: user?.name || user?.email || "Admin",
      role: user?.role?.replaceAll("_", " ") || "",
    }),
    [user],
  );

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const handleSelect = (id: string) => {
    navigate(id);
    closeMenu();
  };

  const handleLogout = async () => {
    try {
      const response = await logoutRequest().unwrap();
      showSuccess(response.message);
    } catch (error) {
      showError(getErrorMessage(error, "Signed out locally"));
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate("/");
    }
  };

  return {
    pathname,
    navbarUser,
    mode,
    toggleTheme,
    menuOpen,
    openMenu,
    closeMenu,
    handleSelect,
    handleLogout,
  };
};

export default useAppShell;
