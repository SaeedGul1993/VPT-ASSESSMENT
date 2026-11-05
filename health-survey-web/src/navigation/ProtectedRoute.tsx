import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../constants/Common.constants";
import { appRoutes } from "../constants/AppRoutes.constants";
import baseApi from "../services/api";
import { logout, selectIsLoggedIn, selectUser } from "../store/authSlice";
import { showError } from "../utils/toast";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const isSuperAdmin = user?.role === roles.SUPER_ADMIN;

  useEffect(() => {
    if (isAuthenticated && user && !isSuperAdmin) {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      showError("Only Super Admin can access the web console.");
    }
  }, [dispatch, isAuthenticated, isSuperAdmin, user]);

  if (!isAuthenticated) {
    return <Navigate to={appRoutes.login} replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return <Outlet />;
}
