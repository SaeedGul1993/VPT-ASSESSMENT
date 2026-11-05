import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../store/authSlice';
import AppStack from './app/AppStack';
import AuthStack from './auth/AuthStack';
import { navigationRef } from './NavigationService';
import TabStack from './tab/TabStack';
import type { RootStackParamList } from './Types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <RootStack.Navigator
      key={isLoggedIn ? 'authed' : 'guest'}
      initialRouteName={isLoggedIn ? 'TabStack' : 'AuthStack'}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      {isLoggedIn ? (
        <>
          <RootStack.Screen
            name="TabStack"
            component={TabStack}
            options={{ gestureEnabled: false }}
          />
          <RootStack.Screen name="AppStack" component={AppStack} />
        </>
      ) : (
        <RootStack.Screen name="AuthStack" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
};

const Routes = () => (
  <NavigationContainer ref={navigationRef}>
    <RootNavigator />
  </NavigationContainer>
);

export default Routes;
