<template>
  <DashboardSkeleton v-if="loading" />
  <div class="flex flex-col space-y-12" v-else>
    <!-- Daily Metrics -->
    <section class="flex flex-col gap-3">
      <h2 class="text-2xl font-semibold text-dark-surface dark:text-slate-300">
        দৈনিক পর্যবেক্ষণ
      </h2>

      <ul class="grid grid-cols-1 gap-4">
        <li
          v-for="(card, index) in dailyAnalyticsCards"
          :key="'daily-card-' + index"
          class="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div class="col-span-5 md:col-span-2">
            <MonitoringCard
              :title="card.title"
              :value="card.value"
              :suffix="card.suffix"
            />
          </div>

          <div class="col-span-5 md:col-span-3">
            <ChartCard v-if="dailyCharts[index]" v-bind="dailyCharts[index]" />
          </div>
        </li>
      </ul>
    </section>

    <!-- All Time Metrics -->
    <section class="flex flex-col gap-3">
      <h2 class="text-2xl font-semibold text-dark-surface dark:text-slate-300">
        সর্বকালীন পর্যবেক্ষণ
      </h2>

      <ul class="grid grid-cols-1 gap-4">
        <li
          v-for="(card, index) in allTimeAnalyticsCards"
          :key="'alltime-card-' + index"
          class="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div class="col-span-5 md:col-span-2">
            <MonitoringCard
              :title="card.title"
              :value="card.value"
              :suffix="card.suffix"
            />
          </div>

          <div class="col-span-5 md:col-span-3">
            <ChartCard
              v-if="allTimeCharts[index]"
              v-bind="allTimeCharts[index]"
            />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
  import ChartCard from '@/components/admin/Cards/ChartCard.vue';
  import MonitoringCard from '@/components/admin/Cards/MonitoringCard.vue';
  import DashboardSkeleton from '@/components/admin/skeletons/DashboardSkeleton.vue';
  import type { CardType, ChartCardProps } from '@/utils/adminPropTypes';
  import { onMounted, ref } from 'vue';

  // Loading state
  const loading = ref(true);

  // Example: simulate API loading delay
  onMounted(() => {
    setTimeout(() => {
      loading.value = false;
    }, 2000); // 2 seconds delay
  });

  definePageMeta({
    layout: 'admin',
  });

  // --------------------
  // Daily Metrics
  // --------------------
  const dailyAnalyticsCards: CardType[] = [
    { title: 'Per News Per Day View', value: 1250, suffix: '/ Day' },
    { title: 'Total News Views Today', value: 6520, suffix: '/ Day' },
    { title: 'Ads Clicks Today', value: 320, suffix: '/ Day' },
  ];

  const dailyLabels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const dailyCharts: ChartCardProps[] = [
    {
      title: 'Per News Per Day View',
      type: 'line',
      chartData: [120, 200, 150, 80, 70, 110, 130],
      labels: dailyLabels,
      smooth: true,
      color: [
        '#3b82f6',
        '#f59e0b',
        '#f97316',
        '#facc15',
        '#84cc16',
        '#22c55e',
        '#14b8a6',
      ],
      showValue: true,
      value: 1250,
      suffix: '/ Day',
    },
    {
      title: 'Total News Views Today',
      type: 'bar',
      chartData: [300, 400, 350, 500, 420, 390, 450],
      labels: dailyLabels,
      color: [
        '#f59e0b',
        '#f97316',
        '#facc15',
        '#84cc16',
        '#22c55e',
        '#14b8a6',
        '#0ea5e9',
      ],
      showValue: true,
      value: 6520,
      suffix: '/ Day',
    },
    {
      title: 'Ads Clicks Today',
      type: 'pie',
      chartData: [
        { name: 'Ad1', value: 120 },
        { name: 'Ad2', value: 100 },
        { name: 'Ad3', value: 100 },
      ],
      labels: ['Ad1', 'Ad2', 'Ad3'],
      color: ['#10b981', '#f43f5e', '#8b5cf6'],
      showValue: true,
      value: 320,
      suffix: '/ Day',
      radius: ['40%', '70%'],
    },
  ];

  // --------------------
  // All Time Metrics
  // --------------------
  const allTimeAnalyticsCards: CardType[] = [
    { title: 'Total Views per News', value: 8760, suffix: '/ All Time' },
    { title: 'Total Visitors', value: 15542, suffix: '/ All Time' },
    { title: 'Total Ads Clicks', value: 10240, suffix: '/ All Time' },
  ];

  const monthlyLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const allTimeCharts: ChartCardProps[] = [
    {
      title: 'Total Views per News',
      type: 'scatter',
      chartData: [
        700, 800, 760, 900, 850, 880, 920, 950, 1000, 1100, 1050, 1100,
      ],
      labels: monthlyLabels,
      color: [
        '#3b82f6',
        '#f59e0b',
        '#f97316',
        '#facc15',
        '#84cc16',
        '#22c55e',
        '#14b8a6',
        '#0ea5e9',
        '#8b5cf6',
        '#ec4899',
        '#db2777',
        '#be185d',
      ],
      showValue: true,
      value: 8760,
      suffix: '/ All Time',
      axisMin: 0,
      axisMax: 1200,
    },
    {
      title: 'Total Visitors',
      type: 'radar', // ChartCard.vue-তে এটি area chart হিসেবে রেন্ডার হবে
      chartData: [
        1200, 1300, 1250, 1400, 1350, 1500, 1450, 1550, 1600, 1650, 1580, 1550,
      ],
      labels: monthlyLabels,
      color: [
        '#3b82f6',
        '#f59e0b',
        '#f97316',
        '#facc15',
        '#84cc16',
        '#22c55e',
        '#14b8a6',
        '#0ea5e9',
        '#8b5cf6',
        '#ec4899',
        '#db2777',
        '#be185d',
      ],
      showValue: true,
      value: 15542,
      suffix: '/ All Time',
      axisMin: 1000,
      axisMax: 1700,
    },
    {
      title: 'Total Ads Clicks',
      type: 'pie',
      chartData: [
        { name: 'Ad1', value: 4000 },
        { name: 'Ad2', value: 3200 },
        { name: 'Ad3', value: 3040 },
      ],
      labels: ['Ad1', 'Ad2', 'Ad3'],
      color: ['#10b981', '#f43f5e', '#8b5cf6'],
      showValue: true,
      value: 10240,
      suffix: '/ All Time',
      radius: ['40%', '70%'],
    },
  ];
</script>
