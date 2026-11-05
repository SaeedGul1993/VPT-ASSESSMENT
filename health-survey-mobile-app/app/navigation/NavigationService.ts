import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import type { AppStackParamList, RootStackParamList } from './Types';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

export const resetToAuth = () => {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    }),
  );
};

export const resetToTabs = () => {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'TabStack' }],
    }),
  );
};

export const navigateToApp = <T extends keyof AppStackParamList>(
  screen: T,
  ...args: undefined extends AppStackParamList[T]
    ? [params?: AppStackParamList[T]]
    : [params: AppStackParamList[T]]
) => {
  if (!navigationRef.isReady()) return;
  navigationRef.navigate('AppStack', {
    screen,
    params: args[0],
  } as never);
};
