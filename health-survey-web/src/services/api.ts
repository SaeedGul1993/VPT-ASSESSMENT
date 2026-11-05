import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { api as apiConfig, apiEndpoints, apiMethod } from "../config/apiConfig";
import { resetToken, setRefreshToken, setToken } from "../store/authSlice";
import { tagTypes } from "./apiTags";

type AuthSlice = {
  auth?: {
    token?: string | null;
    refreshToken?: string | null;
    contentType?: string;
  };
};

const selectAuth = (getState: () => unknown) =>
  (getState() as AuthSlice)?.auth;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiConfig.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const auth = selectAuth(getState);
    if (auth?.token) {
      headers.set("Authorization", `Bearer ${auth.token}`);
    }
    if (auth?.contentType) {
      headers.set("Content-Type", auth.contentType);
    }
    return headers;
  },
});

let refreshInFlight: Promise<"success" | "failed" | "unauthorized"> | null =
  null;

const doRefresh = async (api: BaseQueryApi, extraOptions: object) => {
  const refreshToken = selectAuth(api.getState)?.refreshToken;
  if (!refreshToken) return "unauthorized" as const;

  const refreshResult = await rawBaseQuery(
    {
      url: apiEndpoints.auth.refresh,
      method: apiMethod.post,
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (refreshResult.error) {
    api.dispatch(resetToken());
    return "unauthorized" as const;
  }

  const payload = refreshResult.data as {
    data?: { accessToken?: string; refreshToken?: string };
  };

  const accessToken = payload?.data?.accessToken;
  const nextRefresh = payload?.data?.refreshToken;
  if (!accessToken) return "failed" as const;

  api.dispatch(setToken(accessToken));
  if (nextRefresh) api.dispatch(setRefreshToken(nextRefresh));
  return "success" as const;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const isLogin = url === apiEndpoints.auth.login;

  if (result.error?.status === 401 && !isLogin) {
    if (!refreshInFlight) {
      refreshInFlight = doRefresh(api, extraOptions).finally(() => {
        refreshInFlight = null;
      });
    }

    const outcome = await refreshInFlight;
    if (outcome === "success") {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [...tagTypes],
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

export default baseApi;
