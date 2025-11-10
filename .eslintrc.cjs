/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: [
    '**/*.d.ts',
    '**/dist/**',
    '**/.next/**',
    '**/node_modules/**',
  ],
  env: { es2021: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: false,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.base.json'],
      },
    },
  },
  overrides: [
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals', 'prettier'],
      env: { browser: true, node: false },
      rules: {},
    },
    {
      files: ['apps/api/**/*.ts', 'apps/sim/**/*.ts', 'libs/**/*.{ts,tsx}'],
      env: { node: true },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}

