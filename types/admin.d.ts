// types/admin.d.ts

export interface AdminMenu {
  label: string;
  to?: string;
  icon: string;
  roles: string[];
  action?: string;
  children?: AdminMenu[];
}
