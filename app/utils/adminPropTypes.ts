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

export interface MonitoringCardType {
  title: string;
  value: number;
  suffix?: string;
}

export interface ChartCardProps {
  title: string;
  chartData: number[];
  labels: string[];
  smooth?: boolean;
  type?:
    | 'line'
    | 'bar'
    | 'pie'
    | 'scatter'
    | 'effectScatter'
    | 'radar'
    | 'tree'
    | 'treemap'
    | 'sunburst'
    | 'boxplot'
    | 'candlestick'
    | 'heatmap'
    | 'map'
    | 'parallel'
    | 'lines'
    | 'graph'
    | 'sankey'
    | 'funnel'
    | 'gauge'
    | 'pictorialBar'
    | 'themeRiver'
    | 'custom';
  color?: string;
}
