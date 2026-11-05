import { memo } from "react";
import Button from "../button/Button";

type Action = {
  id?: string;
  label: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "inherit";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  icon?: React.ReactNode;
};

type Props = {
  title: string;
  actions?: Array<Action | false | null | undefined>;
  bordered?: boolean;
};

const PageHeader = ({ title, actions = [], bordered = true }: Props) => {
  const visibleActions = actions.filter(Boolean) as Action[];
  const frame = bordered
    ? "rounded-lg border border-border-card bg-surface-container-lowest px-3 py-3 sm:px-4"
    : "";

  return (
    <div
      className={`flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between ${frame}`}
    >
      <p className="m-0 text-sm font-semibold text-on-surface">{title}</p>
      {visibleActions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {visibleActions.map((action, index) => (
            <Button
              key={action.id ?? action.label ?? index}
              variant={action.variant ?? "contained"}
              color={action.color ?? "primary"}
              size={action.size ?? "small"}
              disabled={action.disabled}
              loading={action.loading}
              type={action.type ?? "button"}
              onClick={action.onClick}
              icon={action.icon}
              sx={{ textTransform: "none" }}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default memo(PageHeader);
