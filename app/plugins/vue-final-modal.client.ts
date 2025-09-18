// app/plugins/vue-final-modal.client.ts

import { defineNuxtPlugin } from '#app';
import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm();
  nuxtApp.vueApp.use(vfm);
});
