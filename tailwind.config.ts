// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(0, 100%, 36%)', //rgb(184, 0, 0)
        },
        light: {
          DEFAULT: 'hsl(0, 0%, 99%)', //rgb(253, 253, 253)
          50: 'rgb(230, 232, 234)', // rgb(230, 232, 234)
          surface: '', //
          text: 'rgb(250,250,250)', // rgb(250,250,250)
        },
        dark: {
          DEFAULT: 'rgb(34, 34, 34)', // rgb(34, 34, 34)
          surface: 'rgb(20, 20, 20)', // rgb(20, 20, 20)
          divider: 'rgb(63, 63, 66)', // rgb(63, 63, 66)
          night: 'rgb(2, 4, 32)', // rgb(2, 4, 32)
        },
      },
      spacing: {
        15: '3.75rem', // 60px
        25: '6.75rem', // 108px
      },
    },
  },
  plugins: [],
};

export default config;
