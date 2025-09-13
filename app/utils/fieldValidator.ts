// utils/fieldValidator.ts

import { validateMessages } from './messages';
import type { RegFormKeys } from './types';
import { validateEmailPatternRFC } from './validators';

/**
 * ফিল্ড এবং তার ভ্যালু অনুযায়ী ভ্যালিডেশন
 * @param field ফিল্ডের নাম: 'userName' | 'email' | 'password'
 * @param value ফিল্ডের মান
 * @returns string | undefined — error message বা undefined
 */
export function validateField(
  field: RegFormKeys,
  value: string
): string | undefined {
  switch (field) {
    case 'userName':
      if (!value) return validateMessages.userName.required;
      if (value.length < 3) return validateMessages.userName.minLength;
      return undefined;

    case 'email':
      if (!value) return validateMessages.email.required;
      const emailError = validateEmailPatternRFC(value);
      return emailError || undefined;

    case 'password':
      if (!value) return validateMessages.password.required;
      if (value.length < 8) return validateMessages.password.minLength;
      return undefined;

    default:
      return undefined;
  }
}
