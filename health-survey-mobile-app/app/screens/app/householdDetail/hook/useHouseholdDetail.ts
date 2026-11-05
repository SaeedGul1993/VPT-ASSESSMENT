import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '../../../../navigation/Types';
import { navigateToApp } from '../../../../navigation/NavigationService';
import { useGetHouseholdQuery } from '../../../../services/HouseholdService';
import { useGetMembersQuery } from '../../../../services/MemberService';

type Route = RouteProp<AppStackParamList, 'HouseholdDetail'>;

const useHouseholdDetail = () => {
  const route = useRoute<Route>();
  const householdId = route.params.householdId;

  const householdQuery = useGetHouseholdQuery(householdId, {
    skip: !householdId,
  });
  const membersQuery = useGetMembersQuery(householdId, {
    skip: !householdId,
  });

  const household = householdQuery.data?.data?.household;
  const members = membersQuery.data?.data?.members ?? [];

  const openAddMember = () => {
    navigateToApp('AddMember', { householdId });
  };

  const openAssessment = (memberId: string) => {
    navigateToApp('AssessmentForm', { memberId, householdId });
  };

  const refresh = () => {
    householdQuery.refetch();
    membersQuery.refetch();
  };

  return {
    householdId,
    household,
    members,
    isLoading: householdQuery.isLoading || membersQuery.isLoading,
    isFetching: householdQuery.isFetching || membersQuery.isFetching,
    isError: householdQuery.isError || membersQuery.isError,
    refresh,
    openAddMember,
    openAssessment,
  };
};

export default useHouseholdDetail;
