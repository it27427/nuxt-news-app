<template>
  <div class="flex flex-col space-y-12">
    <!-- Daily Metrics -->
    <section class="flex flex-col gap-3">
      <!-- Title Skeleton -->
      <div
        class="w-1/3 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
      ></div>

      <ul class="grid grid-cols-1 gap-4">
        <li
          class="grid grid-cols-1 md:grid-cols-5 gap-4"
          v-for="n in 3"
          :key="'daily-' + n"
        >
          <div class="col-span-5 md:col-span-2">
            <MonitoringCardSkeleton />
          </div>
          <div class="col-span-5 md:col-span-3">
            <ChartCardSkeleton />
          </div>
        </li>
      </ul>
    </section>

    <!-- All Time Metrics -->
    <section class="flex flex-col gap-3">
      <!-- Title Skeleton -->
      <div
        class="w-1/3 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
      ></div>

      <ul class="grid grid-cols-1 gap-4">
        <li
          class="grid grid-cols-1 md:grid-cols-5 gap-4"
          v-for="n in 3"
          :key="'alltime-' + n"
        >
          <div class="col-span-5 md:col-span-2">
            <MonitoringCardSkeleton />
          </div>
          <div class="col-span-5 md:col-span-3">
            <ChartCardSkeleton />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
  import ChartCardSkeleton from '@/components/admin/skeletons/ChartCardSkeleton.vue';
  import MonitoringCardSkeleton from '@/components/admin/skeletons/MonitoringCardSkeleton.vue';
</script>
