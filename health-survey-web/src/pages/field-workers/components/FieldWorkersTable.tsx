import { memo } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "../../../components/button/Button";
import EmptyState from "../../../components/emptyState/EmptyState";
import Panel from "../../../components/panel/Panel";
import StatusBadge from "../../../components/statusBadge/StatusBadge";
import labels from "../../../assets/labels";
import type { Area, FieldWorker } from "../../../types/models";

type AreaOption = Pick<Area, "id" | "name" | "code">;

type Props = {
  workers: FieldWorker[];
  areaOptions: AreaOption[];
  loading?: boolean;
  statusBusyId?: string | null;
  assignBusyId?: string | null;
  onAssignArea: (id: string, areaId: string) => Promise<void> | void;
  onToggleStatus: (id: string, nextActive: boolean) => Promise<void> | void;
};

const FieldWorkersTable = ({
  workers,
  areaOptions,
  loading,
  statusBusyId,
  assignBusyId,
  onAssignArea,
  onToggleStatus,
}: Props) => (
  <Panel className="overflow-x-auto">
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Area</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                message="Loading…"
                className="py-2 text-sm text-on-surface-variant"
              />
            </TableCell>
          </TableRow>
        ) : workers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState className="py-2 text-sm text-on-surface-variant" />
            </TableCell>
          </TableRow>
        ) : (
          workers.map((worker) => {
            const statusLoading = statusBusyId === worker.id;
            const assignLoading = assignBusyId === worker.id;

            return (
              <TableRow key={worker.id} hover>
                <TableCell>{worker.name}</TableCell>
                <TableCell>{worker.email}</TableCell>
                <TableCell>
                  <StatusBadge status={worker.isActive} />
                </TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <FormControl size="small" fullWidth>
                    <InputLabel id={`area-${worker.id}`}>Area</InputLabel>
                    <Select
                      labelId={`area-${worker.id}`}
                      label="Area"
                      value={worker.areaId ?? ""}
                      disabled={assignLoading}
                      onChange={(e) =>
                        onAssignArea(worker.id, String(e.target.value))
                      }
                    >
                      {areaOptions.map((area) => (
                        <MenuItem key={area.id || "none"} value={area.id}>
                          {area.id
                            ? `${area.name} (${area.code})`
                            : labels.unassigned}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    color={worker.isActive ? "error" : "primary"}
                    loading={statusLoading}
                    disabled={statusLoading}
                    onClick={() =>
                      onToggleStatus(worker.id, !worker.isActive)
                    }
                    sx={{ textTransform: "none" }}
                  >
                    {worker.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  </Panel>
);

export default memo(FieldWorkersTable);
