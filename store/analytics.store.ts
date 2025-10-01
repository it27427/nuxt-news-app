// store/analytics.store.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosWithAuth } from '~~/shared/axiosWithAuth';
import type { CardType, ChartCardProps } from '~~/types/cards';

export const useAnalyticsStore = defineStore('analytics', () => {
  const loading = ref(false);
  const error = ref<any>(null);
  const dailyAnalyticsCards = ref<CardType[]>([]);
  const dailyCharts = ref<ChartCardProps[]>([]);
  const allTimeAnalyticsCards = ref<CardType[]>([]);
  const allTimeCharts = ref<ChartCardProps[]>([]);

  const fetchAnalyticsData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axiosWithAuth().get<{
        success: boolean;
        data: {
          dailyAnalyticsCards: CardType[];
          dailyCharts: ChartCardProps[];
          allTimeAnalyticsCards: CardType[];
          allTimeCharts: ChartCardProps[];
        };
      }>('/api/admin/dashboard/analytics');

      if (res.data.success) {
        dailyAnalyticsCards.value = res.data.data.dailyAnalyticsCards;
        dailyCharts.value = res.data.data.dailyCharts;
        allTimeAnalyticsCards.value = res.data.data.allTimeAnalyticsCards;
        allTimeCharts.value = res.data.data.allTimeCharts;
      }
    } catch (e: any) {
      error.value =
        e?.response?.data?.statusMessage ||
        e.message ||
        'Failed to fetch analytics data.';
    } finally {
      loading.value = false;
    }
  };

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
