import AddHouseholdScreen from '../../screens/app/addHousehold/AddHouseholdScreen';
import AddMemberScreen from '../../screens/app/addMember/AddMemberScreen';
import AssessmentFormScreen from '../../screens/app/assessmentForm/AssessmentFormScreen';
import HouseholdDetailScreen from '../../screens/app/householdDetail/HouseholdDetailScreen';

export const appRoutes = [
  {
    name: 'HouseholdDetail' as const,
    component: HouseholdDetailScreen,
  },
  {
    name: 'AddHousehold' as const,
    component: AddHouseholdScreen,
  },
  {
    name: 'AddMember' as const,
    component: AddMemberScreen,
  },
  {
    name: 'AssessmentForm' as const,
    component: AssessmentFormScreen,
  },
];
