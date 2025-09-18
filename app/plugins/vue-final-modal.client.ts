// app/plugins/vue-final-modal.client.ts

import { defineNuxtPlugin } from '#app';
import { createVfm } from 'vue-final-modal';

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm();
  nuxtApp.vueApp.use(vfm);
});
