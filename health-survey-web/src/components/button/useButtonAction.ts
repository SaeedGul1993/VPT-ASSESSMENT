import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Options = {
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
};

const currentPath = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

const isThen = (value: unknown): value is PromiseLike<unknown> =>
  Boolean(value) && typeof (value as PromiseLike<unknown>).then === "function";

const useButtonAction = (
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => unknown,
  { disabled = false, loading = false, type = "button" }: Options = {},
) => {
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const mode = useRef<"idle" | "promise" | "nav" | "submit" | "submit-loading">(
    "idle",
  );
  const mounted = useRef(true);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const release = useCallback(() => {
    mode.current = "idle";
    lock.current = false;
    if (mounted.current) setPending(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (mode.current !== "idle") release();
  }, [location.pathname, location.search, location.hash, release]);

  useEffect(() => {
    if (
      loading &&
      (mode.current === "submit" || mode.current === "submit-loading")
    ) {
      mode.current = "submit-loading";
      return;
    }
    if (mode.current === "submit-loading" && !loading) release();
  }, [loading, release]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || pending || lock.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const before = currentPath();
    lock.current = true;

    let result: unknown;
    try {
      result = onClick?.(event);
    } catch (error) {
      release();
      throw error;
    }

    if (isThen(result)) {
      mode.current = "promise";
      setPending(true);
      Promise.resolve(result).finally(release);
      return;
    }

    if (currentPath() !== before) {
      mode.current = "nav";
      setPending(true);
      return;
    }

    if (type === "submit") {
      mode.current = "submit";
      setTimeout(() => {
        if (!mounted.current) return;
        if (mode.current !== "submit" && mode.current !== "submit-loading") {
          return;
        }
        if (loadingRef.current) {
          mode.current = "submit-loading";
          setPending(true);
          return;
        }
        release();
      }, 0);
      return;
    }

    lock.current = false;
  };

  return { pending, onClick: handleClick };
};

export default useButtonAction;
