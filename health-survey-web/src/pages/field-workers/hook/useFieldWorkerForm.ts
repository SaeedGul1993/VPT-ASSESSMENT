import { useEffect, useMemo, useState } from "react";

export type FieldWorkerFormValues = {
  name: string;
  email: string;
  password: string;
  areaId: string;
};

const emptyForm: FieldWorkerFormValues = {
  name: "",
  email: "",
  password: "",
  areaId: "",
};

const useFieldWorkerForm = (open: boolean) => {
  const [form, setForm] = useState<FieldWorkerFormValues>(emptyForm);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const setField =
    (field: keyof FieldWorkerFormValues) =>
    (value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
    };

  const canSave = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      form.password.trim().length >= 6,
    [form],
  );

  const toPayload = () => ({
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    areaId: form.areaId || null,
  });

  return { form, setField, canSave, toPayload };
};

export default useFieldWorkerForm;
