// app/plugins/auth-init.ts

import { useAuthStore } from '~~/store/auth.store';

export default defineNuxtPlugin(async () => {
  const store = useAuthStore();

  if (import.meta.client) {
    await store.initialize();
  }
});
