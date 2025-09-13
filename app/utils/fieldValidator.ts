import { validateMessages } from './messages';
import type { RegFormKeys } from './types';

export function validateField(
  field: RegFormKeys | 'email' | 'password',
  value: string
) {
  switch (field) {
    case 'userName':
      if (!value) return validateMessages.userName.required;
      if (value.length < 3) return validateMessages.userName.minLength;
      break;
    case 'email':
      if (!value) return validateMessages.email.required;
      if (!value.includes('@')) return validateMessages.email.missingAt;
      if (!/\S+@\S+\.\S+/.test(value)) return validateMessages.email.invalid;
      break;
    case 'password':
      if (!value) return validateMessages.password.required;
      if (value.length < 8) return validateMessages.password.minLength;
      break;
  }
  return '';
}
