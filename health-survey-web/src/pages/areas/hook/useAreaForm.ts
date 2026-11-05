import { useEffect, useMemo, useState } from "react";

export type AreaFormValues = {
  name: string;
  code: string;
  description: string;
};

const emptyForm: AreaFormValues = {
  name: "",
  code: "",
  description: "",
};

const useAreaForm = (open: boolean) => {
  const [form, setForm] = useState<AreaFormValues>(emptyForm);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const setName = (name: string) => setForm((s) => ({ ...s, name }));
  const setCode = (code: string) =>
    setForm((s) => ({
      ...s,
      code: code.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
    }));
  const setDescription = (description: string) =>
    setForm((s) => ({ ...s, description }));

  const canSave = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      /^[A-Z0-9-]{2,30}$/.test(form.code.trim().toUpperCase()),
    [form],
  );

  const toPayload = () => ({
    name: form.name.trim(),
    code: form.code.trim().toUpperCase(),
    description: form.description.trim() || null,
  });

  return { form, setName, setCode, setDescription, canSave, toPayload };
};

export default useAreaForm;
