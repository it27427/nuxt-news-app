// types/admin.d.ts

export interface AdminMenuType {
  label: string;
  to?: string;
  icon: string;
  roles: string[];
  action?: string;
  children?: AdminMenu[];
}

export interface UserType {
  id: number;
  email: string;
  name?: string;
  role: string;
}
