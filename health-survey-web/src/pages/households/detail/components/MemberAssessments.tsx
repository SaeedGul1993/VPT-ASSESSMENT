import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EmptyState from "../../../../components/emptyState/EmptyState";
import StatusBadge from "../../../../components/statusBadge/StatusBadge";
import { formatDate } from "../../../../utils/formatDate";
import useMemberAssessmentsApi from "../hook/useMemberAssessmentsApi";

const formatBp = (systolic?: number | null, diastolic?: number | null) => {
  if (systolic == null && diastolic == null) return "—";
  return `${systolic ?? "—"}/${diastolic ?? "—"}`;
};

const MemberAssessments = ({ memberId }: { memberId: string }) => {
  const { assessments, isLoading } = useMemberAssessmentsApi(memberId);

  if (isLoading) {
    return (
      <EmptyState
        message="Loading assessments…"
        className="text-sm text-on-surface-variant"
      />
    );
  }

  if (assessments.length === 0) {
    return (
      <EmptyState
        message="No assessments recorded."
        className="text-sm text-on-surface-variant"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border-card">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Temp</TableCell>
            <TableCell>Fever</TableCell>
            <TableCell>Cough</TableCell>
            <TableCell>Breathing</TableCell>
            <TableCell>BP</TableCell>
            <TableCell>Urgent</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assessments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {formatDate(item.assessedAt || item.createdAt)}
              </TableCell>
              <TableCell>{item.temperature ?? "—"}</TableCell>
              <TableCell>{item.hasFever ? "Yes" : "No"}</TableCell>
              <TableCell>{item.hasCough ? "Yes" : "No"}</TableCell>
              <TableCell>
                {item.hasBreathingDifficulty ? "Yes" : "No"}
              </TableCell>
              <TableCell>
                {formatBp(item.systolicBp, item.diastolicBp)}
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={item.isUrgent ? "urgent" : "active"}
                  label={item.isUrgent ? "Urgent" : "Normal"}
                />
              </TableCell>
              <TableCell>{item.notes || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(MemberAssessments);
