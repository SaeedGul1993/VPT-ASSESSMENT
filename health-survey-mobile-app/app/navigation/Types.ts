import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type TabStackParamList = {
  Area: undefined;
  Households: undefined;
  Sync: undefined;
};

export type AppStackParamList = {
  HouseholdDetail: { householdId: string };
  AddHousehold: undefined;
  AddMember: { householdId: string };
  AssessmentForm: { memberId: string; householdId: string };
};

export type RootStackParamList = {
  AuthStack: undefined;
  TabStack: undefined;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};
