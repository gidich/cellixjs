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

interface TestProps extends DomainEntityProps {
    name: string;
}

interface TestEntityReference extends Readonly<TestProps> {}

class TestAggregate extends AggregateRoot<TestProps, unknown> implements TestEntityReference {
    private readonly visa: Visa<unknown>;
    constructor(props: TestProps, passport: unknown) {
        super(props, passport);
        this.visa = {} as Visa<unknown>;
    }

    get name(): string {
        return this.props.name;
    }


}

describe('AggregateRoot', () => {
    let aggregate: TestAggregate;
    const baseProps: TestProps = {
        id: 'agg-1',
        name: 'Test'
    };

    beforeEach(() => {
        aggregate = new TestAggregate({ ...baseProps }, 'passport');
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
                expect(aggregate.passport).toBe('passport');
            });
        });
    });
});