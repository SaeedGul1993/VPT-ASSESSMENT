import { useDispatch } from 'react-redux';
import baseApi from '../services/api';
import { useLogoutMutation } from '../services/AuthService';
import { logout } from '../store/authSlice';
import { secureStorage } from '../thirdParties/secureStorage';
import { getErrorMessage } from '../utils/apiError';
import { showError, showSuccess } from '../utils/toast';

const useLogout = () => {
  const dispatch = useDispatch();
  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const signOut = async () => {
    try {
      const response = await logoutRequest().unwrap();
      showSuccess(response.message);
    } catch (error) {
      showError(getErrorMessage(error, 'Signed out locally'));
    } finally {
      await secureStorage.clearTokens();
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
    }
  };

  return { signOut, isLoggingOut: isLoading };
};

export default useLogout;
