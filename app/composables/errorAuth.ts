// composables/errorAuth.ts

import { computed, ref } from 'vue';

export const useErrorAuth = () => {
  const isAuthenticated = ref(false);

  const status = computed(() =>
    isAuthenticated.value ? 'authenticated' : 'unauthenticated'
  );

  return {
    status,
  };
};
