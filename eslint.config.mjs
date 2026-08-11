import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'coverage/**',
      'coverage-*.txt',
      'coverage-output*.txt',
      'playwright-report/**',
      'reports/**',
      'docs/.vitepress/dist/**',
      'docs/.vitepress/cache/**',
      '.zc-code/**',
      '.idea/**',
      'memory/**',
      '**/*.d.ts',
      'zc-ui-*.tgz',
      'validate-icons.cjs',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // `no-undef` doesn't understand TypeScript types (e.g. DOM lib globals like
  // `EventListener`); the TS compiler already catches undefined identifiers.
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // Test specs use bare HTML element names as defineComponent name options,
  // and commonly define multiple inline wrapper components per file.
  {
    files: ['**/__tests__/**', '**/*.{spec,test}.{js,ts,vue}'],
    rules: {
      'vue/no-reserved-component-names': 'off',
      'vue/one-component-per-file': 'off',
    },
  },

  // descriptions-item registers itself with its parent and intentionally
  // renders nothing.
  {
    files: ['packages/components/src/descriptions/descriptions-item.vue'],
    rules: {
      'vue/valid-template-root': 'off',
    },
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: ['**/*.{spec,test}.{js,ts}', '**/__tests__/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.vitest,
      },
    },
  },

  {
    files: ['scripts/**/*.{mjs,js}', '*.config.{js,ts,mjs,cjs}', 'e2e/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'warn',
    },
  },

  skipFormatting
)
