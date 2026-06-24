import { defineConfig } from 'eslint/config'

export default defineConfig({
  ignores: ['dist'],
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
})
