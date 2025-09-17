// app/utils/bn.ts
export function toBengaliText(num: number | string): string {
  const enToBnMap: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };

  return num.toString().replace(/[0-9]/g, (d) => enToBnMap[d]!);
}
