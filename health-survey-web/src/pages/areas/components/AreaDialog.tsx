import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import labels from "../../../assets/labels";
import useAreaForm from "../hook/useAreaForm";

type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    code: string;
    description?: string | null;
  }) => Promise<void> | void;
};

const AreaDialog = ({ open, loading, onClose, onSubmit }: Props) => {
  const { form, setName, setCode, setDescription, canSave, toPayload } =
    useAreaForm(open);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create area</DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2!">
        <Input label="Name" value={form.name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Code"
          value={form.code}
          onChange={(e) => setCode(e.target.value)}
          helperText="Uppercase letters, numbers, hyphens"
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={2}
        />
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

export default AreaDialog;
