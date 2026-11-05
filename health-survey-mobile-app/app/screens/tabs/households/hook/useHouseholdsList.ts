import { useMemo, useState } from 'react';
import { useGetHouseholdsQuery } from '../../../../services/HouseholdService';
import { navigateToApp } from '../../../../navigation/NavigationService';

const useHouseholdsList = () => {
  const [search, setSearch] = useState('');
  const trimmed = search.trim();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetHouseholdsQuery(trimmed ? { search: trimmed } : undefined);

  const households = useMemo(
    () => data?.data?.households ?? [],
    [data?.data?.households],
  );

  const openDetail = (householdId: string) => {
    navigateToApp('HouseholdDetail', { householdId });
  };

  const openAdd = () => {
    navigateToApp('AddHousehold');
  };

  return {
    search,
    setSearch,
    households,
    isLoading,
    isFetching,
    isError,
    refetch,
    openDetail,
    openAdd,
  };
};

export default useHouseholdsList;
