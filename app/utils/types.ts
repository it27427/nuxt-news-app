// /utils/types.ts

export interface RegFormData {
  userName: string;
  email: string;
  password: string;
}

export type RegFormKeys = keyof RegFormData; // 'userName' | 'email' | 'password'

export interface RegFormErrors {
  userName?: string;
  email?: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
}
