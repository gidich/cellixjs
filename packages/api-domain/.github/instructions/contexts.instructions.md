---
applyTo: "./packages/api-domain/src/domain/contexts/**/*.ts"
---

# Copilot Instructions: Bounded Contexts

See the package-wide instructions in `.github/instructions/api-domain.instructions.md` for general rules, architecture, and conventions.

## Related Instructions
- `.github/instructions/aggregates.instructions.md`
- `.github/instructions/entities.instructions.md`
- `.github/instructions/value-objects.instructions.md`

## Purpose
- This folder contains all bounded contexts for the domain layer.
- Each context encapsulates aggregates, entities, value objects, repositories, unit of work, and related domain logic.

## Architecture & Patterns
- **Bounded Contexts**: Each subfolder correlates to a bounded context (e.g., `user`, `community`, `service`).
- **Aggregate Roots**: Implement business invariants and coordinate changes to related entities/value objects scoped within the bounded context.
- **Repositories**: Provide interfaces for aggregate persistence.
- **Unit of Work**: Encapsulate transactional consistency for aggregates.
- **Passport/Visa**: Use custom passport and visa types for authorization logic at the aggregate level.

## Coding Conventions
- Export all public types, interfaces, and classes via context-level `index.ts` files.
- Use `readonly` for immutable properties.
- Prefer composition over inheritance unless extending domain base classes.
- Document all public APIs with JSDoc comments.
- Do not include infrastructure, persistence, or framework-specific code.

## Folder Structure
- Each bounded context is a subfolder: `src/domain/contexts/{bounded-context-name}/`
- Each bounded context contains:
    - `{aggregate}/`: Subfolder for aggregate root that belongs to the bounded context; can have more than one aggregate root.
    - `{bounded-context-name}.domain-permissions.ts`: Domain permissions for the bounded context.
    - `{bounded-context-name}.passport.ts`: Passport interface for the bounded context
    - `{bounded-context-name}.visa.ts`: Visa interface for the bounded context
    - `README.md`: Documentation for the bounded context's domain model
    - `index.ts`: Re-export all public APIs from the context

- Each aggregate root contains the following files:
  - (1) Aggregate: `{aggregate}.aggregate.ts`
  - (0..*) Entities: `{entity}.entity.ts`
  - (0..*) Value Objects: `{aggregate|entity}.value-objects.ts`
  - (1) Repositories: `{aggregate}.repository.ts`
  - (1) Unit of Work: `{aggregate}.uow.ts`
  - (1) Passport: `{bounded-context-name}.passport.ts`
  - (1) Visa: `{bounded-context-name}.visa.ts`
  - (1) README.md describing the aggregate and its structure
  - Export all public APIs from `index.ts`

## Testing
- Unit tests required for all aggregates, entities, value objects, repositories, and unit of work.
- Use `vitest` for testing.
- Each eligible source file must have a corresponding `*.test.ts` file and `./features/*.feature` file.
- Eligible source files include:
    - Aggregates
    - Entities
    - Value Objects

## References
- [DDD Patterns (Evans, Fowler)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
-