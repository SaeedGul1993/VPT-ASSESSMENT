import { useMemo, useState } from "react";
import labels from "../../../assets/labels";
import { useGetAreasQuery } from "../../../services/AreasService";
import {
  useAssignFieldWorkerAreaMutation,
  useCreateFieldWorkerMutation,
  useGetFieldWorkersQuery,
  useUpdateFieldWorkerStatusMutation,
} from "../../../services/FieldWorkersService";
import { getErrorMessage } from "../../../utils/apiError";
import { showError, showSuccess } from "../../../utils/toast";

const useFieldWorkersApi = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);
  const [assignBusyId, setAssignBusyId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetFieldWorkersQuery();
  const { data: areasData } = useGetAreasQuery();
  const [createWorker, { isLoading: creating }] = useCreateFieldWorkerMutation();
  const [updateStatus] = useUpdateFieldWorkerStatusMutation();
  const [assignArea] = useAssignFieldWorkerAreaMutation();

  const workers = data?.data?.workers ?? [];
  const areas = areasData?.data?.areas ?? [];

  const areaOptions = useMemo(
    () => [{ id: "", name: labels.unassigned, code: "" }, ...areas],
    [areas],
  );

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const create = async (values: {
    name: string;
    email: string;
    password: string;
    areaId?: string | null;
  }) => {
    try {
      const response = await createWorker(values).unwrap();
      showSuccess(response.message);
      closeDialog();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    setStatusBusyId(id);
    try {
      const response = await updateStatus({ id, isActive }).unwrap();
      showSuccess(response.message);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setStatusBusyId(null);
    }
  };

  const assignWorkerArea = async (id: string, areaId: string) => {
    setAssignBusyId(id);
    try {
      const response = await assignArea({
        id,
        areaId: areaId || null,
      }).unwrap();
      showSuccess(response.message);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setAssignBusyId(null);
    }
  };

  return {
    workers,
    areas,
    areaOptions,
    isLoading,
    creating,
    statusBusyId,
    assignBusyId,
    dialogOpen,
    openDialog,
    closeDialog,
    create,
    toggleStatus,
    assignWorkerArea,
    errorMessage: isError ? getErrorMessage(error) : null,
  };
};

export default useFieldWorkersApi;
