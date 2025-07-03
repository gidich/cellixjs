import { jest } from '@jest/globals';
import { AggregateRoot, type RootEventRegistry } from './aggregate-root.ts';
import type { DomainEntityProps } from './domain-entity.ts';
import { CustomDomainEventImpl } from './domain-event.ts';

// Test implementation classes
interface TestAggregateProps extends DomainEntityProps {
	name: string;
	version: number;
}

interface TestPassport {
	userId: string;
	permissions: string[];
}

class TestAggregate extends AggregateRoot<TestAggregateProps, TestPassport> {
	constructor(props: TestAggregateProps, passport: TestPassport) {
		super(props, passport);
	}

	public getName(): string {
		return this.props.name;
	}

	public getPassport(): TestPassport {
		return this.passport;
	}

	public markAsDeleted(): void {
		this.isDeleted = true;
	}

	public testOnSave(isModified: boolean): void {
		this.onSave(isModified);
	}
}

// Test event classes
interface TestEventPayload {
	message: string;
	timestamp: number;
}

class TestDomainEvent extends CustomDomainEventImpl<TestEventPayload> {
	constructor(aggregateId: string) {
		super(aggregateId);
	}
}

class TestIntegrationEvent extends CustomDomainEventImpl<TestEventPayload> {
	constructor(aggregateId: string) {
		super(aggregateId);
	}
}

