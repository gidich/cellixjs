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
- **Formatter**: Biome with tab indentation (not Prettier)
- **Quote Style**: Single quotes for JavaScript/TypeScript
- **Import Organization**: Automatic import organization enabled

### Testing Configuration
- **Test Framework**: ~~~~~~~~~TO BE DETERMINED~~~~~~~~~
- **Coverage**: Enabled with v8 provider
- **Test File Pattern**: `**/*.test.ts`
- **Test Environment**: Node.js (default)
- **Projects**: Multi-project setup using `projects: ['<rootDir>/packages/*']`
- Use descriptive test names
- Mock external dependencies

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
- Do **not** use `any` as a type
- Note: Some legacy packages may still have ESLint in devDependencies, but Biome should be preferred

### Package Management
- **Workspace Structure**: All packages follow monorepo workspace pattern
- **Peer Dependencies**: Use peer dependencies for internal package references

### Error Handling
- Use proper TypeScript error types
- Validate inputs with descriptive error messages
- Follow domain validation patterns established in the codebase

### OpenTelemetry & Observability
- Use OpenTelemetry for distributed tracing and metrics
- Azure Application Insights integration for telemetry
- Follow telemetry mode configuration in Azure Functions
- Use semantic conventions for instrumentation
- Do **not** use console.log for non-exception paths

### Azure Functions Guidelines
- **Runtime**: Azure Functions v4 with Node.js
- **Host Configuration**: Use host.json for function app settings
- **Telemetry**: OpenTelemetry mode enabled for observability
- **Extensions**: Microsoft.Azure.Functions.ExtensionBundle v4+

### Runtime & Peer Dependencies
- Look for runtime & peer dependencies in `package.json` files for each package 

### AI Code Generation Guidelines
- Issues assigned to AI for completion should be noted in the commit message


## Project Specific Guidelines

### Package Management
- **Build Dependencies**: `rimraf` for cleaning, `typescript` for compilation
- **Naming Conventions**: 
  - `@cellix/*` for framework/seedwork packages
  - `@ocom/*` for application-specific packages

### Branching Naming Conventions
- Use `feature/` prefix for new features
- Use `bugfix/` prefix for bug fixes
- Use `hotfix/` prefix for critical fixes

### Code Standards
- Use async/await patterns and handle Promise rejections properly
- Include comprehensive JSDoc comments with usage examples for each interface
- Use barrel exports in `index.ts` to expose all specifications
- Keep each interface/class focused on a single responsibility
- Use proper TypeScript strict typing throughout
- Create abstractions that hide implementation details from consuming packages
- Define custom error types with meaningful messages for different failure scenarios
- Use Promise-based APIs for all potentially async operations
- Support environment-based configuration for connection strings and options
- Add OpenTelemetry instrumentation for performance monitoring and debugging
- Implement proper error handling with try-catch blocks and appropriate status codes


## Package: api (`packages/api/`)

### Code Standards
- Create Azure Functions in `src/index.ts` that configure the service registry first thing
- Register all dependencies in the DI container before any function executes
- Use HTTP triggers with request/response types from `@cellix/api-context-spec`
- Wrap function calls in try-catch and return proper HTTP status codes
- Initialize OpenTelemetry at the top of each function file
- Load and validate environment variables during startup
- Keep function handlers thin - delegate to domain services for business logic


## Package: api-context-spec (`packages/api-context-spec/`)

### Code Standards
- Use `Request` and `Response` suffixes for context interfaces (e.g., `CreateUserRequest`)
- Include input validation schemas alongside the context interfaces
- Extend base contexts through interface composition, don't modify them


## Package: api-data-sources-mongoose-models (`packages/api-data-sources-mongoose-models/`)

### Code Standards
- Create Mongoose schemas that map directly to domain entities with proper TypeScript typing
- Export model instances, not schema definitions, from individual model files
- Implement `toDomain()` and `fromDomain()` methods for converting between persistence and domain models
- Use Mongoose validators and custom validation functions that align with domain rules
- Define database indexes in schema definitions for query optimization
- Include `createdAt` and `updatedAt` fields using Mongoose timestamps option
- Use proper Mongoose references and populate strategies for related entities


## Package: api-domain (`packages/api-domain/`)

### Code Standards
- Create entity classes that extend base entity from `@cellix/domain-seedwork`
- Use `@lucaspaganini/value-objects` for all value object implementations
- Implement domain rules as methods within entities, not as external services
- Emit domain events when entity state changes using the event bus
- Write unit tests for all domain logic without external dependencies
- Make value objects immutable and use defensive copying for entity modifications
- Use static factory methods for complex entity creation and validation
- Create domain services only when business logic spans multiple entities


## Package: api-event-handler (`packages/api-event-handler/`)

