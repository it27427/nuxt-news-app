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
      },
    },
  },
  plugins: [],
};
