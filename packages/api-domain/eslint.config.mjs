import baseConfig from '../../eslint.config.mjs';
import jestConfig from '../../eslint.jest.config.mjs';

export default [
  ...baseConfig,
  jestConfig,
];