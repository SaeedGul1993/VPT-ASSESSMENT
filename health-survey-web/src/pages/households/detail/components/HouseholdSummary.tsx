import { memo } from "react";
import InfoField from "../../../../components/infoField/InfoField";
import Panel from "../../../../components/panel/Panel";
import type { Household } from "../../../../types/models";
import { formatDate } from "../../../../utils/formatDate";

type Props = {
  household: Household;
};

const HouseholdSummary = ({ household }: Props) => (
  <Panel className="grid gap-3 p-4 sm:grid-cols-2">
    <InfoField label="Address" value={household.address} />
    <InfoField label="Area" value={household.area?.name || household.areaId} />
    <InfoField
      label="Field worker"
      value={household.fieldWorker?.name || household.fieldWorkerId}
    />
    <InfoField label="Updated" value={formatDate(household.updatedAt)} />
  </Panel>
);

export default memo(HouseholdSummary);
