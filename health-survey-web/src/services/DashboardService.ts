import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { DashboardStats } from "../types/models";
import baseApi from "./api";
import { listTagOf } from "./apiTags";

export const DashboardService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      ApiSuccess<{ stats: DashboardStats }>,
      void
    >({
      query: () => ({
        url: apiEndpoints.dashboard.stats,
        method: apiMethod.get,
      }),
      providesTags: listTagOf("Dashboard"),
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardStatsQuery } = DashboardService;
