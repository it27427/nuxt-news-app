module.exports = {
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
          DEFAULT: 'rgb(184, 0, 0)',
        },
        light: {
          DEFAULT: 'rgb(253, 253, 253)',
          50: 'rgb(230, 232, 234)',
        },
        dark: {
          DEFAULT: 'rgb(34, 34, 34)',
          bg: 'rgb(20, 20, 20)',
          border: 'rgb(63, 63, 66)',
        },
      },
    },
  },
  plugins: [],
};
