declare module '#imports' {
  import type { Ref } from 'vue';
  export function useState<T>(key: string, init?: T | (() => T)): Ref<T>;
  export function useRuntimeConfig(): Record<string, any>;
  // add other auto-imported functions you use
}
