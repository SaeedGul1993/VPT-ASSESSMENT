import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import HomeWorkOutlined from "@mui/icons-material/HomeWorkOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import MapOutlined from "@mui/icons-material/MapOutlined";
import labels from "../assets/labels";
import { appRoutes } from "./AppRoutes.constants";

export type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export const sidebarBrand = {
  accent: labels.brandAccent,
  rest: labels.brandRest,
  tagline: labels.appTagline,
};

export const sidebarItems: SidebarItem[] = [
  {
    id: appRoutes.dashboard,
    label: labels.dashboard,
    icon: <DashboardOutlined fontSize="small" />,
  },
  {
    id: appRoutes.fieldWorkers,
    label: labels.fieldWorkers,
    icon: <GroupsOutlined fontSize="small" />,
  },
  {
    id: appRoutes.areas,
    label: labels.areas,
    icon: <MapOutlined fontSize="small" />,
  },
  {
    id: appRoutes.households,
    label: labels.households,
    icon: <HomeWorkOutlined fontSize="small" />,
  },
];

export const sidebarFooter = {
  label: labels.logout,
  icon: <LogoutOutlined fontSize="small" />,
};
