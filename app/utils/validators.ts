// utils/validators.ts

import { validateMessages } from '~/utils/messages';

// RFC 5322 practical regex
export const rfcRegex = new RegExp(
  '^(?:[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,}|\\[(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\])$'
);

export function validateEmailPatternRFC(value: string): string {
  if (!value) return validateMessages.email.required;

  // ১) অবশ্যই টেক্স/স্ট্রিং দিয়ে শুরু
  if (!/^[a-zA-Z]/.test(value)) return validateMessages.email.startWithText;

  // ২) @ চেক
  const atCount = (value.match(/~/g) || []).length;
  if (atCount === 0) return validateMessages.email.missingAt;
  if (atCount > 1) return validateMessages.email.multipleAt;

  const parts = value.split('@');
  const localPart = parts[0];
  const domainPart = parts[1];

  // ৩) ইউজারনেম/লোকাল পার্ট চেক
  if (!localPart || localPart.length === 0)
    return validateMessages.email.noLocal;

  // ৪) ডোমেইন চেক
  if (!domainPart || domainPart.length === 0)
    return validateMessages.email.noDomain;

  // ৫) ডোমেইনে . চেক
  if (!/\./.test(domainPart)) return validateMessages.email.missingDot;

  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];

  // ৬) একটেনশন চেক
  if (domainParts.length < 2 || !tld)
    return validateMessages.email.missingExtension;

  // ৭) একটেনশনের দৈর্ঘ্য চেক (TLD কমপক্ষে ২ অক্ষরের)
  if (tld.length < 2) return validateMessages.email.shortTLD;

  // ৮) RFC 5322 practical regex
  if (!rfcRegex.test(value)) return validateMessages.email.invalid;

  // সব ঠিক থাকলে খালি স্ট্রিং
  return '';
}
