import { memo } from "react";
import labels from "../../assets/labels";

type Props = {
  message?: string;
  className?: string;
};

const EmptyState = ({
  message = labels.noData,
  className = "px-4 py-6 text-sm text-on-surface-variant",
}: Props) => <p className={className}>{message}</p>;

export default memo(EmptyState);
