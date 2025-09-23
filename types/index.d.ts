// types/index.d.ts

declare module '#app' {
  interface NuxtApp {
    $toast: any;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: any;
  }
}

declare module '#imports' {
  export const useAuth: () => any;
  export const navigateTo: (path: string, options?: any) => Promise<void>;
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    $toast: any;
  }
}

export {};
