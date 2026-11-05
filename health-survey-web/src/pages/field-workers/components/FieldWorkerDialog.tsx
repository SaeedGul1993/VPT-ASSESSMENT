import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import labels from "../../../assets/labels";
import type { Area } from "../../../types/models";
import useFieldWorkerForm from "../hook/useFieldWorkerForm";

type Props = {
  open: boolean;
  areas: Area[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
    areaId?: string | null;
  }) => Promise<void> | void;
};

const FieldWorkerDialog = ({
  open,
  areas,
  loading,
  onClose,
  onSubmit,
}: Props) => {
  const { form, setField, canSave, toPayload } = useFieldWorkerForm(open);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create field worker</DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2!">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setField("name")(e.target.value)}
        />
        <Input
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setField("email")(e.target.value)}
        />
        <Input
          type="password"
          label="Temporary password"
          value={form.password}
          onChange={(e) => setField("password")(e.target.value)}
          helperText="Minimum 6 characters"
        />
        <FormControl fullWidth>
          <InputLabel id="worker-area-label">Area (optional)</InputLabel>
          <Select
            labelId="worker-area-label"
            label="Area (optional)"
            value={form.areaId}
            onChange={(e) => setField("areaId")(String(e.target.value))}
          >
            <MenuItem value="">
              <em>{labels.unassigned}</em>
            </MenuItem>
            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                {area.name} ({area.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="text" onClick={onClose} sx={{ textTransform: "none" }}>
          {labels.cancel}
        </Button>
        <Button
          loading={loading}
          disabled={!canSave}
          sx={{ textTransform: "none" }}
          onClick={() => onSubmit(toPayload())}
        >
          {labels.create}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldWorkerDialog;
