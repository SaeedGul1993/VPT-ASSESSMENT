import { useState } from "react";
import {
  useGetActivitiesQuery,
  useMarkActivityReadMutation,
} from "../../../services/ActivitiesService";
import { useGetDashboardStatsQuery } from "../../../services/DashboardService";
import { getErrorMessage } from "../../../utils/apiError";
import { showError, showSuccess } from "../../../utils/toast";

const useDashboardApi = () => {
  const [markBusyId, setMarkBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading: statsLoading,
    isError,
    error,
    refetch,
  } = useGetDashboardStatsQuery();

  const { data: activityData, isLoading: activitiesLoading } =
    useGetActivitiesQuery();

  const [markRead] = useMarkActivityReadMutation();

  const stats = data?.data?.stats;
  const activities = activityData?.data?.activities ?? [];

  const refresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const markActivityRead = async (id: string) => {
    setMarkBusyId(id);
    try {
      const response = await markRead(id).unwrap();
      showSuccess(response.message);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setMarkBusyId(null);
    }
  };

  return {
    stats,
    activities,
    statsLoading,
    activitiesLoading,
    refreshing,
    markBusyId,
    isError,
    errorMessage: isError
      ? getErrorMessage(error, "Failed to load dashboard stats")
      : null,
    refresh,
    markActivityRead,
  };
};

export default useDashboardApi;
