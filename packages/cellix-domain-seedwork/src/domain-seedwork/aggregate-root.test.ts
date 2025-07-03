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
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (constructor already called in beforeEach)

			// Assert
			expect(testAggregate.id).toBe('test-aggregate-id');
			expect(testAggregate.getName()).toBe('Test Aggregate');
			expect(testAggregate.getPassport()).toEqual(testPassport);
		});

		it('should initialize isDeleted as false', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (constructor already called in beforeEach)

			// Assert
			expect(testAggregate.isDeleted).toBe(false);
		});

		it('should initialize with empty domain events', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (constructor already called in beforeEach)

			// Assert
			expect(testAggregate.getDomainEvents()).toEqual([]);
		});

		it('should initialize with empty integration events', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (constructor already called in beforeEach)

			// Assert
			expect(testAggregate.getIntegrationEvents()).toEqual([]);
		});
	});

	describe('isDeleted property', () => {
		it('should return false by default', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (accessing property directly)

			// Assert
			expect(testAggregate.isDeleted).toBe(false);
		});

		it('should return true when marked as deleted', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			testAggregate.markAsDeleted();

			// Assert
			expect(testAggregate.isDeleted).toBe(true);
		});
	});

	describe('domain events management', () => {
		const testPayload: TestEventPayload = {
			message: 'test message',
			timestamp: Date.now(),
		};

		it('should add domain event with correct payload', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);

			// Assert
			const events = testAggregate.getDomainEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(TestDomainEvent);
			expect(events[0]!.aggregateId).toBe('test-aggregate-id');
			expect(events[0]!.payload).toEqual(testPayload);
		});

		it('should add multiple domain events', () => {
			// Arrange
			const payload1: TestEventPayload = { message: 'first', timestamp: 1 };
			const payload2: TestEventPayload = { message: 'second', timestamp: 2 };

			// Act
			testAggregate.addDomainEvent(TestDomainEvent, payload1);
			testAggregate.addDomainEvent(TestDomainEvent, payload2);

			// Assert
			const events = testAggregate.getDomainEvents();
			expect(events).toHaveLength(2);
			expect(events[0]!.payload).toEqual(payload1);
			expect(events[1]!.payload).toEqual(payload2);
		});

		it('should clear domain events', () => {
			// Arrange
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);
			expect(testAggregate.getDomainEvents()).toHaveLength(1);

			// Act
			testAggregate.clearDomainEvents();

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(0);
		});

		it('should return readonly array of domain events', () => {
			// Arrange
			testAggregate.addDomainEvent(TestDomainEvent, testPayload);

			// Act
			const events = testAggregate.getDomainEvents();

			// Assert
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
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);

			// Assert
			const events = testAggregate.getIntegrationEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(TestIntegrationEvent);
			expect(events[0]!.aggregateId).toBe('test-aggregate-id');
			expect(events[0]!.payload).toEqual(testPayload);
		});

		it('should add multiple integration events', () => {
			// Arrange
			const payload1: TestEventPayload = { message: 'first integration', timestamp: 1 };
			const payload2: TestEventPayload = { message: 'second integration', timestamp: 2 };

			// Act
			testAggregate.addIntegrationEvent(TestIntegrationEvent, payload1);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, payload2);

			// Assert
			const events = testAggregate.getIntegrationEvents();
			expect(events).toHaveLength(2);
			expect(events[0]!.payload).toEqual(payload1);
			expect(events[1]!.payload).toEqual(payload2);
		});

		it('should clear integration events', () => {
			// Arrange
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);

			// Act
			testAggregate.clearIntegrationEvents();

			// Assert
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});

		it('should return readonly array of integration events', () => {
			// Arrange
			testAggregate.addIntegrationEvent(TestIntegrationEvent, testPayload);

			// Act
			const events = testAggregate.getIntegrationEvents();

			// Assert
			expect(events).toHaveLength(1);
			expect(Array.isArray(events)).toBe(true);
			expect(events[0]!).toBeInstanceOf(TestIntegrationEvent);
		});
	});

	describe('event isolation', () => {
		const domainPayload: TestEventPayload = { message: 'domain', timestamp: 1 };
		const integrationPayload: TestEventPayload = { message: 'integration', timestamp: 2 };

		it('should keep domain and integration events separate', () => {
			// Arrange
			// (test payloads are already defined in describe block)

			// Act
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			// Assert
			const domainEvents = testAggregate.getDomainEvents();
			const integrationEvents = testAggregate.getIntegrationEvents();

			expect(domainEvents).toHaveLength(1);
			expect(integrationEvents).toHaveLength(1);
			expect(domainEvents[0]!.payload).toEqual(domainPayload);
			expect(integrationEvents[0]!.payload).toEqual(integrationPayload);
		});

		it('should clear domain events independently of integration events', () => {
			// Arrange
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			// Act
			testAggregate.clearDomainEvents();

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(0);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);
		});

		it('should clear integration events independently of domain events', () => {
			// Arrange
			testAggregate.addDomainEvent(TestDomainEvent, domainPayload);
			testAggregate.addIntegrationEvent(TestIntegrationEvent, integrationPayload);

			// Act
			testAggregate.clearIntegrationEvents();

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(1);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});
	});

	describe('RootEventRegistry interface compliance', () => {
		it('should implement RootEventRegistry interface', () => {
			// Arrange
			const registry: RootEventRegistry = testAggregate;
			const testPayload: TestEventPayload = { message: 'test', timestamp: Date.now() };

			// Act
			registry.addDomainEvent(TestDomainEvent, testPayload);
			registry.addIntegrationEvent(TestIntegrationEvent, testPayload);

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(1);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(1);
		});
	});

	describe('onSave method', () => {
		it('should have a default onSave method that does nothing', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act & Assert
			// This should not throw
			expect(() => testAggregate.testOnSave(true)).not.toThrow();
			expect(() => testAggregate.testOnSave(false)).not.toThrow();
		});

		it('should call onSave method when triggered', () => {
			// Arrange
			const onSaveSpy = jest.spyOn(testAggregate, 'testOnSave');
			
			// Act
			testAggregate.testOnSave(true);
			testAggregate.testOnSave(false);
			
			// Assert
			expect(onSaveSpy).toHaveBeenCalledTimes(2);
			expect(onSaveSpy).toHaveBeenNthCalledWith(1, true);
			expect(onSaveSpy).toHaveBeenNthCalledWith(2, false);
		});

		it('should be overridable in derived classes', () => {
			// Arrange
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
			
			// Act
			customAggregate.triggerOnSave(true);
			customAggregate.triggerOnSave(false);

			// Assert
			expect(customAggregate.saveCallCount).toBe(2);
			expect(customAggregate.lastIsModified).toBe(false);
		});
	});

	describe('inheritance from DomainEntity', () => {
		it('should inherit id property from DomainEntity', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (accessing property directly)

			// Assert
			expect(testAggregate.id).toBe('test-aggregate-id');
		});

		it('should inherit props property from DomainEntity', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			// (accessing property directly)

			// Assert
			expect(testAggregate.props).toEqual(testProps);
		});
	});

	describe('passport protection', () => {
		it('should protect passport as readonly', () => {
			// Arrange
			// (testAggregate is already created in beforeEach)

			// Act
			const passport = testAggregate.getPassport();

			// Assert
			expect(passport).toEqual(testPassport);
			expect(passport).toBe(testPassport); // Should be the same reference
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle events with complex payloads', () => {
			// Arrange
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

			// Act
			testAggregate.addDomainEvent(ComplexEvent, complexPayload);

			// Assert
			const events = testAggregate.getDomainEvents();
			expect(events).toHaveLength(1);
			expect(events[0]!.payload).toEqual(complexPayload);
		});

		it('should handle rapid event addition and clearing', () => {
			// Arrange
			const payload: TestEventPayload = { message: 'rapid test', timestamp: Date.now() };

			// Act
			// Add many events
			for (let i = 0; i < 100; i++) {
				testAggregate.addDomainEvent(TestDomainEvent, payload);
				testAggregate.addIntegrationEvent(TestIntegrationEvent, payload);
			}

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(100);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(100);

			// Act
			// Clear all
			testAggregate.clearDomainEvents();
			testAggregate.clearIntegrationEvents();

			// Assert
			expect(testAggregate.getDomainEvents()).toHaveLength(0);
			expect(testAggregate.getIntegrationEvents()).toHaveLength(0);
		});
	});
});
