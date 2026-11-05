import { memo } from "react";
import StatCard from "../../../components/statCard/StatCard";
import type { DashboardStats as Stats } from "../../../types/models";
import { formatDate } from "../../../utils/formatDate";

type Props = {
  stats?: Stats;
  loading?: boolean;
};

const DashboardStats = ({ stats, loading }: Props) => (
  <>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Households"
        value={stats?.totalHouseholds ?? (loading ? "…" : 0)}
      />
      <StatCard
        label="Field Workers"
        value={stats?.totalFieldWorkers ?? (loading ? "…" : 0)}
        hint={`${stats?.activeFieldWorkers ?? 0} active`}
      />
      <StatCard
        label="Assessments"
        value={stats?.totalAssessments ?? (loading ? "…" : 0)}
        hint={`${stats?.urgentAssessments ?? 0} urgent`}
      />
      <StatCard
        label="Members"
        value={stats?.totalMembers ?? (loading ? "…" : 0)}
        hint={`${stats?.unreadActivities ?? 0} unread alerts`}
      />
    </div>

    {stats?.cache ? (
      <p className="text-xs text-on-surface-variant">
        Cache {stats.cache.hit ? "hit" : "miss"}
        {stats.generatedAt
          ? ` · generated ${formatDate(stats.generatedAt)}`
          : ""}
      </p>
    ) : null}
  </>
);

export default memo(DashboardStats);
