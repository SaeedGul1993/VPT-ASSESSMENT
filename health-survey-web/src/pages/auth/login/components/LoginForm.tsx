import { memo } from "react";
import Button from "../../../../components/button/Button";
import Input from "../../../../components/input/Input";
import labels from "../../../../assets/labels";
import { fieldSize } from "../../../../constants/Common.constants";
import useAuthApi from "../hook/useAuthApi";

const LoginForm = () => {
  const {
    email,
    password,
    handleChange,
    canSubmit,
    isSubmitting,
    submit,
  } = useAuthApi();

  return (
    <form
      onSubmit={submit}
      autoComplete="off"
      className="flex w-full max-w-md flex-col text-left"
    >
      <div className="mb-10">
        <h2 className="text-4xl font-semibold tracking-tight text-on-surface">
          {labels.welcomeBack}
        </h2>
        <div className="my-4 h-px w-12 bg-gradient-to-r from-primary to-transparent" />
        <p className="font-normal text-on-surface-variant">
          {labels.signInSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-7">
        <Input
          type="email"
          name="email"
          disableAutofill
          value={email}
          onChange={handleChange("email")}
        />
        <Input
          type="password"
          name="password"
          disableAutofill
          value={password}
          onChange={handleChange("password")}
        />
        <Button
          type="submit"
          color="primary"
          fullWidth
          loading={isSubmitting}
          disabled={!canSubmit}
          sx={{
            textTransform: "none",
            height: fieldSize.height,
            minHeight: fieldSize.height,
            "&.Mui-disabled:not(.MuiButton-loading)": {
              opacity: 1,
              backgroundColor: "var(--pd-outline-variant)",
              color: "var(--pd-on-surface-variant)",
            },
          }}
        >
          {labels.signIn}
        </Button>
      </div>
    </form>
  );
};

export default memo(LoginForm);
