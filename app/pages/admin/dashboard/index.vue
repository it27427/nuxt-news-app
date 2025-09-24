<template>
  <DashboardSkeleton v-if="loading" />
  <div v-else class="flex flex-col space-y-12">
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
  import type { CardType, ChartCardProps } from '~/utils/adminPropTypes';

  definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
  });

  const loading = ref(true);
  const dailyAnalyticsCards = ref<CardType[]>([]);
  const dailyCharts = ref<ChartCardProps[]>([]);
  const allTimeAnalyticsCards = ref<CardType[]>([]);
  const allTimeCharts = ref<ChartCardProps[]>([]);

  const {
    data: analytics,
    pending,
    error,
  } = await useFetch('/api/admin/dashboard/analytics', {
    lazy: true,
    server: false,
    headers: {
      Authorization: import.meta.client
        ? `Bearer ${localStorage.getItem('token')}`
        : '',
    },
  });

  watch(pending, (newPending) => {
    loading.value = newPending;
  });

  watch(
    analytics,
    (newData) => {
      if (newData && newData.success) {
        dailyAnalyticsCards.value = newData.data.dailyAnalyticsCards;
        dailyCharts.value = newData.data.dailyCharts;
        allTimeAnalyticsCards.value = newData.data.allTimeAnalyticsCards;
        allTimeCharts.value = newData.data.allTimeCharts;
      }
    },
    { immediate: true }
  );

  if (error.value) {
    console.error('Failed to load dashboard data:', error.value);
  }
</script>
