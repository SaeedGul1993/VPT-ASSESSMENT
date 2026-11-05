import { memo } from "react";
import { Button as MuiButton, type ButtonProps } from "@mui/material";
import useButtonAction from "./useButtonAction";

type Props = ButtonProps & {
  loading?: boolean;
  icon?: React.ReactNode;
};

const Button = ({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  icon,
  sx,
  ...rest
}: Props) => {
  const action = useButtonAction(onClick, {
    disabled,
    loading,
    type: type as "button" | "submit" | "reset",
  });
  const showLoading = loading || action.pending;
  const loaderColor =
    variant === "contained"
      ? color === "secondary"
        ? "var(--pd-on-secondary)"
        : "var(--pd-on-primary)"
      : color === "secondary"
        ? "var(--pd-secondary)"
        : "var(--pd-primary)";

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || action.pending}
      loading={showLoading}
      type={type}
      onClick={action.onClick}
      startIcon={icon}
      sx={{
        "& .MuiButton-loadingIndicator": {
          color: loaderColor,
        },
        ...(variant === "contained" && {
          "&.Mui-disabled.MuiButton-loading": {
            backgroundColor:
              color === "secondary"
                ? "var(--pd-secondary)"
                : "var(--pd-primary)",
          },
        }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};

export default memo(Button);
