import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // @ts-ignore
  devtools: {
    enabled: true,
    timeline: false,
    splashScreen: false,
  } as any,
  ssr: false,
  // spaLoadingTemplate: false,

  srcDir: process.env.NUXT_SRC_DIR || 'app/',

  imports: {
    dirs: ['content', 'composables', 'server', 'types'],
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
  ],

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
    config: {},
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
        '@': fileURLToPath(
          new URL(process.env.NUXT_ALIAS_APP || './app/', import.meta.url)
        ),
        assets: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_ASSETS || './app/assets/',
            import.meta.url
          )
        ),
        layouts: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_LAYOUTS || './app/layouts/',
            import.meta.url
          )
        ),
        components: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_COMPONENTS || './app/components/',
            import.meta.url
          )
        ),
        pages: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_PAGES || './app/pages/',
            import.meta.url
          )
        ),
        plugins: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_PLUGINS || './app/plugins/',
            import.meta.url
          )
        ),
        server: fileURLToPath(
          new URL(process.env.NUXT_ALIAS_SERVER || './server/', import.meta.url)
        ),
        content: fileURLToPath(
          new URL(
            process.env.NUXT_ALIAS_CONTENT || './content/',
            import.meta.url
          )
        ),
      },
    },
  },

  css: ['@/assets/scss/main.scss'],
});