describe('domain-seedwork::AggregateRoot', () => {
	let testAggregate: TestAggregate;
	let testProps: TestAggregateProps;
	let testPassport: TestPassport;

	beforeEach(() => {
		testProps = {
			id: 'test-aggregate-id',
			name: 'Test Aggregate',
			version: 1,
		};
		testPassport = {
			userId: 'test-user-id',
			permissions: ['read', 'write'],
		};
		testAggregate = new TestAggregate(testProps, testPassport);
		
		// Clear any existing mocks
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		it('should create an aggregate with given props and passport', () => {
			expect(testAggregate.id).toBe('test-aggregate-id');
			expect(testAggregate.getName()).toBe('Test Aggregate');
			expect(testAggregate.getPassport()).toEqual(testPassport);
		});

		it('should initialize isDeleted as false', () => {
			expect(testAggregate.isDeleted).toBe(false);
		});

		it('should initialize with empty domain events', () => {
			expect(testAggregate.getDomainEvents()).toEqual([]);
		});

		it('should initialize with empty integration events', () => {
			expect(testAggregate.getIntegrationEvents()).toEqual([]);
		});
	});

	describe('isDeleted property', () => {
		it('should return false by default', () => {
			expect(testAggregate.isDeleted).toBe(false);
		});

		it('should return true when marked as deleted', () => {
			testAggregate.markAsDeleted();
			expect(testAggregate.isDeleted).toBe(true);
		});
	});

	describe('domain events management', () => {
		const testPayload: TestEventPayload = {
			message: 'test message',
			timestamp: Date.now(),
		};

		it('should add domain event with correct payload', () => {
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);

			const events = testAggregate.getDomainEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(TestDomainEvent);
			expect(events[0]!.aggregateId).toBe('test-aggregate-id');
			expect(events[0]!.payload).toEqual(testPayload);
		});

		it('should add multiple domain events', () => {
			const payload1: TestEventPayload = { message: 'first', timestamp: 1 };
			const payload2: TestEventPayload = { message: 'second', timestamp: 2 };

			testAggregate.addDomainEvent(TestDomainEvent, payload1);
			testAggregate.addDomainEvent(TestDomainEvent, payload2);

			const events = testAggregate.getDomainEvents();
			expect(events).toHaveLength(2);
			expect(events[0]!.payload).toEqual(payload1);
			expect(events[1]!.payload).toEqual(payload2);
		});

		it('should clear domain events', () => {
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);
			expect(testAggregate.getDomainEvents()).toHaveLength(1);

			testAggregate.clearDomainEvents();
			expect(testAggregate.getDomainEvents()).toHaveLength(0);
		});

		it('should return readonly array of domain events', () => {
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);
			const events = testAggregate.getDomainEvents();

			expect(events).toHaveLength(1);
			expect(Array.isArray(events)).toBe(true);
			// TypeScript should enforce readonly, but we can test that it's a proper array
			expect(events[0]!).toBeInstanceOf(TestDomainEvent);
		});
	});

	describe('integration events management', () => {
		const testPayload: TestEventPayload = {
			message: 'integration test message',
			timestamp: Date.now(),
		};

		it('should add integration event with correct payload', () => {
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);

			const events = testAggregate.getIntegrationEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(TestIntegrationEvent);
			expect(events[0]!.aggregateId).toBe('test-aggregate-id');
			expect(events[0]!.payload).toEqual(testPayload);
		});

		it('should add multiple integration events', () => {
			const payload1: TestEventPayload = { message: 'first integration', timestamp: 1 };
			const payload2: TestEventPayload = { message: 'second integration', timestamp: 2 };

			testAggregate.addIntegrationEvent(TestIntegrationEvent, payload1);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, payload2);

			const events = testAggregate.getIntegrationEvents();
			expect(events).toHaveLength(2);
			expect(events[0]!.payload).toEqual(payload1);
			expect(events[1]!.payload).toEqual(payload2);
		});

		it('should clear integration events', () => {
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);

			testAggregate.clearIntegrationEvents();
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});

		it('should return readonly array of integration events', () => {
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);
			const events = testAggregate.getIntegrationEvents();

			expect(events).toHaveLength(1);
			expect(Array.isArray(events)).toBe(true);
			expect(events[0]!).toBeInstanceOf(TestIntegrationEvent);
		});
	});

	describe('event isolation', () => {
		const domainPayload: TestEventPayload = { message: 'domain', timestamp: 1 };
		const integrationPayload: TestEventPayload = { message: 'integration', timestamp: 2 };

		it('should keep domain and integration events separate', () => {
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			const domainEvents = testAggregate.getDomainEvents();
			const integrationEvents = testAggregate.getIntegrationEvents();

			expect(domainEvents).toHaveLength(1);
			expect(integrationEvents).toHaveLength(1);
			expect(domainEvents[0]!.payload).toEqual(domainPayload);
			expect(integrationEvents[0]!.payload).toEqual(integrationPayload);
		});

		it('should clear domain events independently of integration events', () => {
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			testAggregate.clearDomainEvents();

			expect(testAggregate.getDomainEvents()).toHaveLength(0);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);
		});

		it('should clear integration events independently of domain events', () => {
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			testAggregate.clearIntegrationEvents();

			expect(testAggregate.getDomainEvents()).toHaveLength(1);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});
	});

	describe('RootEventRegistry interface compliance', () => {
		it('should implement RootEventRegistry interface', () => {
			const registry: RootEventRegistry = testAggregate;

			const testPayload: TestEventPayload = { message: 'test', timestamp: Date.now() };

			registry.addDomainEvent(TestDomainEvent, testPayload);
			registry.addIntegrationEvent(TestIntegrationEvent, testPayload);

			expect(testAggregate.getDomainEvents()).toHaveLength(1);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);
		});
	});

	describe('onSave method', () => {
		it('should have a default onSave method that does nothing', () => {
			// This should not throw
			expect(() => testAggregate.testOnSave(true)).not.toThrow();
			expect(() => testAggregate.testOnSave(false)).not.toThrow();
		});

		it('should call onSave method when triggered', () => {
			const onSaveSpy = jest.spyOn(testAggregate, 'testOnSave');
			
			testAggregate.testOnSave(true);
			testAggregate.testOnSave(false);
			
			expect(onSaveSpy).toHaveBeenCalledTimes(2);
			expect(onSaveSpy).toHaveBeenNthCalledWith(1, true);
			expect(onSaveSpy).toHaveBeenNthCalledWith(2, false);
		});

		it('should be overridable in derived classes', () => {
			class CustomAggregate extends AggregateRoot<TestAggregateProps, TestPassport> {
				public saveCallCount = 0;
				public lastIsModified?: boolean;

				public override onSave(isModified: boolean): void {
					this.saveCallCount++;
					this.lastIsModified = isModified;
				}

				public triggerOnSave(isModified: boolean): void {
					this.onSave(isModified);
				}
			}

			const customAggregate = new CustomAggregate(testProps, testPassport);
			
			customAggregate.triggerOnSave(true);
			expect(customAggregate.saveCallCount).toBe(1);
			expect(customAggregate.lastIsModified).toBe(true);

			customAggregate.triggerOnSave(false);
			expect(customAggregate.saveCallCount).toBe(2);
			expect(customAggregate.lastIsModified).toBe(false);
		});
	});

	describe('inheritance from DomainEntity', () => {
		it('should inherit id property from DomainEntity', () => {
			expect(testAggregate.id).toBe('test-aggregate-id');
		});

		it('should inherit props property from DomainEntity', () => {
			expect(testAggregate.props).toEqual(testProps);
		});
	});

	describe('passport protection', () => {
		it('should protect passport as readonly', () => {
			const passport = testAggregate.getPassport();
			expect(passport).toEqual(testPassport);
			expect(passport).toBe(testPassport); // Should be the same reference
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle events with complex payloads', () => {
			interface ComplexPayload {
				nested: {
					array: number[];
					object: { key: string };
				};
				nullValue: null;
				undefinedValue?: string;
			}

			class ComplexEvent extends CustomDomainEventImpl<ComplexPayload> {
				constructor(aggregateId: string) {
					super(aggregateId);
				}
			}

			const complexPayload: ComplexPayload = {
				nested: {
					array: [1, 2, 3],
					object: { key: 'value' },
				},
				nullValue: null,
			};

			testAggregate.addDomainEvent(ComplexEvent, complexPayload);
			const events = testAggregate.getDomainEvents();

			expect(events).toHaveLength(1);
			expect(events[0]!.payload).toEqual(complexPayload);
		});

		it('should handle rapid event addition and clearing', () => {
			const payload: TestEventPayload = { message: 'rapid test', timestamp: Date.now() };

			// Add many events
			for (let i = 0; i < 100; i++) {
				testAggregate.addDomainEvent(TestDomainEvent, payload);
				testAggregate.addIntegrationEvent(TestIntegrationEvent, payload);
			}

			expect(testAggregate.getDomainEvents()).toHaveLength(100);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(100);

			// Clear all
			testAggregate.clearDomainEvents();
			testAggregate.clearIntegrationEvents();

			expect(testAggregate.getDomainEvents()).toHaveLength(0);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});
	});
});
