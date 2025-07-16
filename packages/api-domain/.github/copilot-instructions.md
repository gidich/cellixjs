---
description: "Copilot Instructions for api-domain Package"
applyTo: packages/api-domain/src
---

### Node.js Setup
- **Node Version**: v22
- **Package Manager**: npm with workspaces
- **Module Type**: ESM (ES Modules) - `"type": "module"` in package.json

### TypeScript
- **Base Config**: Extends `../../tsconfig.base.json`
- **Target**: ES2022
- **Module**: NodeNext with node module resolution
- **Strict Mode**: Enabled with comprehensive strict type checking
- **Output Directory**: `dist/`
- **Root Directory**: `.` (package root)
- **Include File Pattern**: `src/**/*.ts`

### Linting Configuration
- **Linter**: Biome (not ESLint)
- **Formatter**: Biome with tab indentation (width: 2)
- **Quote Style**: Single quotes for JavaScript/TypeScript
- **Import Organization**: Automatic import organization enabled

### Testing Configuration
- **Test Framework**: ~~~~~~~~~TO BE DETERMINED~~~~~~~~~
- **Coverage**: Enabled with v8 provider
- **Test File Pattern**: `**/*.test.ts`
- **Test Environment**: Node.js (default)

### Dependencies
- **Runtime**: `@lucaspaganini/value-objects` for value object utilities
- **Peer Dependencies**: 
  - `@cellix/domain-seedwork`
  - `@cellix/event-bus-seedwork-node`

### Project Structure Guidelines
- **Source Code**: Place all TypeScript files in `src/` directory
- **Tests**: Co-locate test files with source files using `.test.ts` suffix
- **Imports**: Use `.ts` extensions in imports
- **Module Pattern**: Follow ES module syntax (`import`/`export`)

### Code Standards
- Use domain-driven design patterns
- Follow value object patterns using `@lucaspaganini/value-objects`
- Implement proper TypeScript types with strict null checks
- Write comprehensive unit tests for all domain logic
- Use descriptive test names
- Mock external dependencies
- Test files should not make database calls or external API requests

### File Naming Conventions
- Source files: `kebab-case.ts`
- Test files: `kebab-case.test.ts`
- Use descriptive names that reflect domain concepts

### Error Handling
- Use proper TypeScript error types
- Validate inputs with descriptive error messages
- Follow domain validation patterns established in the codebase

### Important Constraints
- Do **not** use `require()` - this is an ESM-only package
- Do **not** use ESLint; all linting should be done with Biome