import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmptyState from "../../../../components/emptyState/EmptyState";
import Panel from "../../../../components/panel/Panel";
import labels from "../../../../assets/labels";
import { appRoutes } from "../../../../constants/AppRoutes.constants";
import type { HouseholdMember } from "../../../../types/models";
import MemberAssessments from "./MemberAssessments";

type Props = {
  members: HouseholdMember[];
  loading?: boolean;
  expandedMemberId: string | false;
  onToggle: (memberId: string, open: boolean) => void;
};

const MembersList = ({
  members,
  loading,
  expandedMemberId,
  onToggle,
}: Props) => (
  <Panel padded>
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-sm font-semibold text-on-surface">{labels.members}</p>
      <Link
        to={appRoutes.households}
        className="text-xs text-primary hover:underline"
      >
        All households
      </Link>
    </div>

    {loading ? (
      <EmptyState message="Loading members…" className="text-sm text-on-surface-variant" />
    ) : members.length === 0 ? (
      <EmptyState className="text-sm text-on-surface-variant" />
    ) : (
      members.map((member) => (
        <Accordion
          key={member.id}
          disableGutters
          expanded={expandedMemberId === member.id}
          onChange={(_, isExpanded) => onToggle(member.id, isExpanded)}
          sx={{
            mb: 1,
            border: "1px solid var(--pd-border-card)",
            borderRadius: "8px !important",
            "&:before": { display: "none" },
            boxShadow: "none",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-left">
              <span className="text-sm font-medium text-on-surface">
                {member.name}
              </span>
              <span className="text-xs text-on-surface-variant">
                {member.age} yrs · {member.gender} · {member.relationship}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-on-surface-variant">
              {labels.assessments}
            </p>
            {expandedMemberId === member.id ? (
              <MemberAssessments memberId={member.id} />
            ) : null}
          </AccordionDetails>
        </Accordion>
      ))
    )}
  </Panel>
);

export default memo(MembersList);
