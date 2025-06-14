import baseConfig from '../../eslint.config.mjs';
import jestConfig from '../../eslint.jest.config.mjs';

export default [
  ...baseConfig,
  jestConfig,
  {
    files: ['./src/domain/contexts/**/*.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];