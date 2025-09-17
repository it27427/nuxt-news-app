// utils/number.ts

export const toBanglaNumber = (num: number | string) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num)
    .split('')
    .map((d) => banglaDigits[+d] ?? d)
    .join('');
};
