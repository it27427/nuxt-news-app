// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],

  alias: {
    '@': resolve(__dirname, './'),
  }
})