export interface ApiResponse<T = any> {
  success: boolean;
  user?: { id: string; userName: string; email: string };
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface RegFormErrors {
  userName?: string;
  email?: string;
  password?: string;
}

export interface RegFormData {
  userName: string;
  email: string;
  password: string;
}
