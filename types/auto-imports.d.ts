// types/auto-imports.d.ts

declare global {
  // Vue core
  const ref: (typeof import('vue'))['ref'];
  const reactive: (typeof import('vue'))['reactive'];
  const computed: (typeof import('vue'))['computed'];
  const watch: (typeof import('vue'))['watch'];
  const onMounted: (typeof import('vue'))['onMounted'];
  const onUnmounted: (typeof import('vue'))['onUnmounted'];

  // Vue Toastification
  const useToast: typeof useToast;

  // Vue Final Modal
  const VueFinalModal: typeof VueFinalModal;

  // Axios
  const axios: (typeof import('axios'))['default'];

  // Nuxt built-ins (already provided by #imports but good for TS intellisense)
  const useRouter: (typeof import('#app'))['useRouter'];
  const useRoute: (typeof import('#app'))['useRoute'];
  const navigateTo: (typeof import('#app'))['navigateTo'];
  const definePageMeta: (typeof import('#app'))['definePageMeta'];
  const useState: (typeof import('#app'))['useState'];
}

export {};
