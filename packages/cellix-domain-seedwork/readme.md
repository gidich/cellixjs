# @cellix/domain-seedwork

Foundational, framework-agnostic building blocks for Domain-Driven Design (DDD) used across the Cellix monorepo. This package provides base classes and interfaces for aggregates, entities, value objects, domain events, repositories, units of work, and simple authorization primitives. It intentionally contains no infrastructure code (no HTTP, databases, queues).

- Purpose: act as seedwork to be extended/implemented by bounded contexts (e.g., `@ocom/api-domain`).
- Scope: abstractions and minimal base implementations only; concrete persistence/event bus live in other packages.
- Language/runtime: TypeScript 5.7, ESM, Node 22+.

For detailed API of individual exports, see the source-level README at:
- `src/domain-seedwork/README.md` (aggregates, entities, value objects, events, repos, UoW)
- `src/passport-seedwork/README.md` (visas)

## Folder structure

```
packages/cellix-domain-seedwork/
├── src/
│   ├── domain-seedwork/         # Core DDD seedwork (aggregates, entities, VO, events, repo, UoW)
│   │   ├── README.md            # API and usage for seedwork exports (authoritative)
│   │   ├── aggregate-root.ts
│   │   ├── domain-entity.ts
│   │   ├── value-object.ts
│   │   ├── domain-event.ts
│   │   ├── event-bus.ts
│   │   ├── repository.ts
│   │   ├── unit-of-work.ts
│   │   ├── type-converter.ts
│   │   ├── prop-array.ts
│   │   └── ...
│   ├── passport-seedwork/       # Minimal authorization primitives
│   │   ├── visa.ts              # Generic Visa interface
│   │   └── index.ts
│   └── index.ts                 # Root exports (DomainSeedwork, PassportSeedwork)
├── package.json
├── tsconfig.json
└── readme.md (this file)
```

## Usage overview

Import via the package root to access namespaced exports:

```ts
import { DomainSeedwork, PassportSeedwork } from '@cellix/domain-seedwork';

class User extends DomainSeedwork.AggregateRoot<UserProps, Passport> {}
interface Permissions {}
const visa: PassportSeedwork.Visa<Permissions> = { determineIf: fn => fn({} as Permissions) };
```

- Aggregates, entities, value objects: Extend base types from `DomainSeedwork`.
- Domain events: Use `DomainEvent` or define typed events with `CustomDomainEventImpl`.
- Repositories and UoW: Implement `Repository<T>` and `UnitOfWork` in your infrastructure package, keep aggregates persistence-agnostic.
- Authorization: Define your Passport/Visas in your domain; this package only provides the `Visa<T>` contract.

For full details and examples, refer to `src/domain-seedwork/README.md`. This package README intentionally avoids repeating those details.

## Scripts

Common scripts from `package.json` (executed in this workspace):

- Build: `npm run build -w @cellix/domain-seedwork`
- Clean: `npm run clean -w @cellix/domain-seedwork`
- Test: `npm run test:unit -w @cellix/domain-seedwork`
- Lint/Format: `npm run lint -w @cellix/domain-seedwork` / `npm run format -w @cellix/domain-seedwork`

## Notes

- No infrastructure dependencies; safe to import in any runtime.
- All public classes and interfaces are exported via `src/index.ts`.
- Downstream packages should keep aggregates thin with rich value objects and domain events.

---

## Recipe History

npm i -D -w cellix-domain-seedwork @tsconfig/node20 @tsconfig/node-ts typescript

npm i -D -w cellix-domain-seedwork rimraf

npm i -D -w cellix-domain-seedwork eslint @eslint/js typescript-eslint
