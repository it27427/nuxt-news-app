// types/cards.d.ts

export interface CardType {
  title?: string;
  value?: number;
  suffix?: string;
}

export interface ChartCardProps {
  title: string;
  chartData: number[] | { name: string; value: number }[];
  labels?: string[];
  type?: 'line' | 'bar' | 'pie' | 'radar' | 'scatter' | string;
  color?: string[];
  smooth?: boolean;
  showValue?: boolean;
  value?: number;
  suffix?: string;
  radius?: string | string[];
  axisMin?: number;
  axisMax?: number;
}
