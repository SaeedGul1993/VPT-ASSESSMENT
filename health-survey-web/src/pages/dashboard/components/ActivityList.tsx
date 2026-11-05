import { memo } from "react";
import Button from "../../../components/button/Button";
import EmptyState from "../../../components/emptyState/EmptyState";
import Panel from "../../../components/panel/Panel";
import StatusBadge from "../../../components/statusBadge/StatusBadge";
import labels from "../../../assets/labels";
import type { ActivityLog } from "../../../types/models";
import { formatDate } from "../../../utils/formatDate";

type Props = {
  activities: ActivityLog[];
  loading?: boolean;
  markBusyId?: string | null;
  onMarkRead: (id: string) => Promise<void> | void;
};

const ActivityList = ({
  activities,
  loading,
  markBusyId,
  onMarkRead,
}: Props) => (
  <Panel>
    <div className="border-b border-border-card px-4 py-3">
      <p className="text-sm font-semibold text-on-surface">Recent activity</p>
    </div>
    <div className="divide-y divide-border-card">
      {loading ? (
        <EmptyState message="Loading…" />
      ) : activities.length === 0 ? (
        <EmptyState />
      ) : (
        activities.slice(0, 8).map((item) => {
          const isBusy = markBusyId === item.id;

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-on-surface">
                    {item.assessment?.member?.name ||
                      item.type.replaceAll("_", " ")}
                  </p>
                  {!item.readAt ? (
                    <StatusBadge status="unread" label="Unread" />
                  ) : null}
                  {item.type ? (
                    <StatusBadge status="pending" label={item.type} />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {item.message}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {formatDate(item.createdAt)}
                  {item.assessment?.member?.household?.code
                    ? ` · ${item.assessment.member.household.code}`
                    : ""}
                </p>
              </div>
              {!item.readAt ? (
                <Button
                  size="small"
                  variant="outlined"
                  loading={isBusy}
                  disabled={isBusy}
                  onClick={() => onMarkRead(item.id)}
                  sx={{ textTransform: "none", whiteSpace: "nowrap" }}
                >
                  {labels.markRead}
                </Button>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  </Panel>
);

export default memo(ActivityList);
