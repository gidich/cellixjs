import baseConfig from '../../eslint.config.mjs';
import vitest from 'eslint-plugin-vitest';

const vitestConfig = {
    files: ["src/**/*.test.ts"],
    plugins: {
        vitest,
    },
    rules: {
        ...vitest.configs.recommended.rules,
        // Can override/add Vitest-specific rules here
    },
    settings: {
        vitest: {
            typecheck: true,
        }
    },
    languageOptions: {
        globals: {
            ...vitest.environments.env.globals,
        },
    },
};

export default [
    ...baseConfig,
    vitestConfig
];