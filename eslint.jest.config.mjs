import jest from 'eslint-plugin-jest';

export default {
  files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  plugins: { jest },
  rules: {
    ...jest.configs.recommended.rules,
    ...jest.configs.style.rules,
    // Can override/add Jest-specific rules here
  },
  languageOptions: {
    globals: {
      ...jest.environments.globals.globals,
    },
  },
};
