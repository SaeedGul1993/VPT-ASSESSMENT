import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { Household } from "../types/models";
import baseApi from "./api";
import { listTagOf } from "./apiTags";

type HouseholdListParams = {
  search?: string;
  areaId?: string;
};

export const HouseholdsService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHouseholds: builder.query<
      ApiSuccess<{
        households: Household[];
        cache?: { hit: boolean; ttlSeconds?: number };
      }>,
      HouseholdListParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params?.search) queryParams.search = params.search;
        if (params?.areaId) queryParams.areaId = params.areaId;

        return {
          url: apiEndpoints.households.list,
          method: apiMethod.get,
          ...(Object.keys(queryParams).length
            ? { params: queryParams }
            : {}),
        };
      },
      providesTags: listTagOf("Households"),
    }),
    getHouseholdById: builder.query<
      ApiSuccess<{ household: Household }>,
      string
    >({
      query: (id) => ({
        url: apiEndpoints.households.detail(id),
        method: apiMethod.get,
      }),
      providesTags: (_r, _e, id) => [{ type: "Households", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetHouseholdsQuery, useGetHouseholdByIdQuery } =
  HouseholdsService;
