import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTab from '../../components/bottomTab/BottomTab';
import type { TabStackParamList } from '../Types';
import { tabRoutes } from './TabRoutes';

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabStack = () => (
  <Tab.Navigator
    tabBar={props => <BottomTab {...props} />}
    screenOptions={{ headerShown: false }}
  >
    {tabRoutes.map(route => (
      <Tab.Screen
        key={route.name}
        name={route.name}
        component={route.component}
        options={{ title: route.label, tabBarLabel: route.label }}
      />
    ))}
  </Tab.Navigator>
);

export default TabStack;
