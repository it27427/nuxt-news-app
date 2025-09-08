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
    dirs: ['content', 'composables', 'server', 'types', 'utils', 'lib'],
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
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'v-gsap-nuxt',
    // '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'nuxt-tiptap-editor',
    // 'nuxt-svg-sprite-icon',
  ],

  // @ts-ignore
  // auth: {
  //   isEnabled: true,
  //   disableServerSideAuth: false,
  //   originEnvKey: 'AUTH_ORIGIN',
  //   baseURL: `http://localhost:${process.env.PORT || 3000}/api/auth`,
  //   provider: {
  //     type: 'local',
  //     endpoints: {
  //       signIn: { path: '/login', method: 'post' },
  //     },
  //   },
  //   sessionRefresh: {
  //     enablePeriodically: true,
  //     enableOnWindowFocus: true,
  //   },
  // },

  routeRules: {
    '/institutional': { redirect: '/institutional/about' },
    '/popular': { redirect: '/popular/read' },
  },

  // tiptap: {
  //   prefix: 'Tiptap',
  // },

  // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  // runtimeConfig: {
  //   session: {
  //     password: '',
  //     name: 'nau-session',
  //     cookie: {}
  //   },
  // },

  // @ts-ignore => to skip unsupported options.
  content: {},

  // @ts-ignore => to skip unsupported options.
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
      title: 'Jonopath',
      titleTemplate: '%s | Sotter Pothe Nirvik',
      htmlAttrs: {
        lang: 'bn',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Your page description for SEO' },
        { property: 'og:title', content: 'Jonopath - Sotter Pothe Nirvik' },
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
        '@content': fileURLToPath(new URL('./content/', import.meta.url)),
        '@server': fileURLToPath(new URL('./server/', import.meta.url)),
        '@prisma': fileURLToPath(new URL('./prisma/', import.meta.url)),
        '@shared': fileURLToPath(new URL('./shared/', import.meta.url)),
        '@utils': fileURLToPath(new URL('./utils/', import.meta.url)),
        '@lib': fileURLToPath(new URL('./lib/', import.meta.url)),
        '@types': fileURLToPath(new URL('./types/', import.meta.url)),
      },
    },
  },

  css: ['@/assets/scss/main.scss'],
});
