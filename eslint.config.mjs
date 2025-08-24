// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    eqeqeq: ['warn', 'always'],
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],

    /* 🎨 Vue Specific Rules */
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

    /* ✅ Best Practice Rules */
    curly: ['warn', 'all'],
    'no-debugger': 'warn',
    'no-trailing-spaces': 'warn',
    'space-before-blocks': ['warn', 'always'],
    'keyword-spacing': ['warn', { before: true, after: true }],
  },
});
