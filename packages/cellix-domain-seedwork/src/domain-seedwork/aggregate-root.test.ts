import { describe, it, expect, beforeEach } from 'vitest';
import { AggregateRoot } from './aggregate-root.ts';
import type { DomainEntityProps } from './domain-entity.ts';
import type { CustomDomainEvent } from './domain-event.ts';
import type { Visa } from '../passport-seedwork/index.ts';

class TestEvent implements CustomDomainEvent<{ foo: string }> {
    public payload: { foo: string };
    public aggregateId: string;
    constructor(aggregateId: string) {
        this.aggregateId = aggregateId;
        this.payload = { foo: '' };
    }
}

interface TestAggregateDomainPermissions {
    // testAggregate aggregate root permissions
    canCreateTestAggregates: boolean;
    canUpdateTestAggregates: boolean;
}

interface TestAggregateVisa extends Visa<TestAggregateDomainPermissions> {
    determineIf(
		func: (permissions: Readonly<TestAggregateDomainPermissions>) => boolean,
	): boolean;
}

interface BoundedContextPassport {
    forTestAggregate(root: TestAggregateEntityReference): TestAggregateVisa;
}

interface Passport {
    get boundedContext(): BoundedContextPassport;
}

interface TestAggregateProps extends DomainEntityProps {
    name: string;
}

interface TestAggregateEntityReference extends Readonly<TestAggregateProps> {}

class TestAggregate extends AggregateRoot<TestAggregateProps, Passport> implements TestAggregateEntityReference {
    private readonly visa: TestAggregateVisa;
    constructor(props: TestAggregateProps, passport: Passport) {
        super(props, passport);
        this.visa = passport.boundedContext.forTestAggregate(this);
    }

    get name(): string {
        return this.props.name;
    }

    set name(value: string) {
        if (!this.visa.determineIf(permissions => permissions.canUpdateTestAggregates)) {
            throw new Error('You do not have permission to update the name.');
        }
        this.props.name = value;
    }
}

function createMockPassport(
    overrides: Partial<TestAggregateDomainPermissions> = {}
): Passport {
    const defaultPermissions: TestAggregateDomainPermissions = {
        canCreateTestAggregates: true,
        canUpdateTestAggregates: true,
        ...overrides,
    };

    return {
        get boundedContext() {
            return {
                forTestAggregate: (_root: TestAggregateEntityReference) => ({
                    determineIf: (
                        func: (permissions: Readonly<TestAggregateDomainPermissions>) => boolean
                    ) => func(defaultPermissions),
                }),
            };
        },
    };
}

describe('AggregateRoot', () => {
    let aggregate: TestAggregate;
    const baseProps: TestAggregateProps = {
        id: 'agg-1',
        name: 'Test'
    };

    const passport = createMockPassport();

    beforeEach(() => {
        aggregate = new TestAggregate({ ...baseProps }, passport);
    });

    describe('Domain Event Management', () => {
        describe('Given an aggregate root instance', () => {
            describe('When a domain event is added', () => {
                beforeEach(() => {
                    aggregate.addDomainEvent(TestEvent, { foo: 'bar' });
                });
                it('Then the event should be present in the list of domain events', () => {
                    const events = aggregate.getDomainEvents();
                    expect(events.length).toBe(1);
                    expect(events[0]).toBeInstanceOf(TestEvent);
                    expect(events[0]?.payload).toEqual({ foo: 'bar' });
                });
            });

            describe('When domain events are cleared', () => {
                beforeEach(() => {
                    aggregate.addDomainEvent(TestEvent, { foo: 'bar' });
                    aggregate.clearDomainEvents();
                });
                it('Then the list of domain events should be empty', () => {
                    expect(aggregate.getDomainEvents().length).toBe(0);
                });
            });
        });
    });

    describe('Integration Event Management', () => {
        describe('Given an aggregate root instance', () => {
            describe('When an integration event is added', () => {
                beforeEach(() => {
                    aggregate.addIntegrationEvent(TestEvent, { foo: 'baz' });
                });
                it('Then the event should be present in the list of integration events', () => {
                    const events = aggregate.getIntegrationEvents();
                    expect(events.length).toBe(1);
                    expect(events[0]).toBeInstanceOf(TestEvent);
                    expect(events[0]?.payload).toEqual({ foo: 'baz' });
                });
            });

            describe('When integration events are cleared', () => {
                beforeEach(() => {
                    aggregate.addIntegrationEvent(TestEvent, { foo: 'baz' });
                    aggregate.clearIntegrationEvents();
                });
                it('Then the list of integration events should be empty', () => {
                    expect(aggregate.getIntegrationEvents().length).toBe(0);
                });
            });
        });
    });

    describe('isDeleted Property', () => {
        describe('Given an aggregate root instance', () => {
            describe('When the isDeleted property is set to true', () => {
                beforeEach(() => {
                    // @ts-expect-error: testing protected setter
                    aggregate.isDeleted = true;
                });
                it('Then the isDeleted getter should return true', () => {
                    expect(aggregate.isDeleted).toBe(true);
                });
            });
        });
    });

    describe('onSave Hook', () => {
        describe('Given an aggregate root instance', () => {
            describe('When the onSave method is called', () => {
                it('Then it should not throw an error (default is a no-op)', () => {
                    expect(() => aggregate.onSave(true)).not.toThrow();
                });
            });
        });
    });

    describe('Constructor/Passport', () => {
        describe('Given an aggregate root instance created with a passport value', () => {
            it('Then the passport property should be set to the provided value', () => {
                // @ts-expect-error: testing protected property
                expect(aggregate.passport).toEqual(passport);
            });
        });

        describe('Given an aggregate root instance with a passport value with permission to update test aggregates', () => {
           describe('When an aggregate field with a permission check is set', () => {
               it('Then it should not throw an error', () => {
                  const updatingTestAggregateWithPermission = () => {
                    aggregate.name = 'New Name';
                  }

                   expect(updatingTestAggregateWithPermission).not.toThrow();
               });
           });
        });

        describe('Given an aggregate root instance with a passport value without permission to update test aggregates', () => {
            describe('When an aggregate field with a permission check is set', () => {
                it('Then it should throw an error', () => {
                    const passportWithoutPermission = createMockPassport({ canUpdateTestAggregates: false });
                    aggregate = new TestAggregate({ ...baseProps }, passportWithoutPermission);

                    const updatingTestAggregateWithoutPermission = () => {
                        aggregate.name = 'New Name';
                    }

                    expect(updatingTestAggregateWithoutPermission).toThrowError('You do not have permission to update the name.');
                });
            });
        });
    });
});