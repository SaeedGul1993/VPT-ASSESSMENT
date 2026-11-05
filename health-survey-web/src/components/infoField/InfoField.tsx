import { memo } from "react";

type Props = {
  label: string;
  value?: string | number | null;
};

const InfoField = ({ label, value }: Props) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-on-surface-variant">
      {label}
    </p>
    <p className="mt-1 text-sm text-on-surface">{value || "—"}</p>
  </div>
);

export default memo(InfoField);
