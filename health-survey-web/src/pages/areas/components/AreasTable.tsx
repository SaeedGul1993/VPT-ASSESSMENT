import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import EmptyState from "../../../components/emptyState/EmptyState";
import Panel from "../../../components/panel/Panel";
import type { Area } from "../../../types/models";
import { formatDate } from "../../../utils/formatDate";

type Props = {
  areas: Area[];
  loading?: boolean;
};

const AreasTable = ({ areas, loading }: Props) => (
  <Panel className="overflow-x-auto">
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Code</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState
                message="Loading…"
                className="py-2 text-sm text-on-surface-variant"
              />
            </TableCell>
          </TableRow>
        ) : areas.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState className="py-2 text-sm text-on-surface-variant" />
            </TableCell>
          </TableRow>
        ) : (
          areas.map((area) => (
            <TableRow key={area.id} hover>
              <TableCell>{area.name}</TableCell>
              <TableCell>
                <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs">
                  {area.code}
                </code>
              </TableCell>
              <TableCell>{area.description || "—"}</TableCell>
              <TableCell>{formatDate(area.createdAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </Panel>
);

export default memo(AreasTable);
