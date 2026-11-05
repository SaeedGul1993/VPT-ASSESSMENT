import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import labels from "../../../../assets/labels";
import { appRoutes } from "../../../../constants/AppRoutes.constants";
import { roles } from "../../../../constants/Common.constants";
import { useLoginMutation } from "../../../../services/AuthService";
import {
  setIsLoggedIn,
  setRefreshToken,
  setToken,
  setUser,
} from "../../../../store/authSlice";
import { getErrorMessage } from "../../../../utils/apiError";
import { showError, showSuccess } from "../../../../utils/toast";

const useAuthApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleChange =
    (field: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (field === "email") setEmail(value);
      else setPassword(value);
    };

  const canSubmit = useMemo(
    () => email.trim() !== "" && password.trim() !== "",
    [email, password],
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      const { accessToken, refreshToken, user } = response.data;

      if (user.role !== roles.SUPER_ADMIN) {
        showError("Only Super Admin can access the web console.");
        return;
      }

      dispatch(setToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
      showSuccess(response.message);
      navigate(appRoutes.dashboard);
    } catch (error) {
      showError(getErrorMessage(error, labels.loginFailed));
    }
  };

  return {
    email,
    password,
    handleChange,
    canSubmit,
    isSubmitting: isLoading,
    submit,
  };
};

export default useAuthApi;
