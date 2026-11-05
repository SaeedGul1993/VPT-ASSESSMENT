import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { ActivityLog } from "../types/models";
import baseApi from "./api";
import { LIST, listTagOf } from "./apiTags";

export const ActivitiesService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<
      ApiSuccess<{ activities: ActivityLog[] }>,
      { unreadOnly?: boolean } | void
    >({
      query: (params) => ({
        url: apiEndpoints.activities.list,
        method: apiMethod.get,
        params: params?.unreadOnly ? { unreadOnly: "true" } : undefined,
      }),
      providesTags: listTagOf("Activities"),
    }),
    markActivityRead: builder.mutation<
      ApiSuccess<{ activity: ActivityLog }>,
      string
    >({
      query: (id) => ({
        url: apiEndpoints.activities.markRead(id),
        method: apiMethod.patch,
      }),
      invalidatesTags: [
        { type: "Activities", id: LIST },
        { type: "Dashboard", id: LIST },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetActivitiesQuery, useMarkActivityReadMutation } =
  ActivitiesService;
