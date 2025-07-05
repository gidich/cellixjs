import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import mongoose from 'mongoose';
import type { ClientSession, Model } from 'mongoose';
import { MongoUnitOfWork } from './mongo-unit-of-work.ts';
import { MongoRepositoryBase } from './mongo-repository.ts';
import type { Base } from './index.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

// Mocks for seedwork types
class AggregateRootMock extends DomainSeedwork.AggregateRoot<
	PropType,
	unknown
> {
	override getIntegrationEvents = vi.fn(() => []);

	get foo(): string {
		return this.props.foo;
	}
	set foo(foo: string) {
		this.props.foo = foo;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
}
interface MongoType extends Base {
	foo: string;
}
type PropType = DomainSeedwork.DomainEntityProps & {
	foo: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
};
class RepoMock extends MongoRepositoryBase<
	MongoType,
	PropType,
	unknown,
	AggregateRootMock
> {
	override getIntegrationEvents = vi.fn(() => []);
}

vi.mock('mongoose', async () => {
	const original = await vi.importActual<typeof import('mongoose')>('mongoose');
	return {
		...original,
		connection: {
			transaction: vi.fn(),
		},
	};
});

describe('MongoUnitOfWork', () => {
	let unitOfWork: MongoUnitOfWork<
		MongoType,
		PropType,
		unknown,
		AggregateRootMock,
		RepoMock
	>;
	let repoInstance: RepoMock;
	let eventBus: DomainSeedwork.EventBus;
	let integrationEventBus: DomainSeedwork.EventBus;
	let session: ClientSession;
	let mockModel: Model<MongoType>;
	let typeConverter: DomainSeedwork.TypeConverter<
		MongoType,
		PropType,
		unknown,
		AggregateRootMock
	>;
	``;
	const Passport = {};
	const mockRepoClass = vi.fn(
		(_passport, _model, _typeConverter, _bus, _session): RepoMock =>
			repoInstance,
	);

	let domainOperation: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		session = {} as ClientSession;
		mockModel = {
			findById: vi.fn().mockReturnValue({
				exec: vi.fn().mockResolvedValue({
					_id: 'agg-1',
					foo: 'old-foo',
				}),
			}),
		} as unknown as Model<MongoType>;
		typeConverter = vi.mocked({
			toAdapter: vi.fn(),
		    toPersistence: vi.fn().mockImplementation(() => ({
				isModified: () => true,
				save: vi.fn().mockResolvedValue({
					_id: 'agg-1',
					foo: 'old`-foo',
				}),
			})),
			toDomain: vi.fn().mockResolvedValue(new AggregateRootMock(vi.mocked({ id: 'agg-1', foo: 'old-foo' } as PropType), vi.mocked({} as unknown))),
		}) as DomainSeedwork.TypeConverter<
			MongoType,
			PropType,
			unknown,
			AggregateRootMock
		>;
		eventBus = vi.mocked({
			dispatch: vi.fn(),
			register: vi.fn(),
		}) as DomainSeedwork.EventBus;
		integrationEventBus = vi.mocked({
			dispatch: vi.fn(),
			register: vi.fn(),
		}) as DomainSeedwork.EventBus;
		repoInstance = new RepoMock(
			vi.mocked({}),
			mockModel,
			typeConverter,
			eventBus,
			session,
		);

		unitOfWork = new MongoUnitOfWork(
			eventBus,
			integrationEventBus,
			mockModel,
			typeConverter,
			mockRepoClass,
		);

		domainOperation = vi.fn(async (repo: RepoMock) => {
			const aggregate = await repo.get('agg-1');
			aggregate.foo = 'new-foo';
			await repo.save(aggregate);
		});

		vi.spyOn(mongoose.connection, 'transaction').mockImplementation(
			async (cb: (session: ClientSession) => Promise<unknown>) => {
				await cb({} as ClientSession);
			},
		);
	});

	// describe('Scenario: Successful transaction with integration events', () => {
	// 	describe('Given a repository that returns integration events after successful operation', () => {
	// 		it('Then the transaction should be committed and all integration events dispatched', async () => {
	// 			const mockEvent = {
	// 				constructor: class {},
	// 				payload: { foo: 'bar' },
	// 			};

	// 			repoInstance.getIntegrationEvents = vi.fn(() => [mockEvent]);

	// 			(mongoose.connection.transaction as Mock).mockImplementationOnce(
	// 				async (cb: (session: ClientSession) => Promise<void>) => {
	// 					await cb(session);
	// 				},
	// 			);

	// 			const domainOperation = vi.fn(async (_repo: RepoMock) => {
	// 				// Simulate domain logic
	// 			});

	// 			await unitOfWork.withTransaction(Passport, domainOperation);

	// 			expect(domainOperation).toHaveBeenCalledWith(repoInstance);
	// 			expect(integrationEventBus.dispatch).toHaveBeenCalledWith(
	// 				mockEvent.constructor,
	// 				mockEvent.payload,
	// 			);
	// 		});
	// 	});
	// });

	// describe('Scenario: Failed domain operation inside transaction', () => {
	// 	describe('Given a repository operation that throws an error', () => {
	// 		it('Then the transaction should rollback and no integration events dispatched', async () => {
	// 			const domainError = new Error('Domain failure');

	// 			(mongoose.connection.transaction as Mock).mockImplementationOnce(
	// 				async (cb: (session: ClientSession) => Promise<void>) => {
	// 					await cb(session); // Let the error propagate naturally
	// 				},
	// 			);
	// 			const domainOperation = vi.fn(async (_repo: RepoMock) => {
	// 				throw await domainError;
	// 			});

	// 			await expect(
	// 				unitOfWork.withTransaction(Passport, domainOperation),
	// 			).rejects.toThrow(domainError);
	// 			expect(integrationEventBus.dispatch).not.toHaveBeenCalled();
	// 		});
	// 	});
	// });

	// describe('Scenario: No integration events returned', () => {
	// 	describe('Given a domain operation that does not raise events', () => {
	// 		it('Then the transaction should complete successfully with no dispatches', async () => {
	// 			repoInstance.getIntegrationEvents = vi.fn(() => []);

	// 			(mongoose.connection.transaction as Mock).mockImplementationOnce(
	// 				async (cb: (session: ClientSession) => Promise<void>) => {
	// 					await cb(session);
	// 				},
	// 			);

	// 			const domainOperation = vi.fn(async (_repo: RepoMock) => {
	// 				// No events
	// 			});

	// 			await unitOfWork.withTransaction(Passport, domainOperation);

	// 			expect(integrationEventBus.dispatch).not.toHaveBeenCalled();
	// 		});
	// 	});
	// });

	//
	// Scenario 1: Initializing the MongoUnitOfWork
	//
	describe('Scenario: Initializing the MongoUnitOfWork', () => {
		describe('Given all dependencies are provided', () => {
			describe('When MongoUnitOfWork is instantiated', () => {
				it('Then it stores and exposes the dependencies correctly', () => {
					//
					// Assert
					expect(unitOfWork.model).toBe(mockModel);
					expect(unitOfWork.typeConverter).toBe(typeConverter);
					expect(unitOfWork.bus).toBe(eventBus);
					expect(unitOfWork.integrationEventBus).toBe(integrationEventBus);
					expect(unitOfWork.repoClass).toBe(mockRepoClass);
				});
			});
		});
	});

	//
	// Scenario 2: Domain operations without events
	//
	describe('Scenario: Domain operations without events', () => {
		describe('Given a domain operation that emits no domain or integration events', () => {
			describe('When the operation completes successfully', () => {
				it('Then the transaction is committed and no events are dispatched', async () => {
					//
					// Arrange
					repoInstance.getIntegrationEvents = vi.fn(() => []);
					(mongoose.connection.transaction as Mock).mockImplementationOnce(
						async (cb: (session: ClientSession) => Promise<void>) => {
							await cb(session);
						},
					);
					//
					// Act
					await unitOfWork.withTransaction(Passport, domainOperation);

					//
					// Assert
					expect(domainOperation).toHaveBeenCalledWith(repoInstance);
					expect(integrationEventBus.dispatch).not.toHaveBeenCalled();
				});
			});

			describe('When the operation throws an error', () => {
				it('Then the transaction is rolled back and no events are dispatched', async () => {
					//
					// Arrange
					repoInstance.getIntegrationEvents = vi.fn(() => []);
					const domainError = new Error('Domain failure');
					(mongoose.connection.transaction as Mock).mockImplementationOnce(
						async (cb: (session: ClientSession) => Promise<void>) => {
							await cb(session);
						},
					);
					const domainOperation = vi.fn(async (_repo: RepoMock) => {
						throw await domainError;
					});

					//
					// Act & Assert
					await expect(
						unitOfWork.withTransaction(Passport, domainOperation),
					).rejects.toThrow(domainError);
					expect(integrationEventBus.dispatch).not.toHaveBeenCalled();
				});
			});
		});
	});

	// Scenario 3: Domain operations with integration events
	//
	describe('Scenario: Domain operations with integration events', () => {
		describe('Given integration events are emitted during the domain operation', () => {
			describe('When the transaction completes successfully', () => {
				it('Then all integration events are dispatched after the transaction commits', async () => {
					//
					// Arrange
					const event1 = { constructor: class {}, payload: { foo: 'bar1' } };
					const event2 = { constructor: class {}, payload: { foo: 'bar2' } };
					repoInstance.getIntegrationEvents = vi.fn(() => [event1, event2]);
					(mongoose.connection.transaction as Mock).mockImplementationOnce(
						async (cb: (session: ClientSession) => Promise<void>) => {
							await cb(session);
						},
					);
					const domainOperation = vi.fn(async (_repo: RepoMock) =>
						console.log('Domain operation executed'),
					);

					//
					// Act
					await unitOfWork.withTransaction(Passport, domainOperation);

					//
					// Assert
					expect(integrationEventBus.dispatch).toHaveBeenCalledTimes(2);
					expect(integrationEventBus.dispatch).toHaveBeenNthCalledWith(
						1,
						event1.constructor,
						event1.payload,
					);
					expect(integrationEventBus.dispatch).toHaveBeenNthCalledWith(
						2,
						event2.constructor,
						event2.payload,
					);
				});
			});

			// NodeEventBusImpl.dispatch is not expected to throw errors from integration event handler failures.
			// Testing the behavior of handler errors is outside the scope of MongoUnitOfWork—see node-event-bus.test.ts for that.
			// This test only verifies that if the event bus dispatch itself fails (which should never happen in real usage), the error is propagated by the unit of work.
			describe('When integration event dispatch fails', () => {
				it('Then the error from dispatch is propagated and the transaction is not rolled back by the unit of work', async () => {
					//
					// Arrange
					const event1 = { constructor: class {}, payload: { foo: 'bar1' } };
					const event2 = { constructor: class {}, payload: { foo: 'bar2' } };
					repoInstance.getIntegrationEvents = vi.fn(() => [event1, event2]);
					(mongoose.connection.transaction as Mock).mockImplementationOnce(
						async (cb: (session: ClientSession) => Promise<void>) => {
							await cb(session);
						},
					);
					// Simulate integrationEventBus.dispatch failing for the first event
					(integrationEventBus.dispatch as Mock)
						.mockRejectedValueOnce(new Error('fail1'))
						.mockResolvedValueOnce(undefined);

					//
					// Act & Assert
					await expect(
						unitOfWork.withTransaction(Passport, domainOperation),
					).rejects.toThrow('fail1');
					expect(integrationEventBus.dispatch).toHaveBeenCalledTimes(1);
				});
			});

			describe('When multiple integration events are emitted and all succeed', () => {
				it('Then all are dispatched after the transaction', async () => {
					//
					// Arrange
					const event1 = { constructor: class {}, payload: { foo: 'bar1' } };
					const event2 = { constructor: class {}, payload: { foo: 'bar2' } };
					repoInstance.getIntegrationEvents = vi.fn(() => [event1, event2]);
					(mongoose.connection.transaction as Mock).mockImplementationOnce(
						async (cb: (session: ClientSession) => Promise<void>) => {
							await cb(session);
						},
					);
					(integrationEventBus.dispatch as Mock)
						.mockResolvedValueOnce(undefined)
						.mockResolvedValueOnce(undefined);

					const domainOperation = vi.fn(async (_repo: RepoMock) =>
						console.log('Domain operation executed'),
					);

					//
					// Act
					await unitOfWork.withTransaction(Passport, domainOperation);

					//
					// Assert
					expect(integrationEventBus.dispatch).toHaveBeenCalledTimes(2);
				});
			});
		});
	});
});
