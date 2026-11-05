import labels from '../../assets/labels';
import AreaScreen from '../../screens/tabs/area/AreaScreen';
import HouseholdsScreen from '../../screens/tabs/households/HouseholdsScreen';
import SyncScreen from '../../screens/tabs/sync/SyncScreen';

export const tabRoutes = [
  {
    name: 'Area' as const,
    component: AreaScreen,
    label: labels.area,
  },
  {
    name: 'Households' as const,
    component: HouseholdsScreen,
    label: labels.households,
  },
  {
    name: 'Sync' as const,
    component: SyncScreen,
    label: labels.sync,
  },
];
