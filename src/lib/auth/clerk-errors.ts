import { isClerkAPIResponseError } from "@clerk/expo";

// Clerk error codes → Roam's copy and the form field it belongs under.

export type AuthErrorField = "name" | "email" | "code";
export type AuthError = { field?: AuthErrorField; message: string };

const COPY: Record<string, AuthError> = {
  form_identifier_exists: { field: "email", message: "An account with this email already exists." },
  form_identifier_not_found: { field: "email", message: "No account found with this email." },
  form_code_incorrect: { field: "code", message: "That code isn't right. Try again." },
  verification_expired: { field: "code", message: "This code expired. Tap Resend code." },
  verification_failed: {
    field: "code",
    message: "Too many attempts. Wait a moment and resend a code.",
  },
  too_many_requests: {
    field: "code",
    message: "Too many attempts. Wait a moment and resend a code.",
  },
};

const FIELDS: Record<string, AuthErrorField> = {
  email_address: "email",
  emailAddress: "email",
  identifier: "email",
  first_name: "name",
  last_name: "name",
  code: "code",
};

export function authError(error: unknown): AuthError {
  const first = isClerkAPIResponseError(error) ? error.errors[0] : undefined;
  if (!first) return { message: "Something went wrong. Try again." };
  const known = COPY[first.code];
  if (known) return known;
  const field = first.meta?.paramName ? FIELDS[first.meta.paramName] : undefined;
  if (first.code === "form_param_format_invalid" && field === "email") {
    return { field, message: "Enter a valid email address" };
  }
  return { field, message: first.longMessage ?? first.message };
}
