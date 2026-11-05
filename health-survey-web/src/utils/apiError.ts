type ApiErrorShape = {
  data?: {
    message?: string;
  };
  error?: string;
  status?: number | string;
};

export const getErrorMessage = (error: unknown, fallback = "Request failed") => {
  const err = error as ApiErrorShape;
  return err?.data?.message || err?.error || fallback;
};
