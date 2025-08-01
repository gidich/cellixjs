---
applyTo: "./packages/api-domain/**/*.ts"
---

# Copilot Instructions: api-domain

## Purpose
- This package contains all application-specific domain logic for the CellixJS monorepo.
- Implements bounded contexts, aggregates, entities, value objects, domain/integration events, repositories, and unit of work patterns following DDD principles.
- Implements authentication and authorization logic through custom passport and visa strategies which safeguard interactions with aggregate roots.

## Architecture & Patterns
- **Domain-Driven Design (DDD)**: Organize code by bounded context and domain concepts. See `contexts.instructions.md` for more details.
- **Separation of Concerns**: Domain logic only; no infrastructure or application service code.
- **Ubiquitous Language**: Use terminology consistent with domain experts and business requirements.

## Coding Conventions
- Follow the global CellixJS development guide and ADRs for workspace-wide standards
- Export all public types, interfaces, and classes via context-level `index.ts` files.
- Use `readonly` for immutable properties.
- Prefer composition over inheritance unless extending domain base classes.
- Document all public APIs with JSDoc comments.
- Use kebab-case for file and directory names.
- Do not include infrastructure, persistence, or framework-specific code.

## Folder Structure
- `src`
  - `domain`
    - `contexts`
    - `events`
    - `iam`

- Organize by bounded context: `src/domain/contexts/{context-name}/`
- Each context contains aggregates, entities, value objects, repositories, and unit of work files.
- `events` contains domain and integration events used across contexts.
- `iam` contains identity and access management logic, including user authentication and authorization via passport and visa implementations.
- For folder-specific conventions and patterns, see the corresponding instructions in each subfolder.

## Testing
- Unit tests required for all domain logic.
- Use `vitest` for testing.
- Each eligible source file must have a corresponding `*.test.ts` file and `./features/*.feature` file.
    - All domain context files must be covered by tests.
    - All visa and passport files must be covered by tests.

## References
- [DDD Patterns (Evans, Fowler)](https://martinfowler.com/bliki/DomainDrivenDesign.html)