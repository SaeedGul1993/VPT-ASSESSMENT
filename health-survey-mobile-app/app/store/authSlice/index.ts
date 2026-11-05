import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiContentTypes } from '../../constants/Common.constants';
import type { AuthUser } from '../../types/models';

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  contentType: string;
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoggedIn: false,
  contentType: apiContentTypes.applicationJson,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    resetToken: state => {
      state.token = null;
      state.refreshToken = null;
    },
    logout: () => initialState,
  },
});

export const {
  setUser,
  setToken,
  setRefreshToken,
  setIsLoggedIn,
  resetToken,
  logout,
} = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) =>
  Boolean(state.auth.isLoggedIn);
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;

export default authSlice.reducer;
