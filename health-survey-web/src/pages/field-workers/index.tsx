import AddIcon from "@mui/icons-material/Add";
import ErrorAlert from "../../components/errorAlert/ErrorAlert";
import PageHeader from "../../components/pageHeader/PageHeader";
import labels from "../../assets/labels";
import FieldWorkerDialog from "./components/FieldWorkerDialog";
import FieldWorkersTable from "./components/FieldWorkersTable";
import useFieldWorkersApi from "./hook/useFieldWorkersApi";

const FieldWorkersPage = () => {
  const {
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
    errorMessage,
  } = useFieldWorkersApi();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={labels.fieldWorkers}
        actions={[
          {
            id: "create",
            label: "Add worker",
            icon: <AddIcon fontSize="small" />,
            onClick: openDialog,
          },
        ]}
      />

      <ErrorAlert message={errorMessage} />

      <FieldWorkersTable
        workers={workers}
        areaOptions={areaOptions}
        loading={isLoading}
        statusBusyId={statusBusyId}
        assignBusyId={assignBusyId}
        onAssignArea={assignWorkerArea}
        onToggleStatus={toggleStatus}
      />

      <FieldWorkerDialog
        open={dialogOpen}
        areas={areas}
        loading={creating}
        onClose={closeDialog}
        onSubmit={create}
      />
    </div>
  );
};

export default FieldWorkersPage;
