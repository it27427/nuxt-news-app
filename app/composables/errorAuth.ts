// composables/errorAuth.ts

import { ref, computed } from 'vue';

export const useErrorAuth = () => {
  const isAuthenticated = ref(false);

  const status = computed(() =>
    isAuthenticated.value ? 'authenticated' : 'unauthenticated'
  );

  return {
    status,
  };
};
