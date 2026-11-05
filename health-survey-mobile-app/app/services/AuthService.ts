import { apiEndpoints, apiMethod } from '../config/apiConfig';
import type { ApiSuccess, LoginResponse } from '../types/api';
import type { AuthUser } from '../types/models';
import baseApi from './api';

export const AuthService = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      ApiSuccess<LoginResponse>,
      { email: string; password: string }
    >({
      query: body => ({
        url: apiEndpoints.auth.login,
        method: apiMethod.post,
        body,
      }),
    }),
    logout: builder.mutation<ApiSuccess<{ message?: string }>, void>({
      query: () => ({
        url: apiEndpoints.auth.logout,
        method: apiMethod.post,
      }),
    }),
    me: builder.query<ApiSuccess<{ user: AuthUser }>, void>({
      query: () => ({
        url: apiEndpoints.auth.me,
        method: apiMethod.get,
      }),
      providesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = AuthService;
