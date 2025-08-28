import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxt/icon',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
  ],

  srcDir: 'app/',

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
        '@': fileURLToPath(new URL('./app/', import.meta.url)),
        assets: fileURLToPath(new URL('./app/assets/', import.meta.url)),
        layouts: fileURLToPath(new URL('./app/layouts/', import.meta.url)),
        components: fileURLToPath(new URL('./app/components/', import.meta.url)),
        pages: fileURLToPath(new URL('./app/pages/', import.meta.url)),
        plugins: fileURLToPath(new URL('./app/plugins/', import.meta.url)),
        server: fileURLToPath(new URL('./server/', import.meta.url)),
        content: fileURLToPath(new URL('./content/', import.meta.url)),
      },
    },
  },

  css: ['@/assets/scss/main.scss'],
  
  // tailwindcss: {
  //   exposeConfig: true,
  //   viewer: true,
  // },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})