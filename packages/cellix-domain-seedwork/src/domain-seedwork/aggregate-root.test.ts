import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AggregateRoot } from './aggregate-root.ts';
import { DomainSeedwork } from '../index.ts';

class TestDomainEvent extends DomainSeedwork.CustomDomainEventImpl<TestAggregateCreatedProps> {}

interface TestAggregateUpdatedProps {
	testAggregateId: string;
	foo: string;
}

class TestAggregateUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<TestAggregateUpdatedProps> {}

interface TestAggregateCreatedProps {
	foo: string;
}
class TestAggregateCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<TestAggregateCreatedProps> {}

interface TestAggregateDeletedProps {
	testAggregateId: string;
}
class TestAggregateDeletedEvent extends DomainSeedwork.CustomDomainEventImpl<TestAggregateDeletedProps> {}

interface TestAggregateProps extends DomainSeedwork.DomainEntityProps {
	foo: string;
	bar?: string | undefined;
}

interface TestAggregateEntityReference extends Readonly<TestAggregateProps> {}

class TestAggregate<props extends TestAggregateProps>
	extends AggregateRoot<props, unknown>
	implements TestAggregateEntityReference
{
	get foo(): string {
		return this.props.foo;
	}

	public override onSave(isModified: boolean): void {
		if (isModified) {
			this.addIntegrationEvent(TestAggregateUpdatedEvent, {
				testAggregateId: this.props.id,
				foo: this.props.foo,
			});
		}
	}

	public requestDelete(): void {
		super.isDeleted = true;
		this.addIntegrationEvent(TestAggregateDeletedEvent, {
			testAggregateId: this.props.id,
		});
	}
}

// function createMockPassport(
//     overrides: Partial<TestAggregateDomainPermissions> = {}
// ): Passport {
//     const defaultPermissions: TestAggregateDomainPermissions = {
//         canCreateTestAggregates: true,
//         canUpdateTestAggregates: true,
//         canDeleteTestAggregates: true,
//         ...overrides,
//     };

//     return {
//         get boundedContext() {
//             return {
//                 forTestAggregate: (_root: TestAggregateEntityReference) => ({
//                     determineIf: (
//                         func: (permissions: Readonly<TestAggregateDomainPermissions>) => boolean
//                     ) => func(defaultPermissions),
//                 }),
//             };
//         },
//     };
// }

function findEvent<T>(
	events: readonly unknown[],
	eventClass: new (aggregateId: string) => T,
): T | undefined {
	return events.find((e) => e instanceof eventClass) as T | undefined;
}

function expectEventEmitted<T>(
	events: readonly unknown[],
	eventClass: new (aggregateId: string) => T,
	payloadMatcher?: (event: T) => void,
) {
	const event = findEvent(events, eventClass);
	expect(event).toBeDefined();
	expect(event).toBeInstanceOf(eventClass);
	if (payloadMatcher) {
		payloadMatcher(event as T);
	}
}

function expectNoEventEmitted<T>(
	events: readonly unknown[],
	eventClass: new (aggregateId: string) => T,
) {
	const event = findEvent(events, eventClass);
	expect(event).toBeUndefined();
}

