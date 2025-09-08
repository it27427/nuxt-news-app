import 'nuxt/schema';

declare module 'nuxt/schema' {
  interface NuxtConfig {
    auth?: any;
  }
}
