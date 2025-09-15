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
          DEFAULT: 'hsl(155, 100%, 43%)', //rgb(0, 219, 128)
          dark: 'hsl(158, 72%, 38%)', //rgb(27, 167, 116)
        },
        light: {
          DEFAULT: 'hsl(0, 0%, 99%)', //rgb(252, 252, 252)
          50: 'rgb(230, 232, 234)', // rgb(230, 232, 234)
          divider: 'hsl(0, 0%, 99%)', //rgb(253, 253, 253)
          surface: 'hsl(0, 0%, 98%)', // rgb(250,250,250)
          heading: 'hsl(240, 2%, 44%)', //rgb(110, 110, 115)
        },
        dark: {
          DEFAULT: 'hsl(223, 48%, 11%)', // rgb(15, 23, 43)
          surface: 'hsl(236, 88%, 7%)', // rgb(2, 4, 32)
          divider: 'hsl(218, 36%, 18%)', // rgb(29, 41, 61)
          knight: 'hsl(229, 85%, 5%)', // rgb(2, 6, 24)
          hover: 'hsl(210, 2%, 34%)', //rgb(84, 86, 88)
        },
      },
      backgroundImage: {
        adGradient:
          'linear-gradient(-120deg, rgb(27, 166, 115) 0%, rgb(15, 23, 43) 54%, rgb(15, 23, 43) 90%)',
        bgGradient:
          'linear-gradient(128deg, rgba(64, 175, 255, 1) 0%, rgba(63, 97, 255, 1) 100%)',
      },
      fontFamily: {
        base: [
          '"Noto Serif Bengali"',
          '"Tiro Bangla"',
          '"Hind Siliguri"',
          '"Baloo Da 2"',
          'sans-serif',
          'serif',
        ],
        bengali: ['"Noto Serif Bengali"', 'serif'],
        baloda: ['"Baloo Da 2"', 'sans-serif'],
        tino: ['"Tiro Bangla"', 'sans-serif'],
        hind: ['"Hind Siliguri"', 'sans-serif'],
      },
      fontSize: {
        sizeSmall: ['0.90625rem', { lineHeight: '1.375' }],
        sizeMedium: ['0.9375rem', { lineHeight: '1.4375rem' }],
        sizeDefault: ['1rem', { lineHeight: '1.375' }],
        sizeBig: ['1.0625rem', { lineHeight: '1.5rem' }],
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
        'footer-col': '12.5rem', //200px
        'dash-head-xl': '10.9375rem', //175px
        'dash-head-sm': '5.0625rem', //81px
        'screen-minus-xl': 'calc(100% - 10.9375rem)', //100% - 175px
        'screen-minus-sm': 'calc(100% - 5.0625rem)', //100% - 81px
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
      'max-xs': { max: '24.9375rem' }, // <= 399px
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};

export default config;
