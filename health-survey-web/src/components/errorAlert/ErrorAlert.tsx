import { memo } from "react";

type Props = {
  message?: string | null;
};

const ErrorAlert = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
      {message}
    </div>
  );
};

export default memo(ErrorAlert);
