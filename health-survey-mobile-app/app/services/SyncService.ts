import { apiEndpoints, apiMethod } from '../config/apiConfig';
import type { ApiSuccess } from '../types/api';
import baseApi from './api';
import { listTagOf } from './apiTags';

export type SyncPullData = {
  serverTime: string;
  since: string | null;
  counts: {
    households: number;
    members: number;
    assessments: number;
  };
};

export const SyncService = baseApi.injectEndpoints({
  endpoints: builder => ({
    pullSync: builder.mutation<
      ApiSuccess<SyncPullData>,
      { since?: string } | void
    >({
      query: params => ({
        url: apiEndpoints.sync.pull,
        method: apiMethod.get,
        params: params?.since ? { since: params.since } : undefined,
      }),
      invalidatesTags: [
        ...listTagOf('Households'),
        ...listTagOf('Members'),
        ...listTagOf('Assessments'),
      ],
    }),
  }),
  overrideExisting: true,
});

export const { usePullSyncMutation } = SyncService;
