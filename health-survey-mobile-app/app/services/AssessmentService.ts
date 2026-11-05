import { apiEndpoints, apiMethod } from '../config/apiConfig';
import type { ApiSuccess } from '../types/api';
import type {
  CreateAssessmentBody,
  HealthAssessment,
} from '../types/models';
import baseApi from './api';
import { LIST } from './apiTags';

export const AssessmentService = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAssessments: builder.query<
      ApiSuccess<{ assessments: HealthAssessment[] }>,
      string
    >({
      query: memberId => ({
        url: apiEndpoints.assessments.byMember(memberId),
        method: apiMethod.get,
      }),
      providesTags: (result, _error, memberId) =>
        result?.data?.assessments
          ? [
              ...result.data.assessments.map(item => ({
                type: 'Assessments' as const,
                id: item.id,
              })),
              { type: 'Assessments' as const, id: `${LIST}-${memberId}` },
            ]
          : [{ type: 'Assessments' as const, id: `${LIST}-${memberId}` }],
    }),
    createAssessment: builder.mutation<
      ApiSuccess<{ assessment: HealthAssessment }>,
      { memberId: string; body: CreateAssessmentBody }
    >({
      query: ({ memberId, body }) => ({
        url: apiEndpoints.assessments.byMember(memberId),
        method: apiMethod.post,
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Assessments', id: `${LIST}-${arg.memberId}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAssessmentsQuery, useCreateAssessmentMutation } =
  AssessmentService;
