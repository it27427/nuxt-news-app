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
      blur: {
        '4': '1rem', // custom blur
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(0, 100%, 36%)', //rgb(184, 0, 0)
          dark: 'rgb(162, 2, 25)', //rgb(162, 2, 25)
        },
        light: {
          DEFAULT: 'hsl(0, 0%, 99%)', //rgb(252, 252, 252)
          50: 'rgb(230, 232, 234)', // rgb(230, 232, 234)
          divider: 'hsl(0, 0%, 99%)', //rgb(253, 253, 253)
          surface: 'hsl(0, 0%, 98%)', // rgb(250,250,250)
          heading: 'hsl(240, 2%, 44%)', //rgb(110, 110, 115)
        },
        dark: {
          DEFAULT: 'hsl(0, 0%, 13%)', // rgb(34, 34, 34)
          surface: 'hsl(0, 0%, 8%)', // rgb(20, 20, 20)
          divider: 'hsl(240, 2%, 25%)', // rgb(63, 63, 66)
          knight: 'hsl(236, 88%, 7%)', // rgb(2, 4, 32)
          hover: 'hsl(210, 2%, 34%)', //rgb(84, 86, 88)
        },
      },
      backgroundImage: {
        adGradient:
          'linear-gradient(-120deg, rgb(162, 2, 25) 0%, rgb(24, 1, 9) 54%, rgb(24, 1, 9) 90%)',
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
        sizeLg: ['1.125rem', { lineHeight: '1.5' }],
        sizeXl: ['1.25rem', { lineHeight: '1.5' }],
        size1Xl: ['1.3125rem', { lineHeight: '1.5' }],
        size2Xl: ['1.375rem', { lineHeight: '1.875rem' }],
        size2XXl: ['1.4375rem', { lineHeight: '2rem' }],
        sizeXXl: ['1.75rem', { lineHeight: '1.5' }],
        size3XXl: ['2rem', { lineHeight: '1.5' }],
        size4Xl: ['2.5rem', { lineHeight: '3.5rem' }],
        sizeXXXl: ['3.25rem', { lineHeight: '1.5' }],
      },
      spacing: {
        0.125: '0.125rem', //2px
        0.375: '0.375rem', // 6px
        7.5: '1.875rem', //30px
        12.5: '12.5rem', //200px
        15: '3.75rem', // 60px
        25: '6.75rem', // 108px
        63: '63rem', // 1008px
        36.5: '36.5rem', //584px
        hmw: '80rem', //1280px
        'footer-col': '12.5',
      },
      maxWidth: {
        '80p': '80%',
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
      transitionDuration: {
        400: '400ms',
      },
    },
    screens: {
      // <= MEDIA (MIN-WIDTH)
      xs: '15rem', // <= 240px
      ss: '25rem', // <= 400px
      sm: '36rem', // <= 576px
      md: '37.5rem', // <= 600px
      lg: '62rem', // <= 992px
      xl: '75rem', // <= 1200px
      xxl: '80rem', // <= 1280px
      // <= MEDIA (MAX-WIDTH)
      'max-md': { max: '47.9375rem' }, // <= 767px
      'max-sm': { max: '37.4375rem' }, // <= 599px
      'max-xs': { max: '25rem' }, // <= 400px
    },
  },
  plugins: [],
};

export default config;
