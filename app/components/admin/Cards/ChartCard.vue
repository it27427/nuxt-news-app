<template>
  <div
    class="bg-white dark:bg-dark dark:shadow-lg rounded-xl p-5 flex flex-col items-center w-full h-full transition duration-300"
  >
    <h3
      class="text-light-heading dark:text-slate-400 font-semibold text-lg text-center mb-3"
    >
      {{ toBengaliText(title) }}
    </h3>
    <div ref="chartWrapper" class="w-full h-64">
      <client-only>
        <VChart
          :option="chartOption"
          autoresize
          style="width: 100%; height: 100%"
        />
      </client-only>
    </div>
    <p
      v-if="showValue && value !== undefined"
      class="mt-2 text-center font-medium text-base text-dark-surface dark:text-slate-300"
    >
      {{ toBengaliNumber(value) }} {{ suffix ? toBengaliText(suffix) : '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { ChartCardProps } from '@/utils/adminPropTypes';
  import {
    BarChart,
    GaugeChart,
    LineChart,
    PieChart,
    ScatterChart,
  } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import {
    computed,
    defineAsyncComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
  } from 'vue';

  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    ScatterChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
  ]);

  const VChart = defineAsyncComponent(() => import('vue-echarts'));
  const props = defineProps<ChartCardProps>();
  const {
    title,
    chartData,
    labels = [],
    type = 'line',
    color = ['#3b82f6'],
    smooth = true,
    showValue = false,
    value,
    suffix,
    radius,
    axisMin,
    axisMax,
  } = props;

  const chartWrapper = ref<HTMLDivElement | null>(null);
  const windowSize = reactive({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });
  const handleResize = () => {
    if (typeof window !== 'undefined') windowSize.width = window.innerWidth;
  };
  onMounted(() => window?.addEventListener('resize', handleResize));
  onBeforeUnmount(() => window?.removeEventListener('resize', handleResize));

  const translationMap: Record<string, string> = {
    'Per News Per Day View': 'সংবাদ প্রতি দৈনিক দর্শক',
    'Total News Views Today': 'আজকের মোট সংবাদ দর্শক',
    'Ads Clicks Today': 'আজকের বিজ্ঞাপন ক্লিক',
    'Total Views per News': 'সংবাদ ভিত্তিক মোট দর্শক',
    'Total Visitors': 'মোট দর্শক',
    'Total Ads Clicks': 'মোট বিজ্ঞাপন ক্লিক',
    Sat: 'শনি',
    Sun: 'রবি',
    Mon: 'সোম',
    Tue: 'মঙ্গল',
    Wed: 'বুধ',
    Thu: 'বৃহস্পতি',
    Fri: 'শুক্র',
    Jan: 'জানুয়ারি',
    Feb: 'ফেব্রুয়ারি',
    Mar: 'মার্চ',
    Apr: 'এপ্রিল',
    May: 'মে',
    Jun: 'জুন',
    Jul: 'জুলাই',
    Aug: 'আগস্ট',
    Sep: 'সেপ্টেম্বর',
    Oct: 'অক্টোবর',
    Nov: 'নভেম্বর',
    Dec: 'ডিসেম্বর',
    Day: 'দিন',
    'All Time': 'সর্বকালীন',
    Today: 'আজ',
    Monthly: 'মাসিক',
  };

  const shortMonthMap: Record<string, string> = {
    Jan: 'জা',
    Feb: 'ফে',
    Mar: 'মা',
    Apr: 'এ',
    May: 'মে',
    Jun: 'জু',
    Jul: 'জু',
    Aug: 'আ',
    Sep: 'সে',
    Oct: 'অ',
    Nov: 'ন',
    Dec: 'ডি',
  };

  const toBengaliText = (text?: string) =>
    text
      ? Object.keys(translationMap).reduce(
          (acc, k) =>
            acc.replace(new RegExp(`\\b${k}\\b`, 'gi'), translationMap[k] ?? k),
          text
        )
      : '';

  const toBengaliNumber = (num: string | number) =>
    num
      .toString()
      .split('')
      .map((d) => (/[0-9]/.test(d) ? '০১২৩৪৫৬৭৮৯'[parseInt(d)] : d))
      .join('');

  const chartOption = computed(() => {
    const width = windowSize.width;
    const translatedLabels = labels.map((label) =>
      label in shortMonthMap && width < 1024
        ? shortMonthMap[label]
        : (translationMap[label] ?? label)
    );

    const series: any[] = [];

    if (type === 'pie') {
      series.push({
        name: toBengaliText(title),
        type: 'pie',
        radius: radius ?? '50%',
        data: (chartData as Array<{ name: string; value: number }>).map(
          (item, idx) => ({
            ...item,
            name: toBengaliText(item.name),
            itemStyle: { color: color[idx % color.length] },
          })
        ),
        label: {
          formatter: (p: any) =>
            `${toBengaliText(p.name)}: ${toBengaliNumber(p.value)}`,
        },
      });
    } else {
      const dataArray = chartData as number[];
      series.push({
        name: toBengaliText(title),
        type: type === 'radar' ? 'line' : type, // radar → line (area chart)
        data: dataArray.map((v, idx) => ({
          value: v ?? 0,
          itemStyle: { color: color[idx % color.length] },
        })),
        smooth: type === 'line' && smooth,
        areaStyle:
          type === 'radar' || type === 'line' ? { opacity: 0.2 } : undefined,
      });
    }

    const yMin =
      axisMin ??
      (type !== 'pie'
        ? Math.min(...(chartData as number[])) * 0.95
        : undefined);
    const yMax =
      axisMax ??
      (type !== 'pie'
        ? Math.max(...(chartData as number[])) * 1.05
        : undefined);
    const interval =
      yMin !== undefined && yMax !== undefined
        ? Math.ceil((yMax - yMin) / 5)
        : undefined;

    return {
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        formatter: (params: any) => {
          // Pie chart
          if (type === 'pie') {
            const p = params as any;
            return `${toBengaliText(p.name)}: ${toBengaliNumber(p.value ?? 0)}`;
          }

          // Line, Bar, Scatter, Area (radar→line)
          if (Array.isArray(params)) {
            // Axis trigger returns an array
            return params
              .map((p) => {
                const name = p.axisValueLabel ?? p.name ?? '';
                const val = p.data?.value ?? p.data ?? 0;
                return `${toBengaliText(name)}: ${toBengaliNumber(val)}`;
              })
              .join('<br/>');
          }

          // Single series (fallback)
          const name = params.name ?? '';
          const val = params.value ?? 0;
          return `${toBengaliText(name)}: ${toBengaliNumber(val)}`;
        },
      },
      legend: { show: false },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis:
        type !== 'pie'
          ? {
              type: 'category',
              data: translatedLabels,
              boundaryGap: type === 'bar',
            }
          : undefined,
      yAxis:
        type !== 'pie'
          ? { type: 'value', min: yMin, max: yMax, interval, alignTicks: false }
          : undefined,
      series,
    };
  });
</script>

<style scoped lang="scss">
  .chart-wrapper {
    width: 100%;
    height: 16rem;
  }
</style>
