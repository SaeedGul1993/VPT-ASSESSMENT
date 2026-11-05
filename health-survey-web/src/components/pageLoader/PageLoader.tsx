import { memo } from "react";
import { CircularProgress } from "@mui/material";
import labels from "../../assets/labels";

const PageLoader = () => (
  <div className="flex min-h-[100vh] items-center justify-center bg-background">
    <CircularProgress
      size={56}
      thickness={4}
      sx={{ color: "var(--pd-outline-variant)" }}
      aria-label={labels.loading}
    />
  </div>
);

export default memo(PageLoader);
