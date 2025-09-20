// /utils/adminPropTypes.ts

export interface BaseInputProps {
  id?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  validated?: boolean;
  modelValue: string;
  error?: string;
}

export interface BaseButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface MenuProps {
  label: string;
  icon: string;
  roles: string[];
  to?: string;
  action?: string;
}

export interface CardType {
  title: string;
  value: number;
  suffix?: string;
}

export interface ChartCardProps {
  title: string;
  chartData: number[] | { name: string; value: number }[];
  labels?: string[];
  type?: 'line' | 'bar' | 'pie' | 'radar' | 'scatter';
  color?: string[];
  smooth?: boolean;
  showValue?: boolean;
  value?: number;
  suffix?: string;
  radius?: string | string[];
  axisMin?: number;
  axisMax?: number;
}
