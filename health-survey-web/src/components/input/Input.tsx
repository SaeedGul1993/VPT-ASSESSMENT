import { memo, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import labels from "../../assets/labels";
import { fieldSize } from "../../constants/Common.constants";

type Props = Omit<TextFieldProps, "variant"> & {
  variant?: TextFieldProps["variant"];
  disableAutofill?: boolean;
  icon?: React.ReactNode;
};

const Input = ({
  type = "text",
  label,
  placeholder,
  size = "medium",
  value,
  onChange,
  name = "",
  variant = "outlined",
  color = "primary",
  fullWidth = true,
  disabled = false,
  required = false,
  error = false,
  helperText = "",
  autoFocus = false,
  autoComplete,
  disableAutofill = false,
  onFocus,
  icon = null,
  sx,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [autofillLocked, setAutofillLocked] = useState(disableAutofill);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  const resolvedLabel =
    label ??
    (type === "email"
      ? labels.email
      : type === "password"
        ? labels.password
        : undefined);

  const resolvedPlaceholder =
    placeholder ??
    (type === "email"
      ? labels.enterEmail
      : type === "password"
        ? labels.enterPassword
        : undefined);

  return (
    <TextField
      type={resolvedType}
      label={resolvedLabel}
      placeholder={resolvedPlaceholder}
      size={size}
      value={value}
      onChange={onChange}
      name={name}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      error={error}
      helperText={helperText}
      autoFocus={autoFocus}
      autoComplete={
        autofillLocked ? "off" : (autoComplete ?? (isPassword ? "current-password" : "off"))
      }
      onFocus={(event) => {
        if (autofillLocked) setAutofillLocked(false);
        onFocus?.(event);
      }}
      slotProps={{
        input: {
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? labels.hidePassword : labels.showPassword
                }
                onClick={() => setShowPassword((current) => !current)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        "& .MuiInputBase-root": {
          minHeight: fieldSize.height,
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export default memo(Input);
