// server/utils/permissions.ts

export type Role = 'super_admin' | 'admin' | 'reporter';

interface Permissions {
  [key: string]: Role[];
}

export const routePermissions: Permissions = {
  '/admin/dashboard': ['super_admin', 'admin', 'reporter'],
  '/admin/users': ['super_admin'],
  '/admin/news': ['super_admin', 'admin', 'reporter'],
  // '/admin/settings': ['super_admin'],
};
