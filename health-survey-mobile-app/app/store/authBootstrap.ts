import { secureStorage } from '../thirdParties/secureStorage';
import {
  logout,
  setIsLoggedIn,
  setRefreshToken,
  setToken,
} from './authSlice';
import type { AppDispatch, RootState } from './index';

/**
 * After redux-persist rehydrates user/session flags, restore tokens from Keychain.
 * If session says logged-in but Keychain is empty → force logout.
 */
export const restoreSecureTokens = async (
  dispatch: AppDispatch,
  getState: () => RootState,
) => {
  const tokens = await secureStorage.getTokens();
  const auth = getState().auth;
  const isLoggedIn = Boolean(auth?.isLoggedIn);

  if (tokens) {
    dispatch(setToken(tokens.accessToken));
    dispatch(setRefreshToken(tokens.refreshToken));
    if (!isLoggedIn) {
      dispatch(setIsLoggedIn(true));
    }
    return;
  }

  if (isLoggedIn) {
    dispatch(logout());
  }
};
