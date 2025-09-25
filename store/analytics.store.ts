// store/analytics.store.ts

import { useCookie } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { CardType, ChartCardProps } from '~~/types/cards';

export const useAnalyticsStore = defineStore('analytics', () => {
  // State
  const loading = ref(false);
  const error = ref<any>(null);
  const dailyAnalyticsCards = ref<CardType[]>([]);
  const dailyCharts = ref<ChartCardProps[]>([]);
  const allTimeAnalyticsCards = ref<CardType[]>([]);
  const allTimeCharts = ref<ChartCardProps[]>([]);

  // Actions
  async function fetchAnalyticsData() {
    loading.value = true;
    error.value = null;

    const token = useCookie('auth_token').value;

    if (!token) {
      error.value = { message: 'No authentication token found.' };
      loading.value = false;
      return;
    }

    try {
      const { data, error: fetchError } = await useFetch(
        '/api/admin/dashboard/analytics',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fetchError.value) {
        error.value = {
          message: fetchError.value.message || 'Failed to fetch data.',
        };
        throw fetchError.value;
      }

      if (data.value && data.value.success) {
        dailyAnalyticsCards.value = data.value.data.dailyAnalyticsCards;
        dailyCharts.value = data.value.data.dailyCharts;
        allTimeAnalyticsCards.value = data.value.data.allTimeAnalyticsCards;
        allTimeCharts.value = data.value.data.allTimeCharts;
      }
    } catch (e: any) {
      if (!error.value) {
        error.value = { message: e.message || 'An unexpected error occurred.' };
      }
      console.error('Failed to load dashboard data:', e);
    } finally {
      loading.value = false;
    }
  }

  // Exposed State & Actions
  return {
    loading,
    error,
    dailyAnalyticsCards,
    dailyCharts,
    allTimeAnalyticsCards,
    allTimeCharts,
    fetchAnalyticsData,
  };
});
