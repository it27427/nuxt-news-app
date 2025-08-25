import withNuxt from '@nuxt/eslint-config';
// @ts-check

export default withNuxt({
  rules: {
    /* 🌐 JavaScript Rules */
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    eqeqeq: ['warn', 'always'],
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],

    /* 🎨 Vue Rules */
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['warn', 2],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 3,
        multiline: 1,
      },
    ],
    'vue/no-v-html': 'off',

    /* ✅ Best Practices */
    curly: ['warn', 'all'],
    'no-debugger': 'warn',
    'no-trailing-spaces': 'warn',
    'space-before-blocks': ['warn', 'always'],
    'keyword-spacing': ['warn', { before: true, after: true }],

    /* 🧹 Extra cleanups */
    'unused-imports/no-unused-imports': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
  },
});
