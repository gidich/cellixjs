---
applyTo: "./packages/api-domain/src/domain/contexts/**/*.aggregate.ts"
---

# Copilot Instructions: `api-domain/src/domain/contexts/**/*.aggregate.ts`

See the package-wide and context-specific instructions for general rules, architecture, and conventions.

## Purpose
- Aggregate root files define the main entry point for a group of related entities and value objects within a bounded context.
- Aggregate roots enforce business invariants, coordinate changes to related entities/value objects, and encapsulate transactional boundaries.

## Architecture & Patterns
- **Domain-Driven Design (DDD):** Each aggregate root represents a transactional consistency boundary and is responsible for enforcing domain rules.
- **Authorization:** All mutating operations (setters, commands, methods that change state) must enforce authorization using the appropriate Visa for the aggregate's context.
- **Event Sourcing:** Use `addDomainEvent` and `addIntegrationEvent` to raise domain and integration events as needed.
- **Immutability:** Expose immutable references for value objects and entity references where possible.

## Coding Conventions
- Extend `DomainSeedwork.AggregateRoot<Props, Passport>` and implement the corresponding entity reference interface.
- Use TypeScript strict typing and generics for props.
- Use `readonly` for immutable properties.
- Use kebab-case for file and directory names.
- Export the aggregate root class and related types from the context's `index.ts`.
- Document all public APIs with JSDoc comments.
- Do not include infrastructure, persistence, or application service code.

### Props
- Each aggregate root must define a Props interface that extends `DomainSeedwork.DomainEntityProps`.
- The Props interface should include all relevant properties for the aggregate root, using appropriate types.
- Types include:
    - primitives
    - prop arrays
    - reference fields

## Implementation Guidelines
- Each file should contain a Props interface, an EntityReference interface, and an aggregate root class.
- Organize your aggregate root class with the following regions and order:
  1. **Fields**: Private/protected fields, including the Visa instance and any state flags (e.g., `isNew`).
  2. **Constructors**: Public constructor, initializing props, passport, and Visa.
  3. **Methods**: Static factory creation, can include publicly exposed domain behavior (e.g., `getNewInstance`, `markAsNew`).
  6. **Properties (Getters/Setters)**: Expose state, enforce permission checks in setters, and leverage value objects/entities as needed.

## Example: Aggregate Root Class Structure

```typescript
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ExampleVisa } from '../example.visa.ts';
import { ExampleCreatedEvent } from '../../../events/types/example-created.ts';
import type { Passport } from '../../passport.ts';

export interface ExampleProps extends DomainSeedwork.DomainEntityProps {
  foo: string;
  // ...other properties...
}

export interface ExampleEntityReference extends Readonly<ExampleProps> {}

export class Example<props extends ExampleProps>
  extends DomainSeedwork.AggregateRoot<props, Passport>
  implements ExampleEntityReference
{
  //#region Fields
  private isNew: boolean = false;
  private readonly visa: ExampleVisa; // Note: Visa type derives from the aggregate's bounded context
  //#endregion Fields

  //#region Constructors
  constructor(props: props, passport: Passport) {
    super(props, passport);
    this.visa = passport.example.forExample(this); // Visa matches the aggregate's context
  }
  //#endregion Constructors

  //#region Methods
  public static getNewInstance<props extends ExampleProps>(
    newProps: props,
    foo: string,
    passport: Passport,
  ): Example<props> {
    const newInstance = new Example(newProps, passport);
    newInstance.markAsNew();
    newInstance.foo = foo;
    newInstance.isNew = false;
    return newInstance;
  }

  private markAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(ExampleCreatedEvent, { exampleId: this.props.id });
  }
  //#endregion Methods

  //#region Properties
  get foo(): string {
    return this.props.foo;
  }
  set foo(foo: string) {
    if (
      !this.isNew &&
      !this.visa.determineIf((permissions) => permissions.canEditExample)
    ) {
      throw new DomainSeedwork.PermissionError(
        'You do not have permission to change the foo of this example',
      );
    }
    this.props.foo = foo;
  }
  //#endregion Properties
}