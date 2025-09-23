// types/nuxt.d.ts

/// <reference types="nuxt" />

declare global {
  const definePageMeta: (typeof import('nuxt/dist/app/composables/metadata'))['definePageMeta'];
}

export {};
