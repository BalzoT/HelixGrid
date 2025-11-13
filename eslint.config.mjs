// Flat ESLint config for ESLint v9+
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      'dist/**',
      '.next/**',
      'node_modules/**',
      'coverage/**',
      '*.log',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: false,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
    },
  },
  {
    files: ['apps/api/**/*.ts', 'apps/sim/**/*.ts', 'libs/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        process: true,
        console: true,
      },
    },
  },
]

