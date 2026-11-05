import RefreshIcon from "@mui/icons-material/Refresh";
import PageHeader from "../../components/pageHeader/PageHeader";
import ErrorAlert from "../../components/errorAlert/ErrorAlert";
import labels from "../../assets/labels";
import ActivityList from "./components/ActivityList";
import DashboardStats from "./components/DashboardStats";
import useDashboardApi from "./hook/useDashboardApi";

const DashboardPage = () => {
  const {
    stats,
    activities,
    statsLoading,
    activitiesLoading,
    refreshing,
    markBusyId,
    errorMessage,
    refresh,
    markActivityRead,
  } = useDashboardApi();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={labels.dashboard}
        actions={[
          {
            id: "refresh",
            label: "Refresh",
            variant: "outlined",
            icon: <RefreshIcon fontSize="small" />,
            onClick: refresh,
            loading: refreshing,
          },
        ]}
      />

      <ErrorAlert message={errorMessage} />
      <DashboardStats stats={stats} loading={statsLoading} />
      <ActivityList
        activities={activities}
        loading={activitiesLoading}
        markBusyId={markBusyId}
        onMarkRead={markActivityRead}
      />
    </div>
  );
};

export default DashboardPage;
