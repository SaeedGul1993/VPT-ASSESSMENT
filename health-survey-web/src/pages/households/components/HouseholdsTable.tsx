import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "../../../components/button/Button";
import EmptyState from "../../../components/emptyState/EmptyState";
import Panel from "../../../components/panel/Panel";
import labels from "../../../assets/labels";
import { appRoutes } from "../../../constants/AppRoutes.constants";
import type { Household } from "../../../types/models";
import { formatDate } from "../../../utils/formatDate";

type Props = {
  households: Household[];
  loading?: boolean;
};

const HouseholdsTable = ({ households, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <Panel className="overflow-x-auto">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Field worker</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState
                  message="Loading…"
                  className="py-2 text-sm text-on-surface-variant"
                />
              </TableCell>
            </TableRow>
          ) : households.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState className="py-2 text-sm text-on-surface-variant" />
              </TableCell>
            </TableRow>
          ) : (
            households.map((household) => (
              <TableRow key={household.id} hover>
                <TableCell>{household.code}</TableCell>
                <TableCell>{household.address}</TableCell>
                <TableCell>
                  {household.area?.name || household.areaId}
                </TableCell>
                <TableCell>
                  {household.fieldWorker?.name || household.fieldWorkerId}
                </TableCell>
                <TableCell>{formatDate(household.updatedAt)}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                    onClick={() =>
                      navigate(
                        appRoutes.householdDetail.replace(":id", household.id),
                      )
                    }
                  >
                    {labels.view}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Panel>
  );
};

export default memo(HouseholdsTable);
