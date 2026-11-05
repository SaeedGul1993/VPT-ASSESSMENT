import { memo } from "react";

type Props = {
  label: string;
  value: number | string;
  hint?: string;
};

const StatCard = ({ label, value, hint }: Props) => (
  <div className="rounded-lg border border-border-card bg-surface-container-lowest p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
      {label}
    </p>
    <p className="mt-2 text-3xl font-semibold text-on-surface">{value}</p>
    {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
  </div>
);

export default memo(StatCard);
