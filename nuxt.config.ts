import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  ssr: true,

  srcDir: 'app/',

  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'utils/**',
      'menus',
      'menus/**',
      'middleware',
      'middleware/**',
    ],
    presets: [
      {
        from: 'vue',
        imports: [
          'ref',
          'reactive',
          'computed',
          'watch',
          'onMounted',
          'onUnmounted',
        ],
      },
      {
        from: 'vue-toastification',
        imports: ['useToast'],
      },
      {
        from: 'vue-final-modal',
        imports: ['VueFinalModal'],
      },
      {
        from: 'floating-vue',
        imports: ['FloatingVue'],
      },
      {
        from: 'axios',
        imports: ['default as axios'],
      },
    ],
  },

  nitro: {
    imports: {
      dirs: [
        '~~/server/utils',
        '~~/server/utils/**',
        '~~/server/middleware',
        '~~/server/middleware/**',
        '~~/shared',
        '~~/shared/**',
      ],
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: true,
    },
  ],

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  css: ['~/assets/scss/main.scss'],

  plugins: ['~/plugins/vue-toastification.ts'],

  routeRules: {
    '/institutional': { redirect: '/institutional/about/' },
    '/popular': { redirect: '/popular/read/' },
    '/admin/': { redirect: '/admin/dashboard/' },
    '/api/auth/**': {
      cors: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  },

  // @ts-ignore
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'theme',
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    exposeConfig: false,
    viewer: true,
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'জনপথ',
      titleTemplate: '%s — সত্য আমাদের পথ',
      htmlAttrs: {
        lang: 'bn',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Your page description for SEO' },
        { property: 'og:title', content: 'জনপথ — সত্য আমাদের পথ' },
        {
          property: 'og:description',
          content: 'Your page description for SEO',
        },
      ],
    },
  },

  vite: {
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        '~': resolve(__dirname, './app'),
        '~~': resolve(__dirname, '.'),
      },
    },
  },
});