describe('AggregateRoot', () => {
	let aggregate: TestAggregate<TestAggregateProps>;
	const baseProps = vi.mocked({
		id: 'agg-1',
		foo: 'bar',
	} as TestAggregateProps);

	const mockedPassport = vi.mocked({} as unknown);

	beforeEach(() => {
		aggregate = new TestAggregate(baseProps, mockedPassport);
	});

	describe('Scenario: Constructing an Aggregate Root', () => {
		describe('Given a set of initial properties and some type of passport', () => {
			describe('When the aggregate root is constructed', () => {
				it('Then it should initialize the properties correctly', () => {
					const aggregate = new TestAggregate(baseProps, mockedPassport);
					expect(aggregate.id).toBe(baseProps.id);
					expect(aggregate.foo).toBe(baseProps.foo);
				});
			});
		});
	});

	describe('Scenario: Managing Domain Events on an Aggregate Root', () => {
		describe('Given an aggregate root instance', () => {
			describe('When a domain event is added', () => {
				it('Then it should add a domain event to the aggregate domain events and not have any integration events', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: aggregate.foo });
					expectEventEmitted(
						aggregate.getDomainEvents(),
						TestDomainEvent,
						(event) => {
							expect(event.payload).toEqual({ foo: baseProps.foo });
						},
					);
					expect(aggregate.getIntegrationEvents()).toHaveLength(0);
				});
			});

			describe('When multiple domain events are added', () => {
				it('Then it should have multiple domain events on the aggregate and not have any integration events', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'bar' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'baz' });
					expect(aggregate.getDomainEvents()).toHaveLength(2);
					for (const event of aggregate.getDomainEvents()) {
						expect(event).toBeInstanceOf(TestDomainEvent);
					}
					expect(aggregate.getIntegrationEvents()).toHaveLength(0);
				});
				it('And it should maintain order of domain events', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'first' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'second' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'third' });
					const events = aggregate
						.getDomainEvents()
						.map((e) => (e instanceof TestDomainEvent ? e : null));
					expect(events[0]?.payload).toEqual({ foo: 'first' });
					expect(events[1]?.payload).toEqual({ foo: 'second' });
					expect(events[2]?.payload).toEqual({ foo: 'third' });
				});
			});

			describe('When domain events are added and then cleared', () => {
				it('Then it should clear all domain events from the aggregate', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'bar' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'baz' });
					expect(aggregate.getDomainEvents()).toHaveLength(2);
					aggregate.clearDomainEvents();
					expectNoEventEmitted(aggregate.getDomainEvents(), TestDomainEvent);
				});
			});

            describe('When no domain events are added but domain events are cleared', () => {
				it('Then it should not emit any domain events', () => {
					aggregate.clearDomainEvents();
					expect(aggregate.getDomainEvents()).toHaveLength(0);
				});
			});

			describe('When domain events and integration events exist and domain events are cleared', () => {
				it('Then it should clear all domain events from the aggregate but not integration events', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'bar' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'baz' });
					aggregate.addIntegrationEvent(TestAggregateCreatedEvent, {
						foo: 'bar',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					expect(aggregate.getDomainEvents()).toHaveLength(2);
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
					aggregate.clearDomainEvents();
					expectNoEventEmitted(aggregate.getDomainEvents(), TestDomainEvent);
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
				});
			});

			describe('When domain events and integration events exist and both domain events and integration events are cleared', () => {
				it('Then it should clear all domain events and all integration events from the aggregate', () => {
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'bar' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'baz' });
					aggregate.addIntegrationEvent(TestAggregateCreatedEvent, {
						foo: 'bar',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					expect(aggregate.getDomainEvents()).toHaveLength(2);
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
					aggregate.clearDomainEvents();
					aggregate.clearIntegrationEvents();
					expect(aggregate.getDomainEvents()).toHaveLength(0);
					expect(aggregate.getIntegrationEvents()).toHaveLength(0);
					expectNoEventEmitted(aggregate.getDomainEvents(), TestDomainEvent);
					expectNoEventEmitted(
						aggregate.getIntegrationEvents(),
						TestAggregateCreatedEvent,
					);
					expectNoEventEmitted(
						aggregate.getIntegrationEvents(),
						TestAggregateUpdatedEvent,
					);
				});
			});
		});
	});

	describe('Scenario: Managing Integration Events on an Aggregate Root', () => {
		describe('Given an aggregate root instance', () => {
			describe('When an integration event is added', () => {
				it('Then it should add an integration event to the aggregate integration events and not have any domain events', () => {
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					expectEventEmitted(
						aggregate.getIntegrationEvents(),
						TestAggregateUpdatedEvent,
						(event) => {
							expect(event.payload).toEqual({
								testAggregateId: 'agg-1',
								foo: 'baz',
							});
						},
					);
					expect(aggregate.getDomainEvents()).toHaveLength(0);
				});
			});

			describe('When multiple integration events are added', () => {
				it('Then it should have multiple integration events on the aggregate and not have any domain events', () => {
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'bar',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
					for (const event of aggregate.getIntegrationEvents()) {
						expect(event).toBeInstanceOf(TestAggregateUpdatedEvent);
					}
					expect(aggregate.getDomainEvents()).toHaveLength(0);
				});

				it('should maintain order of integration events', () => {
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'first',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'second',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'third',
					});
					const events = aggregate
						.getIntegrationEvents()
						.map((e) => (e instanceof TestAggregateUpdatedEvent ? e : null));
					expect(events[0]?.payload).toEqual({
						testAggregateId: 'agg-1',
						foo: 'first',
					});
					expect(events[1]?.payload).toEqual({
						testAggregateId: 'agg-1',
						foo: 'second',
					});
					expect(events[2]?.payload).toEqual({
						testAggregateId: 'agg-1',
						foo: 'third',
					});
				});
			});

			describe('When integration events are cleared', () => {
				it('Then it should clear all integration events from the aggregate', () => {
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'bar',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
					aggregate.clearIntegrationEvents();
					expectNoEventEmitted(
						aggregate.getIntegrationEvents(),
						TestAggregateUpdatedEvent,
					);
				});
			});

			describe('When integration events and domain events exist and integration events are cleared', () => {
				it('Then it should clear all integration events from the aggregate but not domain events', () => {
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'bar',
					});
					aggregate.addIntegrationEvent(TestAggregateUpdatedEvent, {
						testAggregateId: 'agg-1',
						foo: 'baz',
					});
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'bar' });
					aggregate.addDomainEvent(TestDomainEvent, { foo: 'baz' });
					expect(aggregate.getIntegrationEvents()).toHaveLength(2);
					expect(aggregate.getDomainEvents()).toHaveLength(2);
					aggregate.clearIntegrationEvents();
					expectNoEventEmitted(
						aggregate.getIntegrationEvents(),
						TestAggregateUpdatedEvent,
					);
					expect(aggregate.getDomainEvents()).toHaveLength(2);
				});
			});
		});
	});

	describe('Scenario: Saving an Aggregate Root', () => {
		describe('Given an aggregate root instance', () => {
			describe('When the onSave method is called with true', () => {
				it('Then it should not throw an error (default is a no-op)', () => {
					expect(() => aggregate.onSave(true)).not.toThrow();
				});
				it('And it should emit the onSave event', () => {
					const spy = vi.spyOn(aggregate, 'addIntegrationEvent');
					aggregate.onSave(true);
					expect(spy).toHaveBeenCalledWith(TestAggregateUpdatedEvent, {
						testAggregateId: aggregate.id,
						foo: aggregate.foo,
					});
				});
			});
			describe('When the onSave method is called with false', () => {
				it('Then it should not throw an error (default is a no-op)', () => {
					expect(() => aggregate.onSave(false)).not.toThrow();
				});
				it('And it should not emit the onSave event', () => {
					const spy = vi.spyOn(aggregate, 'addIntegrationEvent');
					aggregate.onSave(false);
					expect(spy).not.toHaveBeenCalled();
				});
			});
		});
	});

	describe('Scenario: Deleting an Aggregate Root', () => {
		describe('Given an aggregate root instance', () => {
			describe('When the aggregate root has not requested deletion', () => {
				it('Then the isDeleted property should be false', () => {
					expect(aggregate.isDeleted).toBe(false);
				});
			});
			describe('When the aggregate root requests to be deleted', () => {
				it('Then the isDeleted property should be set to true', () => {
					expect(aggregate.isDeleted).toBe(false);
					aggregate.requestDelete();
					expect(aggregate.isDeleted).toBe(true);
				});
			});
		});
	});
});
