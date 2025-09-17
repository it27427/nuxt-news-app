<template>
  <div
    class="bg-white dark:bg-dark dark:shadow-lg rounded-xl p-5 flex flex-col items-center w-full h-full transition duration-300"
  >
    <!-- Card Title -->
    <h3
      class="text-light-heading dark:text-slate-400 font-semibold text-lg text-center mb-3"
    >
      {{ toBengaliText(title) }}
    </h3>

    <!-- Chart -->
    <div ref="chartWrapper" class="w-full h-64">
      <client-only>
        <VChart
          :option="chartOption"
          autoresize
          style="width: 100%; height: 100%"
        />
      </client-only>
    </div>

    <!-- Value + Suffix -->
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
    RadarChart,
    ScatterChart,
  } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    RadarComponent,
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

  // Register ECharts modules
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    GaugeChart,
    ScatterChart,
    RadarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    RadarComponent,
  ]);

  const VChart = defineAsyncComponent(() => import('vue-echarts'));

  // Props
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
  } = props;

  // Refs
  const chartWrapper = ref<HTMLDivElement | null>(null);
  const windowSize = reactive({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });
  const handleResize = () => {
    if (typeof window !== 'undefined') windowSize.width = window.innerWidth;
  };

  onMounted(() => {
    if (typeof window !== 'undefined')
      window.addEventListener('resize', handleResize);
  });
  onBeforeUnmount(() => {
    if (typeof window !== 'undefined')
      window.removeEventListener('resize', handleResize);
  });

  // Translation maps
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

  // Convert text & numbers
  const toBengaliText = (text?: string) =>
    text
      ? Object.keys(translationMap).reduce((acc, k) => {
          const replacement: string = translationMap[k] ?? k;
          return acc.replace(new RegExp(`\\b${k}\\b`, 'gi'), replacement);
        }, text)
      : '';

  const toBengaliNumber = (num: string | number) =>
    num
      .toString()
      .split('')
      .map((d) => (/[0-9]/.test(d) ? '০১২৩৪৫৬৭৮৯'[parseInt(d)] : d))
      .join('');

  // Chart Option
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
            value: item.value,
            itemStyle: { color: color[idx % color.length] },
          })
        ),
        emphasis: { focus: 'series' },
        label: {
          formatter: (params: any) =>
            `${toBengaliText(params.name)}: ${toBengaliNumber(params.value)}`,
        },
      });
    } else if (type === 'radar') {
      const dataArray = chartData as number[];
      series.push({
        name: toBengaliText(title),
        type: 'radar',
        data: [
          {
            value: dataArray,
            lineStyle: { color: color[0] },
            areaStyle: { color: color[0], opacity: 0.2 },
          },
        ],
      });
    } else {
      const dataArray = chartData as number[];
      series.push({
        name: toBengaliText(title),
        type: type,
        data: dataArray.map((v, idx) => ({
          value: v,
          itemStyle: { color: color[idx % color.length] },
        })),
        smooth: type === 'line' && smooth,
      });
    }

    return {
      tooltip: {
        trigger: type === 'pie' || type === 'radar' ? 'item' : 'axis',
      },
      legend: { show: false },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis:
        type !== 'pie' && type !== 'radar'
          ? {
              type: 'category',
              data: translatedLabels,
              boundaryGap: type === 'bar',
            }
          : undefined,
      yAxis: type !== 'pie' && type !== 'radar' ? { type: 'value' } : undefined,
      radar:
        type === 'radar'
          ? {
              indicator: labels.map((label, idx) => ({
                name: translatedLabels[idx],
                max: Math.max(...(chartData as number[])) * 1.2,
              })),
            }
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
