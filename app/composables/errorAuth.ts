// composables/errorAuth.ts

export const useErrorAuth = () => {
  const isAuthenticated = ref(false);

  const status = computed(() =>
    isAuthenticated.value ? 'authenticated' : 'unauthenticated'
  );

  return {
    status,
  };
};
