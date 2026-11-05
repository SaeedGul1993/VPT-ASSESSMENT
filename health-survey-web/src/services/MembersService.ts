import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { HouseholdMember } from "../types/models";
import baseApi from "./api";
import { listTagOf } from "./apiTags";

export const MembersService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembersByHousehold: builder.query<
      ApiSuccess<{ members: HouseholdMember[] }>,
      string
    >({
      query: (householdId) => ({
        url: apiEndpoints.members.byHousehold(householdId),
        method: apiMethod.get,
      }),
      providesTags: listTagOf("Members"),
    }),
  }),
  overrideExisting: true,
});

export const { useGetMembersByHouseholdQuery } = MembersService;
