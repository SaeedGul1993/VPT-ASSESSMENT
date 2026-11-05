import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetHouseholdByIdQuery } from "../../../../services/HouseholdsService";
import { useGetMembersByHouseholdQuery } from "../../../../services/MembersService";
import { getErrorMessage } from "../../../../utils/apiError";

const useHouseholdDetailApi = () => {
  const { id = "" } = useParams();
  const [expandedMemberId, setExpandedMemberId] = useState<string | false>(
    false,
  );

  const {
    data: householdData,
    isLoading: householdLoading,
    isError,
    error,
  } = useGetHouseholdByIdQuery(id, { skip: !id });

  const { data: membersData, isLoading: membersLoading } =
    useGetMembersByHouseholdQuery(id, { skip: !id });

  const toggleMember = (memberId: string, open: boolean) => {
    setExpandedMemberId(open ? memberId : false);
  };

  return {
    householdId: id,
    household: householdData?.data?.household,
    members: membersData?.data?.members ?? [],
    householdLoading,
    membersLoading,
    expandedMemberId,
    toggleMember,
    errorMessage:
      isError || (!householdLoading && !householdData?.data?.household)
        ? getErrorMessage(error, "Household not found")
        : null,
  };
};

export default useHouseholdDetailApi;
