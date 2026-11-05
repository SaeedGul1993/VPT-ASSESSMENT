type ZodFlatten = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

type ApiErrorShape = {
  data?: {
    message?: string;
    errors?: ZodFlatten;
  };
  error?: string;
  status?: number | string;
};

const formatZodErrors = (errors?: ZodFlatten) => {
  if (!errors) return null;

  const fieldMessages = Object.entries(errors.fieldErrors ?? {})
    .flatMap(([field, messages]) =>
      (messages ?? []).map(message => `${field}: ${message}`),
    )
    .filter(Boolean);

  if (fieldMessages.length > 0) return fieldMessages.join('\n');
  if (errors.formErrors?.length) return errors.formErrors.join('\n');
  return null;
};

export const getErrorMessage = (
  error: unknown,
  fallback = 'Request failed',
) => {
  const err = error as ApiErrorShape;
  return (
    formatZodErrors(err?.data?.errors) ||
    err?.data?.message ||
    err?.error ||
    fallback
  );
};
