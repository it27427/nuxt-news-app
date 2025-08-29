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
          DEFAULT: 'hsl(0, 0%, 99%)', //rgb(252, 252, 252)
          50: 'rgb(230, 232, 234)', // rgb(230, 232, 234)
          divider: 'hsl(0, 0%, 99%)', //rgb(253, 253, 253)
          surface: 'hsl(0, 0%, 98%)', // rgb(250,250,250)
        },
        dark: {
          DEFAULT: 'hsl(0, 0%, 13%)', // rgb(34, 34, 34)
          surface: 'hsl(0, 0%, 8%)', // rgb(20, 20, 20)
          divider: 'hsl(240, 2%, 25%)', // rgb(63, 63, 66)
          knight: 'hsl(236, 88%, 7%)', // rgb(2, 4, 32)
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
