import { useState } from "react";

type Validator = (value: string) => string | undefined;

/**
 * Field values and errors for an auth form. Errors appear on submit, then a
 * field re-checks itself as it's edited.
 */
export function useAuthForm<F extends string>(validators: Record<F, Validator>) {
  const fields = Object.keys(validators) as F[];
  const [values, setValues] = useState(
    () => Object.fromEntries(fields.map((f) => [f, ""])) as Record<F, string>,
  );
  const [errors, setErrors] = useState<Partial<Record<F, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (field: F) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (submitted) setErrors((e) => ({ ...e, [field]: validators[field](value) }));
  };

  /** Shows every field's error; true when the form is valid. */
  const validate = () => {
    setSubmitted(true);
    const next = Object.fromEntries(
      fields.map((f) => [f, validators[f](values[f])]),
    ) as Partial<Record<F, string>>;
    setErrors(next);
    return fields.every((f) => !next[f]);
  };

  const setError = (field: F, message: string) => setErrors((e) => ({ ...e, [field]: message }));

  return { values, errors, setField, validate, setError };
}
