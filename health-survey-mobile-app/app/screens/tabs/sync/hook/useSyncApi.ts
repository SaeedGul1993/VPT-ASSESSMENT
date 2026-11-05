import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import labels from '../../../../assets/labels';
import { usePullSyncMutation } from '../../../../services/SyncService';
import { getErrorMessage } from '../../../../utils/apiError';
import { showError, showSuccess } from '../../../../utils/toast';

const LAST_SYNC_KEY = 'health-survey.lastSyncAt';

const useSyncApi = () => {
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastCounts, setLastCounts] = useState<{
    households: number;
    members: number;
    assessments: number;
  } | null>(null);
  const [pullSync, { isLoading }] = usePullSyncMutation();

  useEffect(() => {
    AsyncStorage.getItem(LAST_SYNC_KEY).then(value => {
      if (value) setLastSyncedAt(value);
    });
  }, []);

  const syncNow = useCallback(async () => {
    try {
      const response = await pullSync(
        lastSyncedAt ? { since: lastSyncedAt } : undefined,
      ).unwrap();

      const serverTime = response.data.serverTime;
      const counts = response.data.counts;
      await AsyncStorage.setItem(LAST_SYNC_KEY, serverTime);
      setLastSyncedAt(serverTime);
      setLastCounts(counts);
      showSuccess(
        `${labels.syncSuccess}: ${counts.households} HH · ${counts.members} members · ${counts.assessments} assessments`,
      );
    } catch (error) {
      showError(getErrorMessage(error, labels.syncFailed));
    }
  }, [lastSyncedAt, pullSync]);

  return {
    lastSyncedAt,
    lastCounts,
    isSyncing: isLoading,
    syncNow,
  };
};

export default useSyncApi;
