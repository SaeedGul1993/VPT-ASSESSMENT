import { useGetAssessmentsByMemberQuery } from "../../../../services/AssessmentsService";

const useMemberAssessmentsApi = (memberId: string) => {
  const { data, isLoading } = useGetAssessmentsByMemberQuery(memberId);

  return {
    assessments: data?.data?.assessments ?? [],
    isLoading,
  };
};

export default useMemberAssessmentsApi;
