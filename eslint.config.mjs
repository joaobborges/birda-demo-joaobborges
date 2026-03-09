import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import noBarrelFiles from 'eslint-plugin-no-barrel-files'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'no-barrel-files': noBarrelFiles,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'no-barrel-files/no-barrel-files': 'error',
    },
  },
  {
    files: ['src/theme/index.ts'],
    rules: {
      'no-barrel-files/no-barrel-files': 'off',
    },
  },
]
