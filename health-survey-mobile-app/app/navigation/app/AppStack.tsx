import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../Types';
import { appRoutes } from './AppRoutes';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="HouseholdDetail"
  >
    {appRoutes.map(route => (
      <Stack.Screen
        key={route.name}
        name={route.name}
        component={route.component}
      />
    ))}
  </Stack.Navigator>
);

export default AppStack;
