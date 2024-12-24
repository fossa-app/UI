import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import eslintJs from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginCypress from 'eslint-plugin-cypress';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        BigInt: true,
        cy: true,
      },
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
      cypress: eslintPluginCypress,
      '@typescript-eslint': eslintPluginTypeScript,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginPrettier.configs.recommended.rules,
      ...eslintPluginCypress.configs.recommended.rules,
      ...eslintPluginTypeScript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['cypress/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.cypress,
        Cypress: true,
      },
    },
  },
  {
    ignores: ['node_modules', 'coverage', 'build', 'vite.config.ts', 'cypress.config.ts', 'jest.config.ts'],
  },
];
