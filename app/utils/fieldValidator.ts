// validateField.ts
import { validateMessages } from './messages';
import type { RegFormKeys } from './types';
import { validateEmailPatternRFC } from './validators';

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
      return validateEmailPatternRFC(value);

    case 'password':
      if (!value) return validateMessages.password.required;
      if (value.length < 8) return validateMessages.password.minLength;
      break;
  }
  return '';
}
