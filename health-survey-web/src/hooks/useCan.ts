import { useSelector } from "react-redux";
import { roles } from "../constants/Common.constants";
import { selectUser } from "../store/authSlice";

const useCan = () => {
  const user = useSelector(selectUser);
  const isSuperAdmin = user?.role === roles.SUPER_ADMIN;

  return {
    user,
    isSuperAdmin,
    canAdmin: isSuperAdmin,
  };
};

export default useCan;
