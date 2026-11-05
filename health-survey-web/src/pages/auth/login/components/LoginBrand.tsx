import { memo } from "react";
import labels from "../../../../assets/labels";

const LoginBrand = () => (
  <aside className="relative hidden min-h-svh w-[44%] overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,216,254,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(0,70,175,0.55),transparent_40%)]" />
    <div className="relative z-10">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">
        {labels.appTagline}
      </p>
      <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight text-on-primary">
        <span className="text-secondary">{labels.brandAccent}</span>{" "}
        {labels.brandRest}
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-primary/80">
        Monitor field activity, assign workers to areas, and review household
        health assessments from one place.
      </p>
    </div>
    <p className="relative z-10 text-xs text-on-primary/60">
      Community Health Field Survey
    </p>
  </aside>
);

export default memo(LoginBrand);
