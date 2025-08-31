declare module '#imports' {
  import type { Ref } from 'vue';
  import type { QueryBuilder } from '@nuxt/content/dist/runtime/types';

  export function useState<T>(key: string, init?: T | (() => T)): Ref<T>;
  export function useRuntimeConfig(): Record<string, any>;

  // Add this to recognize queryContent
  export function queryContent(document?: string): QueryBuilder;
}
