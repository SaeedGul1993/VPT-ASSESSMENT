import { lazy } from "react";
import { appRoutes } from "./AppRoutes.constants";

const LoginPage = lazy(() => import("../pages/auth/login/index.tsx"));
const DashboardPage = lazy(() => import("../pages/dashboard/index.tsx"));
const FieldWorkersPage = lazy(() => import("../pages/field-workers/index.tsx"));
const AreasPage = lazy(() => import("../pages/areas/index.tsx"));
const HouseholdsPage = lazy(() => import("../pages/households/index.tsx"));
const HouseholdDetailPage = lazy(
  () => import("../pages/households/detail/index.tsx"),
);

export const publicRoutes = [
  { path: appRoutes.login, component: LoginPage },
];

export const protectedRoutes = [
  { path: appRoutes.dashboard, component: DashboardPage },
  { path: appRoutes.fieldWorkers, component: FieldWorkersPage },
  { path: appRoutes.areas, component: AreasPage },
  { path: appRoutes.households, component: HouseholdsPage },
  { path: appRoutes.householdDetail, component: HouseholdDetailPage },
];
