import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import PageHeader from "../../../components/pageHeader/PageHeader";
import { appRoutes } from "../../../constants/AppRoutes.constants";
import HouseholdSummary from "./components/HouseholdSummary";
import MembersList from "./components/MembersList";
import useHouseholdDetailApi from "./hook/useHouseholdDetailApi";

const HouseholdDetailPage = () => {
  const navigate = useNavigate();
  const {
    household,
    members,
    householdLoading,
    membersLoading,
    expandedMemberId,
    toggleMember,
    errorMessage,
  } = useHouseholdDetailApi();

  if (householdLoading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress size={40} />
      </div>
    );
  }

  if (errorMessage || !household) {
    return <ErrorAlert message={errorMessage || "Household not found"} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Household ${household.code}`}
        actions={[
          {
            id: "back",
            label: "Back to list",
            variant: "outlined",
            onClick: () => navigate(appRoutes.households),
          },
        ]}
      />

      <HouseholdSummary household={household} />
      <MembersList
        members={members}
        loading={membersLoading}
        expandedMemberId={expandedMemberId}
        onToggle={toggleMember}
      />
    </div>
  );
};

export default HouseholdDetailPage;
