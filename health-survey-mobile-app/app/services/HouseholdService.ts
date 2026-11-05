import { apiEndpoints, apiMethod } from '../config/apiConfig';
import type { ApiSuccess } from '../types/api';
import type { CreateHouseholdBody, Household } from '../types/models';
import baseApi from './api';
import { LIST, listTagOf } from './apiTags';

export const HouseholdService = baseApi.injectEndpoints({
  endpoints: builder => ({
    getHouseholds: builder.query<
      ApiSuccess<{ households: Household[] }>,
      { search?: string } | void
    >({
      query: params => ({
        url: apiEndpoints.households.list,
        method: apiMethod.get,
        params: params?.search ? { search: params.search } : undefined,
      }),
      providesTags: result =>
        result?.data?.households
          ? [
              ...result.data.households.map(item => ({
                type: 'Households' as const,
                id: item.id,
              })),
              ...listTagOf('Households'),
            ]
          : [...listTagOf('Households')],
    }),
    getHousehold: builder.query<
      ApiSuccess<{ household: Household }>,
      string
    >({
      query: id => ({
        url: apiEndpoints.households.detail(id),
        method: apiMethod.get,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Households', id }],
    }),
    createHousehold: builder.mutation<
      ApiSuccess<{ household: Household }>,
      CreateHouseholdBody
    >({
      query: body => ({
        url: apiEndpoints.households.create,
        method: apiMethod.post,
        body,
      }),
      invalidatesTags: [...listTagOf('Households')],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetHouseholdsQuery,
  useGetHouseholdQuery,
  useCreateHouseholdMutation,
} = HouseholdService;
