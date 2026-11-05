import { useState } from "react";
import {
  useCreateAreaMutation,
  useGetAreasQuery,
} from "../../../services/AreasService";
import { getErrorMessage } from "../../../utils/apiError";
import { showError, showSuccess } from "../../../utils/toast";

const useAreasApi = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, isError, error } = useGetAreasQuery();
  const [createArea, { isLoading: creating }] = useCreateAreaMutation();

  const areas = data?.data?.areas ?? [];

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const create = async (values: {
    name: string;
    code: string;
    description?: string | null;
  }) => {
    try {
      const response = await createArea(values).unwrap();
      showSuccess(response.message);
      closeDialog();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  return {
    areas,
    isLoading,
    creating,
    dialogOpen,
    openDialog,
    closeDialog,
    create,
    errorMessage: isError ? getErrorMessage(error) : null,
  };
};

export default useAreasApi;
