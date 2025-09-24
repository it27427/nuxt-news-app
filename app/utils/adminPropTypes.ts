// /utils/adminPropTypes.ts

export interface BaseInputProps {
  id?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  modelValue: string;
  error?: string;
  validated?: boolean;
  autocomplete?: string;
  disabled?: boolean;
}

export interface BaseButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}
