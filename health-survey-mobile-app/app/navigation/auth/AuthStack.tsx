import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../Types';
import { authRoutes } from './AuthRoutes';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, gestureEnabled: false }}
    initialRouteName={authRoutes[0].name}
  >
    {authRoutes.map(route => (
      <Stack.Screen
        key={route.name}
        name={route.name}
        component={route.component}
        options={{ gestureEnabled: !route.disableBack }}
      />
    ))}
  </Stack.Navigator>
);

export default AuthStack;
