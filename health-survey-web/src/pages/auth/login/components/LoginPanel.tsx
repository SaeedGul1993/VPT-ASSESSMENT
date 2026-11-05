import { memo } from "react";
import LoginForm from "./LoginForm";

const LoginPanel = () => (
  <section className="flex min-h-svh flex-1 items-center justify-center bg-background px-6 py-10">
    <LoginForm />
  </section>
);

export default memo(LoginPanel);
