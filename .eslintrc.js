module.exports = {
  root: true,
  extends: 'vue',
  env: { browser: true, node: true, es2021: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // ensures Prettier + ESLint work together
    'prettier',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: { void: 'never', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always',
      },
    ],
  },
};
