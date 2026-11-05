import { ActivityIndicator, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import Screen from '../../../components/screen/Screen';
import useLogout from '../../../hooks/useLogout';
import { navigateToApp } from '../../../navigation/NavigationService';
import { useGetHouseholdsQuery } from '../../../services/HouseholdService';
import { selectUser } from '../../../store/authSlice';
import { colors } from '../../../theme/colors';
import styles from './AreaScreen.style';

const AreaScreen = () => {
  const user = useSelector(selectUser);
  const { signOut, isLoggingOut } = useLogout();
  const { data, isLoading, isError, refetch, isFetching } =
    useGetHouseholdsQuery();

  const households = data?.data?.households ?? [];
  const areaName =
    user?.area?.name || households[0]?.area?.name || null;
  const areaCode =
    user?.area?.code || households[0]?.area?.code || null;
  const hasArea = Boolean(user?.areaId || areaName);

  return (
    <Screen>
      <Header
        title={labels.area}
        subtitle={user?.name ? `Hi, ${user.name}` : undefined}
      />

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{labels.worker}</Text>
        <Text style={styles.panelValue}>{user?.name || '—'}</Text>
        <Text style={styles.panelMeta}>{user?.email || '—'}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{labels.assignedArea}</Text>
        {isLoading && !hasArea ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <>
            <Text style={styles.panelValue}>
              {areaName || (hasArea ? 'Assigned' : labels.notAssigned)}
            </Text>
            <Text style={styles.panelMeta}>
              {areaCode
                ? `Code · ${areaCode}`
                : hasArea
                  ? 'Area linked to this worker'
                  : labels.notAssigned}
            </Text>
          </>
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>{labels.householdsCount}</Text>
        <Text style={styles.stat}>{isLoading ? '—' : households.length}</Text>
        {isError ? (
          <Button
            title={labels.retry}
            outline
            loading={isFetching}
            onPress={() => refetch()}
            style={styles.retry}
          />
        ) : null}
      </View>

      <Button
        title={labels.addHousehold}
        onPress={() => navigateToApp('AddHousehold')}
        style={styles.primaryAction}
      />
      <Button
        title={labels.logout}
        outline
        loading={isLoggingOut}
        onPress={signOut}
        style={styles.logout}
      />
    </Screen>
  );
};

export default AreaScreen;
