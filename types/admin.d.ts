// types/admin.d.ts

export type Role = 'super_admin' | 'admin' | 'reporter';

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
  role: Role;
}
