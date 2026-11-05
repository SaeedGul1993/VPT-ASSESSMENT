import ErrorAlert from "../../components/errorAlert/ErrorAlert";
import PageHeader from "../../components/pageHeader/PageHeader";
import labels from "../../assets/labels";
import HouseholdFilters from "./components/HouseholdFilters";
import HouseholdsTable from "./components/HouseholdsTable";
import useHouseholdsApi from "./hook/useHouseholdsApi";

const HouseholdsPage = () => {
  const {
    search,
    setSearch,
    areaId,
    setAreaId,
    applyFilters,
    households,
    areas,
    cache,
    isLoading,
    isFetching,
    errorMessage,
  } = useHouseholdsApi();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={labels.households} />

      <HouseholdFilters
        search={search}
        areaId={areaId}
        areas={areas}
        loading={isFetching}
        onSearchChange={setSearch}
        onAreaChange={setAreaId}
        onApply={applyFilters}
      />

      {cache ? (
        <p className="text-xs text-on-surface-variant">
          List cache {cache.hit ? "hit" : "miss"}
        </p>
      ) : null}

      <ErrorAlert message={errorMessage} />
      <HouseholdsTable households={households} loading={isLoading} />
    </div>
  );
};

export default HouseholdsPage;
