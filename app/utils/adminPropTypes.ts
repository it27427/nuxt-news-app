// /utils/adminPropTypes.ts

export interface BaseInputProps {
  id?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  validated?: boolean;
  modelValue: string;
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
  type: 'line' | 'bar' | 'scatter' | 'radar' | 'pie';
  chartData: any;
  labels?: string[];
  color?: string[];
  smooth?: boolean;
  showValue?: boolean;
  value?: number;
  suffix?: string;
  radius?: [string, string];
}
