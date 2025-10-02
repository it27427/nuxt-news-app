// app/plugins/auth-init.ts

import { useAuthStore } from '~~/store/auth.store';

export default defineNuxtPlugin(async () => {
  const store = useAuthStore();
  await store.initialize();
});
