/** ======================================================================================
 * 📄 File: nuxt.config.ts
 *
 * 🗺️ App Configuration: Defines core settings, modules, options, app behavior, aliases, and app styles.
 *
 * 🗂️ Config Structure:
 *    🧩 Basic Settings
 *    📦 Modules
 *    🎛️ Module Options (icon, colorMode, tailwindcss)
 *    🖥️ Runtime App Configs
 *    🌩️ Vite & Aliases
 *    🎨 Global Styles
 *
 * ✍️ Maintain logical order for readability.
 * 💡 Use "@ts-ignore" for unsupported module options.
 * ===========================================================================================*/

import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  /* ==============================
   * 🧩 Basic Settings
   * ==============================*/
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  /* ========================================
   * ✍️ Set srcDir first for custom layouts.
   * ========================================*/
  srcDir: process.env.NUXT_SRC_DIR || 'app/',

  /* ===============================================
   * 📦 Module Registering
   * ✍️ Ensure module installed before registering.
   * ===============================================*/
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxt/icon',
    '@nuxtjs/mdc',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  /* ================================================
   * 🗃️ Icon Module Setup
   * ✍️ Use “@ts-ignore” to fix unsupported options.
   * ================================================*/
  // @ts-ignore
  icon: {
    collections: {
      mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
      heroicons: () =>
        import('@iconify-json/heroicons/icons.json').then((i) => i.default),
    },
  },

  /* ====================================================
   * 🌙 ColorMode => Theme Switch Setup
   * ✍️ Apply “@ts-ignore” to skip unsupported options.
   * ===================================================*/
  // @ts-ignore
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  /* =========================================
   * 🌈 Tailwind Setup
   * ✍️ Define TailwindCSS setup here.
   * =========================================*/
  // @ts-ignore => to skip unsupported options.
  tailwindcss: {
    cssPath: '~/assets/scss/main.scss',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    config: {},
    viewer: true,
  },

  /* =================================================
   * 📱 Runtime App Config & Head
   * ✍️ Set <head> metadata, meta tags, and SEO here.
   * =================================================*/

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
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

  /* ====================================
   * ⚡ Vite & Aliases
   * ✍️ Use aliases for cleaner imports.
   * ====================================*/
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

  /* ===========================================
   * 🎨 Application Stylesheets
   * ✍️ Global theme setup goes here.
   * ===========================================*/
  css: ['~/assets/scss/main.scss'],
});
