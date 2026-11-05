import { memo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

const Panel = ({ children, className = "", padded = false }: Props) => (
  <div
    className={`rounded-lg border border-border-card bg-surface-container-lowest ${
      padded ? "p-4" : ""
    } ${className}`}
  >
    {children}
  </div>
);

export default memo(Panel);
