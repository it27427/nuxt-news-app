import Aura from '@primeuix/themes/aura';
import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // @ts-ignore
  devtools: {
    enabled: true,
    splashScreen: false,
  } as any,

  ssr: true,

  srcDir: process.env.NUXT_SRC_DIR || 'app/',

  imports: {
    dirs: ['content', 'server', 'shared', 'composables'],
    presets: [
      {
        from: 'vue',
        imports: ['ref', 'computed', 'watch', 'onMounted', 'onUnmounted'],
      },
    ],
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'nuxt-tiptap-editor',
    '@primevue/nuxt-module',
  ],

  //@ts-ignore
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system',
          cssLayer: false,
        },
        components: {
          include: '*',
        },
      },
    },
    directives: {
      include: '*',
    },
  },

  css: ['primeicons/primeicons.css', '@/assets/scss/main.scss'],

  // build: {
  //   transpile: ['primevue', '@primeuix/themes'],
  // },

  plugins: ['@/plugins/vue-toastification.ts'],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME,
    auth: {
      secret: process.env.NUXT_AUTH_SECRET,
    },
    openaiApiKey: process.env.OPENAI_API_KEY,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    public: {
      appName: 'জনপথ',
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/auth',
      baseURL: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
      authJs: {
        baseURL:
          process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/auth',
      },
    },
  },

  // @ts-ignore
  auth: {
    provider: {
      type: 'authjs',
    },
  },

  routeRules: {
    '/institutional': { redirect: '/institutional/about/' },
    '/popular': { redirect: '/popular/read/' },
    '/admin/auth/': { redirect: '/admin/login/' },
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
  } as any,

  tailwindcss: {
    cssPath: '@/assets/scss/main.scss',
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
        '@': resolve(__dirname, './app'),
        '~': resolve(__dirname, '.'),
      },
    },
  },
});
