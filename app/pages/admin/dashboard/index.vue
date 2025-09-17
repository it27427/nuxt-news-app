<template>
  <div class="flex flex-col space-y-8">
    <div class="flex flex-col gap-3">
      <h2
        class="text-2xl font-tino font-semibold text-dark-surface dark:text-slate-300"
      >
        দৈনিক পর্যবেক্ষণ
      </h2>

      <!-- Daily Cards -->
      <ul
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <li v-for="(card, index) in dailyCards" :key="index">
          <MonitoringCard
            :title="card.title"
            :value="card.value"
            :suffix="card.suffix"
          />
        </li>
      </ul>
    </div>

    <div class="flex flex-col gap-3">
      <h2
        class="text-2xl font-tino font-semibold text-dark-surface dark:text-slate-300"
      >
        মাসিক পর্যবেক্ষণ
      </h2>
      <!-- Monthly Cards -->
      <ul
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <li v-for="(card, index) in monthlyCards" :key="index">
          <MonitoringCard
            :title="card.title"
            :value="card.value"
            :suffix="card.suffix"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MonitoringCard from '@/components/admin/Cards/MonitoringCard.vue';
  // import ChartCard from '@/components/admin/Cards/ChartCard.vue';
  import type { MonitoringCardType as CardType } from '@/utils/adminPropTypes';

  definePageMeta({
    layout: 'admin',
  });

  // Daily statistics
  const dailyCards: CardType[] = [
    { title: 'Per News Visitors', value: 1250, suffix: '/ Day' },
    { title: 'Per News Total Views', value: 8760, suffix: '/ Day' },
    { title: 'Total Users', value: 542, suffix: '/ Day' },
    { title: 'Total News Visitors', value: 6520, suffix: '/ Day' },
    { title: 'Total Ads Clicks', value: 320, suffix: '/ Day' },
  ];

  // Monthly statistics
  const monthlyCards: CardType[] = [
    { title: 'Per News Visitors', value: 45210, suffix: '/ Month' },
    { title: 'Per News Total Visitors', value: 98760, suffix: '/ Month' },
    { title: 'Total Users', value: 1542, suffix: '/ Month' },
    { title: 'Total News Visitors', value: 36520, suffix: '/ Month' },
    { title: 'Total Ads Clicks', value: 3200, suffix: '/ Month' },
  ];
</script>
