import { useMemo, useState } from "react";
import { useGetAreasQuery } from "../../../services/AreasService";
import { useGetHouseholdsQuery } from "../../../services/HouseholdsService";
import { getErrorMessage } from "../../../utils/apiError";

const useHouseholdsApi = () => {
  const [search, setSearch] = useState("");
  const [areaId, setAreaId] = useState("");
  const [applied, setApplied] = useState<{ search?: string; areaId?: string }>(
    {},
  );

  const queryArgs = useMemo(
    () => ({
      search: applied.search || undefined,
      areaId: applied.areaId || undefined,
    }),
    [applied],
  );

  const { data, isLoading, isError, error, isFetching } =
    useGetHouseholdsQuery(queryArgs);
  const { data: areasData } = useGetAreasQuery();

  const applyFilters = () => {
    setApplied({
      search: search.trim() || undefined,
      areaId: areaId || undefined,
    });
  };

  return {
    search,
    setSearch,
    areaId,
    setAreaId,
    applyFilters,
    households: data?.data?.households ?? [],
    areas: areasData?.data?.areas ?? [],
    cache: data?.data?.cache,
    isLoading,
    isFetching,
    errorMessage: isError ? getErrorMessage(error) : null,
  };
};

export default useHouseholdsApi;
