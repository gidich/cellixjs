import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [ 
        '*.config.*',
        '**/*.config.*',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/package.json'
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    files: ['**/src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {}
  }
);