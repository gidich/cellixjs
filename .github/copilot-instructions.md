---
description: "Copilot instructions for the Cellix monorepo"
applyTo: ./
---

## Global Guidelines

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
- **Projects**: Multi-project setup using `projects: ['<rootDir>/packages/*']`

### Project Structure Guidelines
- **Source Code**: Place all TypeScript files in `src/` directory
- **Tests**: Co-locate test files with source files using `.test.ts` suffix
- **Imports**: Use `.ts` extensions in imports
- **Module Pattern**: Follow ES module syntax (`import`/`export`)

### Code Standards
- Use domain-driven design patterns
- Follow value object patterns using `@lucaspaganini/value-objects`
- Implement dependency injection through service registry pattern
- Use peer dependencies for internal package coupling
- Follow clean architecture principles with clear layer separation

### Build & Development Workflow
- **Build Order**: Dependencies resolved through TypeScript project references
- **Pre-build**: Biome linting runs before TypeScript compilation
- **Clean Process**: Remove dist, node_modules, and tsconfig build info
- **Development**: Use `npm run watch` for continuous compilation
- **Production**: Use `npm run build` for optimized builds

### File Naming Conventions
- Source files: `kebab-case.ts`
- Test files: `kebab-case.test.ts`
- Use descriptive names that reflect domain concepts

### Important Constraints
- Do **not** use `require()` - this is an ESM-only package
- Do **not** use ESLint; all linting should be done with Biome
- Note: Some legacy packages may still have ESLint in devDependencies, but Biome should be preferred

### Package Management
- **Workspace Structure**: All packages follow monorepo workspace pattern
- **Peer Dependencies**: Use peer dependencies for internal package references
- **Build Dependencies**: `rimraf` for cleaning, `typescript` for compilation
- **Naming Conventions**: 
  - `@cellix/*` for framework/seedwork packages
  - `@ocom/*` for application-specific packages

### Error Handling
- Use proper TypeScript error types
- Validate inputs with descriptive error messages
- Follow domain validation patterns established in the codebase

### OpenTelemetry & Observability
- Use OpenTelemetry for distributed tracing and metrics
- Azure Application Insights integration for telemetry
- Follow telemetry mode configuration in Azure Functions
- Use semantic conventions for instrumentation

### Azure Functions Guidelines
- **Runtime**: Azure Functions v4 with Node.js
- **Host Configuration**: Use host.json for function app settings
- **Telemetry**: OpenTelemetry mode enabled for observability
- **Extensions**: Microsoft.Azure.Functions.ExtensionBundle v4+

## Runtime & Peer Dependencies
- Look for runtime & peer dependencies in `package.json` files for each package 


## Package: api (`packages/api/`)

### Code Standards
- Azure Functions entry point - orchestrates all services
- Initialize services through dependency injection
- Use proper Azure Functions binding patterns
- Follow Azure Functions TypeScript best practices
- Register all service dependencies in service registry


## Package: api-context-spec (`packages/api-context-spec/`)

### Code Standards
- Application context specifications
- Define request/response context interfaces
- Provide context contracts for API layers
- Keep context definitions minimal and focused


## Package: api-data-sources-mongoose-models (`packages/api-data-sources-mongoose-models/`)

### Code Standards
- Concrete Mongoose model implementations
- Application-specific data models
- Extend base data source abstractions
- Define schema mappings between domain and persistence


## Package: api-domain (`packages/api-domain/`)

### Code Standards
- Implement proper TypeScript types with strict null checks
- Write comprehensive unit tests for all domain logic
- Use descriptive test names
- Mock external dependencies
- Test files should not make database calls or external API requests


## Package: api-event-handler (`packages/api-event-handler/`)

### Purpose
- Event handling and processing logic
- Domain event subscriptions and reactions

### Code Standards
- Event handler implementations
- Subscribe to domain events
- Process events asynchronously
- Follow event-driven architecture patterns
- Ensure idempotent event processing


## Package: api-graphql (`packages/api-graphql/`)

### Code Standards
- Apollo Server implementation for Azure Functions
- GraphQL schema definitions and resolvers
- Follow GraphQL best practices and conventions
- Integrate with Azure Functions runtime
- Use context specifications for request handling


## Package: api-persistence (`packages/api-persistence/`)

### Code Standards
- Persistence layer implementations
- Repository pattern implementations
- Domain-to-persistence mapping
- Event sourcing and domain event handling
- Transaction management and data consistency


## Package: api-rest (`packages/api-rest/`)

### Code Standards
- REST API implementations using Azure Functions
- HTTP trigger functions for REST endpoints
- Follow RESTful API design principles
- Use context specifications for request/response handling
- Implement proper HTTP status codes and error handling


## Package: cellix-api-services-spec (`packages/cellix-api-services-spec/`)

### Purpose
- Service layer specifications and interfaces
- API service contracts and abstractions

### Code Standards
- Define service interfaces without implementations
- Focus on application service contracts
- Keep specifications technology-agnostic
- Provide clear interface segregation


## Package: cellix-data-sources-mongoose (`packages/cellix-data-sources-mongoose/`)

### Code Standards
- Mongoose-specific data access abstractions
- Repository pattern implementations
- MongoDB schema definitions and validation
- Follow data access layer patterns from domain seedwork


## Package: cellix-domain-seedwork (`packages/cellix-domain-seedwork/`)

### Purpose
- Core domain abstractions and base classes
- Domain-driven design foundational components
- Passport/authentication seedwork

### Code Standards
- Pure domain logic with no external dependencies
- Focus on value objects, entities, and domain services
- Provide abstractions that other packages can implement
- Keep interfaces minimal and focused


## Package: cellix-event-bus-seedwork-node (`packages/cellix-event-bus-seedwork-node/`)

### Code Standards
- Event bus abstractions for Node.js runtime
- OpenTelemetry integration for event tracing
- Follow domain events patterns
- Provide Node.js-specific event handling implementations


## Package: service-mongoose (`packages/service-mongoose/`)

### Code Standards
- Concrete Mongoose service implementations
- Database connection management
- Implement service specifications from `@cellix/api-services-spec`
- Handle MongoDB-specific operations and configurations


## Package: service-otel (`packages/service-otel/`)

### Code Standards
- OpenTelemetry service implementations
- Azure Monitor integration for telemetry export
- Instrument HTTP, GraphQL, Mongoose, and other operations
- Follow OpenTelemetry semantic conventions
- Provide comprehensive observability setup
