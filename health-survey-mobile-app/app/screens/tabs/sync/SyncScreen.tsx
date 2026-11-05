import { Text, View } from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import Screen from '../../../components/screen/Screen';
import useSyncApi from './hook/useSyncApi';
import styles from './SyncScreen.style';

const formatDate = (value: string | null) => {
  if (!value) return labels.neverSynced;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const SyncScreen = () => {
  const { lastSyncedAt, lastCounts, isSyncing, syncNow } = useSyncApi();

  return (
    <Screen>
      <Header title={labels.sync} subtitle={labels.syncSubtitle} />

      <View style={styles.panel}>
        <Text style={styles.label}>{labels.lastSynced}</Text>
        <Text style={styles.value}>{formatDate(lastSyncedAt)}</Text>
      </View>

      {lastCounts ? (
        <View style={styles.counts}>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{lastCounts.households}</Text>
            <Text style={styles.countLabel}>Households</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{lastCounts.members}</Text>
            <Text style={styles.countLabel}>Members</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={styles.countValue}>{lastCounts.assessments}</Text>
            <Text style={styles.countLabel}>Assessments</Text>
          </View>
        </View>
      ) : null}

      <Button
        title={labels.pullUpdates}
        loading={isSyncing}
        onPress={syncNow}
        style={styles.action}
      />
    </Screen>
  );
};

export default SyncScreen;