### Code Standards
- Implement event handlers that subscribe to specific domain events by type
- Design handlers to be safely retryable and check for duplicate processing
- Use dead letter queues for failed events and implement exponential backoff
- Keep event handlers as separate transactions from the originating operation
- Persist handler state separately to enable resume on failure
- Support multiple versions of the same event type for backward compatibility


## Package: api-graphql (`packages/api-graphql/`)

### Code Standards
- Create resolver functions that delegate to application services, not domain directly
- Use GraphQL schema-first approach with separate `.graphql` schema files
- Use GraphQL context to inject request context and authenticated user information
- Transform domain errors into appropriate GraphQL errors with proper error codes
- Validate GraphQL inputs using schema validation before passing to services
- Implement cursor-based pagination for list queries following GraphQL best practices
- Check user permissions in resolvers before executing business operations
- Use DataLoader pattern to prevent N+1 queries when resolving related data


## Package: api-persistence (`packages/api-persistence/`)

### Code Standards
- Create concrete repository classes that implement interfaces from `@cellix/api-services-spec`
- Use MongoDB transactions for operations that span multiple collections
- Convert between domain entities and Mongoose models using dedicated mapper classes
- Use proper MongoDB indexes and projection to optimize query performance
- Persist domain events alongside entity changes for audit and replay capabilities
- Use connection pooling and handle database connection failures gracefully
- Implement eventual consistency patterns where strong consistency isn't required
- Version data schemas and provide migration scripts for breaking changes


## Package: api-rest (`packages/api-rest/`)

### Code Standards
- Create Azure Function HTTP triggers with clear route definitions and HTTP methods
- Validate all incoming requests using context specifications before processing
- Return consistent JSON responses with proper HTTP status codes and error structures
- Implement JWT token validation using Azure Functions bindings
- Add rate limiting headers and implement throttling for high-traffic endpoints
- Configure CORS properly for cross-origin requests in Azure Functions
- Support multiple content types (JSON, XML) based on Accept headers
- Use URL path versioning (e.g., `/api/v1/users`) for API evolution


## Package: cellix-api-services-spec (`packages/cellix-api-services-spec/`)

### Code Standards
- Design interfaces that can be easily composed and decorated


## Package: cellix-data-sources-mongoose (`packages/cellix-data-sources-mongoose/`)

### Code Standards
- Create abstract base repository classes that other packages can extend
- Implement MongoDB connection pooling and retry logic for resilience
- Use Mongoose schema validation with custom validators for business rules
- Provide fluent query builder interfaces for complex MongoDB operations
- Define and manage database indexes through migration scripts
- Create reusable aggregation pipeline builders for complex queries
- Implement soft delete patterns with proper filtering in base queries
- Track all data changes with user context and timestamp information


## Package: cellix-domain-seedwork (`packages/cellix-domain-seedwork/`)

### Code Standards
- Provide abstract Entity<T> classes with ID management and equality comparison
- Create base value object classes that enforce immutability and validation
- Implement event publishing mechanisms that can be consumed by event handlers
- Provide specification interfaces for complex business rule evaluation
- Define generic repository interfaces that hide persistence concerns
- Create factory abstractions for complex entity creation and validation
- Provide base classes for domain services with common infrastructure
- Implement domain validation that can be composed and reused across entities


## Package: cellix-event-bus-seedwork-node (`packages/cellix-event-bus-seedwork-node/`)

### Code Standards
- Create async event bus abstractions that support publish/subscribe patterns
- Implement JSON serialization/deserialization for event persistence and transport
- Provide decorator-based or explicit handler registration mechanisms
- Implement retry policies and dead letter queue patterns for failed events
- Support ordered event processing where business logic requires it
- Allow dynamic subscription and unsubscription of event handlers
- Enable event filtering based on event type, source, or custom criteria


## Package: service-mongoose (`packages/service-mongoose/`)

### Code Standards
- Create concrete service classes that implement interfaces from `@cellix/api-services-spec`
- Manage MongoDB connections with proper initialization, health checks, and graceful shutdown
- Implement MongoDB transactions for operations that require ACID properties
- Convert MongoDB errors into domain-specific exceptions with meaningful messages
- Use connection pooling, query optimization, and proper indexing strategies
- Provide utilities for schema migrations and data transformation scripts


## Package: service-otel (`packages/service-otel/`)

### Code Standards
- Configure OpenTelemetry auto-instrumentation for Node.js with Azure Monitor export
- Create business-specific metrics using OpenTelemetry metrics API
- Propagate trace context across service boundaries and async operations
- Create meaningful spans for business operations with proper attributes and status
- Capture and correlate errors with traces for comprehensive debugging
- Track response times, throughput, and resource utilization metrics
- Configure Azure Application Insights as the telemetry backend with proper sampling
- Implement correlation ID propagation for request tracing across microservices
