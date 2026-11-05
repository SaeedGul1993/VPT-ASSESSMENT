import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import labels from '../../../../assets/labels';
import { roles } from '../../../../constants/Common.constants';
import { useLoginMutation } from '../../../../services/AuthService';
import {
  setIsLoggedIn,
  setRefreshToken,
  setToken,
  setUser,
} from '../../../../store/authSlice';
import { secureStorage } from '../../../../thirdParties/secureStorage';
import { getErrorMessage } from '../../../../utils/apiError';
import { showError, showSuccess } from '../../../../utils/toast';

const useAuthApi = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const canSubmit = useMemo(
    () => email.trim() !== '' && password.trim() !== '',
    [email, password],
  );

  const submit = async () => {
    if (!canSubmit || isLoading) return;

    try {
      const response = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      const { accessToken, refreshToken, user } = response.data;

      if (user.role !== roles.FIELD_WORKER) {
        showError(labels.fieldWorkerOnly);
        return;
      }

      if (!user.isActive) {
        showError('This account is inactive.');
        return;
      }

      await secureStorage.saveTokens({ accessToken, refreshToken });

      dispatch(setToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
      showSuccess(response.message);
    } catch (error) {
      showError(getErrorMessage(error, labels.loginFailed));
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    canSubmit,
    isSubmitting: isLoading,
    submit,
  };
};

export default useAuthApi;
