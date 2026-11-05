import { memo } from "react";

const TONE: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
  primary: "bg-primary/15 text-primary",
  muted: "bg-on-surface-variant/15 text-on-surface-variant",
};

const resolveTone = (status?: string | boolean | null) => {
  const raw = String(status ?? "")
    .trim()
    .toLowerCase();

  if (raw === "active" || raw === "true" || raw === "open") return TONE.success;
  if (raw === "inactive" || raw === "false" || raw === "urgent") return TONE.error;
  if (raw === "pending" || raw === "unread") return TONE.warning;
  return TONE.muted;
};

type Props = {
  status?: string | boolean | null;
  label?: string;
};

const StatusBadge = ({ status, label }: Props) => {
  const text =
    label ??
    (typeof status === "boolean"
      ? status
        ? "Active"
        : "Inactive"
      : String(status ?? "—"));

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${resolveTone(status)}`}
    >
      {text}
    </span>
  );
};

export default memo(StatusBadge);
