// types/auth.d.ts

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthForm extends LoginForm {
  name?: string;
}

export interface AuthFormErrors extends LoginFormErrors {
  name?: string;
}
