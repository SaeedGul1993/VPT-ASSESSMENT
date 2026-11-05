import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { HealthAssessment } from "../types/models";
import baseApi from "./api";

export const AssessmentsService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssessmentsByMember: builder.query<
      ApiSuccess<{ assessments: HealthAssessment[] }>,
      string
    >({
      query: (memberId) => ({
        url: apiEndpoints.assessments.byMember(memberId),
        method: apiMethod.get,
      }),
      providesTags: (_r, _e, memberId) => [
        { type: "Assessments", id: memberId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAssessmentsByMemberQuery } = AssessmentsService;
