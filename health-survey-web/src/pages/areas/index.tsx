import AddIcon from "@mui/icons-material/Add";
import ErrorAlert from "../../components/errorAlert/ErrorAlert";
import PageHeader from "../../components/pageHeader/PageHeader";
import labels from "../../assets/labels";
import AreaDialog from "./components/AreaDialog";
import AreasTable from "./components/AreasTable";
import useAreasApi from "./hook/useAreasApi";

const AreasPage = () => {
  const {
    areas,
    isLoading,
    creating,
    dialogOpen,
    openDialog,
    closeDialog,
    create,
    errorMessage,
  } = useAreasApi();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={labels.areas}
        actions={[
          {
            id: "create",
            label: "Add area",
            icon: <AddIcon fontSize="small" />,
            onClick: openDialog,
          },
        ]}
      />

      <ErrorAlert message={errorMessage} />
      <AreasTable areas={areas} loading={isLoading} />
      <AreaDialog
        open={dialogOpen}
        loading={creating}
        onClose={closeDialog}
        onSubmit={create}
      />
    </div>
  );
};

export default AreasPage;
