import baseConfig from '../../eslint.config.mjs';
import tseslint from 'typescript-eslint';
import oxlint from 'eslint-plugin-oxlint';

export default tseslint.config(
  ...baseConfig,
  ...oxlint.configs['flat/recommended'],
  ...oxlint.configs['flat/typescript'],
);