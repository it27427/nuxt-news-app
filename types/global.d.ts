// types/global.d.ts

export interface NavItem {
  label: string;
  to: string;
  children?: NavItem[];
  icon?: string;
}
