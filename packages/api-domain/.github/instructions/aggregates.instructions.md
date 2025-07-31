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
- Use kebab-case for filename matching the `{aggregate}.aggregate.ts` pattern.
- Export the aggregate root class and related types from the context's `index.ts`.
- Document all public APIs with JSDoc comments.
- Do not include infrastructure, persistence, or application service code.

## Implementation Guidelines
- Each file should contain a *Props* interface, an *EntityReference* interface, and an *AggregateRoot* class.

### Props
- Each aggregate root must define a *Props* interface that extends `DomainSeedwork.DomainEntityProps`.
- The *Props* interface should include all relevant properties for the aggregate root, using appropriate types.
- *Props* can be optional; denoted by a union type (e.g., `foo: string | undefined`).
- Immutable properties should be marked with `readonly`.
- Prop Types include:
    - primitives: simple TypeScript types (`string`, `boolean`, `Date`, etc.)
    - entities: fields which contain an entity type on that aggregate; uses the entity's *Props* interface (e.g `ExampleEntityProps`)
    - prop arrays:  fields which contain arrays of an entity type on that aggregate (e.g `DomainSeedwork.PropArray<ExampleEntityProps>`)
    - reference fields: fields which refer to other aggregates (e.g `Readonly<ExampleAggregateEntityReference>`)

### EntityReference
- Each aggregate root must define an *EntityReference* interface that extends its *Props* interface wrapped in `Readonly<>`.
- The *EntityReference* interface serves as the read-only view of the aggregate root's properties.
- The *EntityReference* omits fields that are either: entities, prop arrays, or reference fields.
    - The interface provides readonly replacements for these omitted fields which use that field's *EntityReference* type wrapped in `Readonly<>`.
    - Example: If the aggregate has a field `bar` of type `ExampleEntityProps`, the *EntityReference* will have a `readonly` field `bar` of type `Readonly<ExampleEntityReference>`.

### AggregateRoot
- Each aggregate root must define an *AggregateRoot* class that extends `DomainSeedwork.AggregateRoot<Props, Passport>` and implements the *EntityReference* interface.
    - Note that `Props` here extends the aggregate's *Props* interface.
- Organize your *AggregateRoot* class with the following regions and order:
  1. **Fields**: Private/protected fields, including the Visa instance and any state flags (e.g., `isNew`).
    - Visa type is derived from the aggregate's bounded context
    - isNew is a private boolean member for tracking the creation state of the aggregate
  2. **Constructors**: Public constructor, initializing props, passport, and Visa.
    - The constructor should accept props and passport, and initialize the Visa using the passport's context.
  3. **Methods**: Static factory creation, can include publicly exposed domain behavior (e.g., `getNewInstance`, `markAsNew`).
    - Methods are able to call other methods within the aggregate root, including private methods, to enforce invariants and encapsulate domain behavior.
  6. **Properties (Getters/Setters)**: Expose state, enforce permission checks in setters, and leverage value objects/entities as needed.
    - Getters/Setters match the name of the aggregate's properties, and should adhere to the types defined in the *Props* interface.
    - Setters can include validation logic via `ValueObjects` and permission checks via `Visa`, as well as include domain-specific behavior as needed.
    - Immutable properties can omit setters.

## Implementation Examples

### Props
Example implementation for a *Props* interface for an aggregate:
```typescript
export interface MyAggregateProps extends DomainSeedwork.DomainEntityProps {
  requiredProperty: string;
  optionalProperty: string | undefined;
  exampleEntity: ExampleEntityProps;
  exampleEntityArray: DomainSeedwork.PropArray<ExampleEntityProps>;
  exampleReference: Readonly<ExampleAggregateEntityReference>;
  readonly createdAt: Date;
  // ...other properties...
}
```

### EntityReference
Example implementation for an *EntityReference* interface for an aggregate:
```typescript
export interface MyAggregateEntityReference extends Readonly<
  Omit<MyAggregateProps, 'exampleEntity' | 'exampleEntityArray' | 'exampleReference'>
> {
    readonly exampleEntity: Readonly<ExampleEntityReference>;
    readonly exampleEntityArray: ReadonlyArray<ExampleEntityReference>;
    readonly exampleReference: Readonly<ExampleAggregateEntityReference>;
}
```

### AggregateRoot
Example implementation for an *AggregateRoot* class:
```typescript
export class MyAggregateRoot<props extends MyAggregateProps> 
    extends DomainSeedwork.AggregateRoot<props, Passport> 
        implements MyAggregateEntityReference {
    //#region Fields
    private isNew: boolean = false;
    private readonly visa: MyVisa;
    //#endregion Fields

    //#region Constructor
    constructor(props: props, passport: Passport) {
        super(props, passport);
        this.visa = passport.context.forAggregate(this);
    }
    //#endregion Constructor

    //#region Methods
    public static getNewInstance<props extends MyProps>(
        newProps: props,
        // required params
        passport: Passport
        ): MyAggregate<props> {
        const aggregate = new MyAggregate(newProps, passport);
        aggregate.markAsNew();
        // set required properties
        aggregate.isNew = false;
        return aggregate;
    }

    private markAsNew(): void {
        this.isNew = true;
        // optionally emit integration event for aggregate creation
        this.addIntegrationEvent(MyAggregateCreatedEvent, {
            // event payload
            aggregateId: this.id
        });
    }
    //#endregion Methods

    //#region Properties
    get requiredProperty(): string {
        return this.props.requiredProperty;
    }
    set requiredProperty(value: string) {
        if (!this.isNew && !this.visa.determineIf(
            permissions => permissions.requiredPermission
        )) {
            throw new DomainSeedwork.PermissionError(
                'You do not have permission to change requiredProperty'
            );
        }
        this.props.requiredProperty = value;
        // optionally emit domain event for a property change
        this.addDomainEvent(MyAggregateRequiredPropertyUpdatedEvent, {
            // event payload
            aggregateId: this.id,
            requiredProperty: this.requiredProperty,
        });
    }
    // Other properties go here...
}
```

### Value Objects
Setters can use *ValueObjects* to provide input validation for their properties. See `value-objects.instructions.md` for more information.
For example:
```typescript
import * as ValueObjects from './my-aggregate.value-objects.ts';

set requiredProperty(value: string) {
    if (!this.isNew && !this.visa.determineIf(
        permissions => permissions.requiredPermission
    )) {
        throw new DomainSeedwork.PermissionError(
            'You do not have permission to change requiredProperty'
        );
    }
    this.props.requiredProperty = new ValueObjects.RequiredProperty(value).valueOf();
}

```

### Permission Checks
Setters can enforce permission checks on the aggregate's *Visa* as needed.
For example:
```typescript
set someProperty(value: string) {
  if (!this.isNew && !this.visa.determineIf(
    permissions => permissions.requiredPermission // Any predicate using the bounded context's domain permissions can be applied here
  )) {
    throw new DomainSeedwork.PermissionError(
      'You do not have permission to change this property'
    );
  }
  this.props.someProperty = value;
}
```