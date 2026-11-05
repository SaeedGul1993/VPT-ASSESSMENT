import { memo } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import Panel from "../../../components/panel/Panel";
import labels from "../../../assets/labels";
import type { Area } from "../../../types/models";

type Props = {
  search: string;
  areaId: string;
  areas: Area[];
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onApply: () => void;
};

const HouseholdFilters = ({
  search,
  areaId,
  areas,
  loading,
  onSearchChange,
  onAreaChange,
  onApply,
}: Props) => (
  <Panel className="grid gap-3 p-3 sm:grid-cols-[1fr_220px_auto]">
    <Input
      label={labels.search}
      placeholder="Code or address"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <FormControl fullWidth>
      <InputLabel id="household-area-filter">Area</InputLabel>
      <Select
        labelId="household-area-filter"
        label="Area"
        value={areaId}
        onChange={(e) => onAreaChange(String(e.target.value))}
      >
        <MenuItem value="">All areas</MenuItem>
        {areas.map((area) => (
          <MenuItem key={area.id} value={area.id}>
            {area.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Button
      loading={loading}
      sx={{ textTransform: "none", height: 48 }}
      onClick={onApply}
    >
      Apply
    </Button>
  </Panel>
);

export default memo(HouseholdFilters);
