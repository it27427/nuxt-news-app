<template>
  <div class="bg-white dark:bg-dark.surface shadow rounded-xl p-5">
    <h3
      class="text-light-heading dark:text-light font-medium text-sizeLg text-center mb-4"
    >
      {{ toBengaliText(title) }}
    </h3>

    <v-chart :option="chartOption" autoresize class="w-full h-48" />
  </div>
</template>

<script setup lang="ts">
  import type { ChartCardProps } from '@/utils/adminPropTypes';
  import {
    BarChart,
    BoxplotChart,
    CandlestickChart,
    CustomChart,
    EffectScatterChart,
    FunnelChart,
    GaugeChart,
    GraphChart,
    HeatmapChart,
    LineChart,
    LinesChart,
    MapChart,
    PictorialBarChart,
    PieChart,
    RadarChart,
    ScatterChart,
    SunburstChart,
    ThemeRiverChart,
    TreeChart,
    TreemapChart,
  } from 'echarts/charts';
  import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { computed } from 'vue';
  import VChart from 'vue-echarts';

  // Register ECharts components
  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    CandlestickChart,
    TreeChart,
    TreemapChart,
    SunburstChart,
    BoxplotChart,
    HeatmapChart,
    MapChart,
    LinesChart,
    GraphChart,
    FunnelChart,
    GaugeChart,
    PictorialBarChart,
    ThemeRiverChart,
    CustomChart,
    EffectScatterChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ]);

  // Props
  const props = defineProps<ChartCardProps>();
  const title = props.title;

  // Convert English text to Bengali for title/labels
  const toBengaliText = (text?: string) => {
    const safeText = text ?? '';
    const map: Record<string, string> = {
      Total: 'মোট',
      Views: 'ভিউ',
      Visitors: 'দর্শক',
      Day: 'দিন',
      Month: 'মাস',
      Per: 'প্রতি',
      News: 'সংবাদ',
      Users: 'ব্যবহারকারী',
      Ads: 'বিজ্ঞাপন',
      Clicks: 'ক্লিক',
    };

    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    let converted = safeText;
    keys.forEach((key) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      converted = converted.replace(regex, map[key] ?? '');
    });
    return converted;
  };

  // Computed chart option
  const chartOption = computed(() => ({
    title: { text: toBengaliText(title), left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { show: true },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: props.labels.map(toBengaliText),
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: toBengaliText(title),
        type: props.type || 'line',
        data: props.chartData,
        smooth: props.type === 'line' && props.smooth ? true : false,
        color: props.color || '#3b82f6',
      },
    ],
  }));
</script>
