<template>
  <div>
    <client-only>
      <DashboardSkeleton v-if="analyticsStore.loading" />
      <div v-else class="flex flex-col space-y-12 p-4">
        <div
          v-if="analyticsStore.error"
          class="text-center text-red-600 dark:text-red-400 font-bold p-8 border border-red-300 dark:border-red-600 rounded-lg"
        >
          <p>
            Authentication failed:
            {{
              analyticsStore.error.message ||
              'Please log in to view dashboard data.'
            }}
          </p>
        </div>

        <template v-else>
          <!-- Daily Metrics -->
          <section class="flex flex-col gap-3">
            <h2
              class="text-2xl font-semibold text-dark-surface dark:text-slate-300"
            >
              দৈনিক পর্যবেক্ষণ
            </h2>

            <ul class="grid grid-cols-1 gap-4">
              <li
                v-for="(card, index) in analyticsStore.dailyAnalyticsCards"
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
                  <ChartCard
                    v-if="analyticsStore.dailyCharts[index]"
                    v-bind="analyticsStore.dailyCharts[index]"
                  />
                </div>
              </li>
            </ul>
          </section>

          <!-- All Time Metrics -->
          <section class="flex flex-col gap-3">
            <h2
              class="text-2xl font-semibold text-dark-surface dark:text-slate-300"
            >
              সর্বকালীন পর্যবেক্ষণ
            </h2>

            <ul class="grid grid-cols-1 gap-4">
              <li
                v-for="(card, index) in analyticsStore.allTimeAnalyticsCards"
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
                    v-if="analyticsStore.allTimeCharts[index]"
                    v-bind="analyticsStore.allTimeCharts[index]"
                  />
                </div>
              </li>
            </ul>
          </section>
        </template>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { useAnalyticsStore } from '~~/store/analytics.store';

  definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
  });

  const analyticsStore = useAnalyticsStore();

  await analyticsStore.fetchAnalyticsData();
</script>
