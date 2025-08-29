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
      fontFamily: {
        bengali: [
          '"Noto Serif Bengali"',
          'serif',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        sizeSmall: ['0.90625rem', { lineHeight: '1.375' }],
        sizeMedium: ['0.9375rem', { lineHeight: '1.5' }],
        sizeDefault: ['1rem', { lineHeight: '1.375' }],
        sizeBig: ['1.0625rem', { lineHeight: '1.5' }],
      },
      spacing: {
        0.125: '0.125rem', //2px
        7.5: '1.875rem', //30px
        12.5: '12.5rem', //200px
        15: '3.75rem', // 60px
        25: '6.75rem', // 108px
        63: '63rem', // 1008px
        36.5: '36.5rem', //584px
        'footer-col': '12.5',
      },
      zIndex: {
        '60': '60',
        overlay: '999',
        modal: '9999',
        preloader: '9999999',
      },
      keyframes: {
        ellipsisSteps: {
          '0%': { content: "''" },
          '33%': { content: "'.'" },
          '66%': { content: "'..'" },
          '100%': { content: "'...'" },
        },
      },
      animation: {
        ellipsis: 'ellipsisSteps 1.5s steps(3, end) infinite',
      },
    },
    screens: {
      // <= MEDIA (MIN-WIDTH)
      xs: '15rem', // <= 240px
      ss: '25rem', // <= 400px
      sm: '36rem', // <= 576px
      md: '48rem', // <= 768px
      lg: '62rem', // <= 992px
      xl: '75rem', // <= 1200px
      xxl: '80rem', // <= 1280px
      // <= MEDIA (MAX-WIDTH)
      'max-md': { max: '37.4375rem' }, // <= 599px
    },
  },
  plugins: [],
};

export default config;
