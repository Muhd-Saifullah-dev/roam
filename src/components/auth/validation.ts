// Form checks shared by the auth screens. Each returns an error message or undefined.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string) {
  return value.trim() ? undefined : "Enter your full name";
}

export function validateEmail(value: string) {
  return EMAIL.test(value.trim()) ? undefined : "Enter a valid email address";
}
