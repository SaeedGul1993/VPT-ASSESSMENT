import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { appRoutes } from "../constants/AppRoutes.constants";
import { roles } from "../constants/Common.constants";
import { selectIsLoggedIn, selectUser } from "../store/authSlice";

export default function PublicRoute() {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const isSuperAdmin = user?.role === roles.SUPER_ADMIN;

  if (isAuthenticated && isSuperAdmin) {
    return <Navigate to={appRoutes.dashboard} replace />;
  }

  return <Outlet />;
}
