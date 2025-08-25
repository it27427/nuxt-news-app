import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/content'],

  app: {
    head: {
      title: 'Jonopath',
      titleTemplate: '%s | Sotter Pothe Nirvik',
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
        '@': fileURLToPath(new URL('./', import.meta.url)),
        assets: fileURLToPath(new URL('./assets', import.meta.url)),
        components: fileURLToPath(new URL('./components', import.meta.url)),
        content: fileURLToPath(new URL('./content', import.meta.url)),
        layouts: fileURLToPath(new URL('./layouts', import.meta.url)),
        pages: fileURLToPath(new URL('./pages', import.meta.url)),
        plugins: fileURLToPath(new URL('./plugins', import.meta.url)),
      },
    },
  },

  css: ['@/assets/scss/main.scss'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

})