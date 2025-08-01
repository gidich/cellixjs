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
- **Unit of Work**: Encapsulate transactional consistency for aggregates. Maintains atomicity across aggregate boundaries including domain events.
- **Passport/Visa**: Use custom passport and visa types for authorization logic at the aggregate level.

## Coding Conventions
- Export all public types, interfaces, and classes via context-level `index.ts` files.
- Use `readonly` for immutable properties.
- Prefer composition over inheritance unless extending domain base classes.
- Document all public APIs with JSDoc comments.
- Do not include infrastructure, persistence, or framework-specific code.

## Folder Structure

```
src/
└── domain/
  └── contexts/
    ├── {bounded-context}/                  # Bounded context (e.g., community, user)
    │   ├── index.ts                        # Re-export all public APIs from the context
    │   ├── README.md                       # Documentation for the bounded context's domain model
    │   ├── {bounded-context}.domain-permissions.ts  # Domain permissions for the bounded context
    │   ├── {bounded-context}.passport.ts   # Passport interface for the bounded context
    │   ├── {bounded-context}.visa.ts       # Visa interface for the bounded context
    │   └── {aggregate}/                    # Aggregate root (can have more than one)
    │       ├── index.ts                    # Export all public APIs from aggregate
    │       ├── README.md                   # Documentation for the aggregate and its structure
    │       ├── {aggregate}.aggregate.ts    # Aggregate root implementation
    │       ├── {entity}.entity.ts          # Entity implementation(s)
    │       ├── {aggregate|entity}.value-objects.ts  # Value objects for aggregate/entity
    │       ├── {aggregate}.repository.ts   # Repository interface
    │       ├── {aggregate}.uow.ts          # Unit of Work interface
```

### File Naming Conventions
- Aggregate root file must end in `.aggregate.ts` (e.g., `community.aggregate.ts`)
- Entity files must end in `.entity.ts` (e.g., `member-profile.entity.ts`)
- Value object definitions may be grouped per aggregate or entity in `.value-objects.ts` (e.g `community.value-objects.ts`, `member-profile.value-objects.ts`)

### Recommended README.md Structure
- Purpose of the context/aggregate
- Key domain concepts and entities
- Supported commands and emitted events
- Authorization requirements (Visa/Passport)
- Known business rules or invariants

## Testing
- Unit tests required for all aggregates, entities, value objects, repositories, and unit of work.
- Use `vitest` for testing.
- Each eligible source file must have a corresponding `*.test.ts` file and `./features/*.feature` file.
- Eligible source files include:
    - Aggregates
    - Entities
    - Value Objects
- The remaining files are interfaces which are tested via their implementations which are not located here.

## References
- [DDD Patterns (Evans, Fowler)](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Bounded Contexts (Fowler)](https://martinfowler.com/bliki/BoundedContext.html)