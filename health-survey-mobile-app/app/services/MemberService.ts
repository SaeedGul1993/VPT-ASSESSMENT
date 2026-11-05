import { apiEndpoints, apiMethod } from '../config/apiConfig';
import type { ApiSuccess } from '../types/api';
import type { CreateMemberBody, HouseholdMember } from '../types/models';
import baseApi from './api';
import { LIST, listTagOf } from './apiTags';

export const MemberService = baseApi.injectEndpoints({
  endpoints: builder => ({
    getMembers: builder.query<
      ApiSuccess<{ members: HouseholdMember[] }>,
      string
    >({
      query: householdId => ({
        url: apiEndpoints.members.byHousehold(householdId),
        method: apiMethod.get,
      }),
      providesTags: (result, _error, householdId) =>
        result?.data?.members
          ? [
              ...result.data.members.map(item => ({
                type: 'Members' as const,
                id: item.id,
              })),
              { type: 'Members' as const, id: `${LIST}-${householdId}` },
            ]
          : [{ type: 'Members' as const, id: `${LIST}-${householdId}` }],
    }),
    createMember: builder.mutation<
      ApiSuccess<{ member: HouseholdMember }>,
      { householdId: string; body: CreateMemberBody }
    >({
      query: ({ householdId, body }) => ({
        url: apiEndpoints.members.byHousehold(householdId),
        method: apiMethod.post,
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Members', id: `${LIST}-${arg.householdId}` },
        ...listTagOf('Households'),
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetMembersQuery, useCreateMemberMutation } = MemberService;
