// types/users.d.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  isDefaultSuperAdmin: boolean;
}

export interface UserCreationForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserUpdateForm {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface UserCreationFormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
