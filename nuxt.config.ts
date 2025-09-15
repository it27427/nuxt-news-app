import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

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
  ],

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
    configPath: 'tailwind.config.ts',
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
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
        },
      ],
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app/', import.meta.url)),
        '@components': fileURLToPath(
          new URL('./app/components/', import.meta.url)
        ),
        '@composables': fileURLToPath(
          new URL('./app/composables/', import.meta.url)
        ),
        '@layouts': fileURLToPath(new URL('./app/layouts/', import.meta.url)),
        '@assets': fileURLToPath(new URL('./app/assets/', import.meta.url)),
        '@plugins': fileURLToPath(new URL('./app/plugins/', import.meta.url)),
        '@utils': fileURLToPath(new URL('./app/utils/', import.meta.url)),
        '@middleware': fileURLToPath(
          new URL('./app/middleware/', import.meta.url)
        ),
        '@content': fileURLToPath(new URL('./content/', import.meta.url)),
        '@server': fileURLToPath(new URL('./server/', import.meta.url)),
        '@shared': fileURLToPath(new URL('./shared/', import.meta.url)),
        '@lib': fileURLToPath(new URL('./lib/', import.meta.url)),
        '@types': fileURLToPath(new URL('./types/', import.meta.url)),
      },
    },
  },

  css: ['@/assets/scss/main.scss'],
});
