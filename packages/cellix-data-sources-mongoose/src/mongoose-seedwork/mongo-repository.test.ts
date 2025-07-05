import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { MongoRepositoryBase } from './mongo-repository.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type mongoose from 'mongoose';
import type { Base } from './base.ts';

// Minimal Base (MongoType)
interface TestMongoType extends Base {
	foo: string;
}

// Minimal DomainEntityProps
interface TestProps {
	id: string;
	foo: string;
}
const passport = vi.mocked({} as unknown);
// Minimal concrete AggregateRoot for testing
class DummyAggregateRoot extends DomainSeedwork.AggregateRoot<
	TestProps,
	typeof passport
> {
	override onSave = vi.fn();
	// Expose protected methods as public for testing
	public override getDomainEvents() {
		return super.getDomainEvents();
	}
	public override clearDomainEvents() {
		return super.clearDomainEvents();
	}
	public override getIntegrationEvents() {
		return super.getIntegrationEvents();
	}
	public override clearIntegrationEvents() {
		return super.clearIntegrationEvents();
	}

	public requestDelete() {
		super.isDeleted = true;
	}
}

class TestDomainEvent1 {}
class TestDomainEvent2 {}

// All dependencies mocked with vi.mocked({})
const model = {
	findById: vi.fn().mockReturnValue({
		exec: vi.fn().mockResolvedValue({
			_id: 'test-id',
			foo: 'test-foo',
		}),
	}),
	deleteOne: vi.fn().mockReturnValue({
		exec: vi.fn().mockResolvedValue({}),
	}),
} as unknown as mongoose.Model<TestMongoType>;
const typeConverter = vi.mocked({
	toDomain: vi.fn(),
	toAdapter: vi.fn(),
	toPersistence: vi.fn(),
} as DomainSeedwork.TypeConverter<
	TestMongoType,
	TestProps,
	typeof passport,
	DummyAggregateRoot
>);
const eventBus = vi.mocked({
	dispatch: vi.fn(),
	register: vi.fn(),
} as DomainSeedwork.EventBus);
const session = vi.mocked({} as mongoose.ClientSession);

// Concrete repository for testing
class TestMongoRepository extends MongoRepositoryBase<
	TestMongoType,
	TestProps,
	typeof passport,
	DummyAggregateRoot
> {}

let repo: TestMongoRepository;

beforeEach(() => {
	vi.clearAllMocks();
	repo = new TestMongoRepository(
		passport,
		model,
		typeConverter,
		eventBus,
		session,
	);
});

describe('MongoRepositoryBase', () => {
	describe('Scenario: Initializing the repository', () => {
		describe('Given a valid model and dependencies', () => {
			describe('When the constructor for MongoRepositoryBase is called', () => {
				it('Then it should construct with dependencies', () => {
					expect(repo).toBeInstanceOf(TestMongoRepository);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['model']).toBe(model);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['typeConverter']).toBe(typeConverter);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['bus']).toBe(eventBus);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['session']).toBe(session);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['passport']).toBe(passport);
				});
			});
			describe('when the static create method is called', () => {
				it('Then it should create an instance of the repository', () => {
					const repoInstance = TestMongoRepository.create(
						passport,
						model,
						typeConverter,
						eventBus,
						session,
						TestMongoRepository,
					);
					expect(repoInstance).toBeInstanceOf(TestMongoRepository);
				});
			});
		});
	});

	describe('Scenario: Saving the repository', () => {
		describe('Given an initialized repository', () => {
			beforeEach(() => {
				repo = new TestMongoRepository(
					passport,
					model,
					typeConverter,
					eventBus,
					session,
				);
			});
			describe('When the repository is saved with a non-deleted aggregate', () => {
				it('Then it should dispatch all domain events before clearing them', async () => {
					//
					// Arrange
					const props = { id: 'save-id', foo: 'bar' };
					const aggregate = new DummyAggregateRoot(props, passport);

					// Mock multiple domain events
					const domainEvent1 = {
						aggregateId: 'save-id',
						payload: { foo: 'bar1' },
						constructor: TestDomainEvent1,
					};
					const domainEvent2 = {
						aggregateId: 'save-id',
						payload: { foo: 'bar2' },
						constructor: TestDomainEvent2,
					};
					vi.spyOn(aggregate, 'getDomainEvents').mockReturnValue([
						domainEvent1,
						domainEvent2,
					]);
					const clearDomainEventsSpy = vi
						.spyOn(aggregate, 'clearDomainEvents')
						.mockImplementation(() => []);
					const dispatchSpy = eventBus.dispatch;

					// Mock typeConverter and mongoObj
					const mongoObj = {
						isModified: () => true,
						save: vi.fn().mockResolvedValue({ _id: 'save-id', foo: 'bar' }),
					};
					typeConverter.toPersistence.mockReturnValue(
						mongoObj as unknown as TestMongoType,
					);
					const domainObj = new DummyAggregateRoot(props, passport);
					typeConverter.toDomain.mockResolvedValueOnce(domainObj);

					//
					// Act
					await repo.save(aggregate);

					//
					// Assert
					expect(dispatchSpy).toHaveBeenCalledTimes(2);
					expect(dispatchSpy).toHaveBeenNthCalledWith(
						1,
						domainEvent1.constructor,
						domainEvent1.payload,
					);
					expect(dispatchSpy).toHaveBeenNthCalledWith(
						2,
						domainEvent2.constructor,
						domainEvent2.payload,
					);
					expect(clearDomainEventsSpy).toHaveBeenCalledTimes(1);

					// Ensure clearDomainEvents is called after the last dispatch
					const lastDispatchCallOrder = dispatchSpy.mock.invocationCallOrder[1];
					const clearCallOrder =
						clearDomainEventsSpy.mock.invocationCallOrder[0];
					expect(clearCallOrder).toBeGreaterThan(
						lastDispatchCallOrder as number,
					);
				});

				it('Then it should call the model save method for the aggregate and return the domain object', async () => {
					// Arrange
					const props = { id: 'save-id', foo: 'bar' };
					const aggregate = new DummyAggregateRoot(props, passport);

					// Mock domain events
					const domainEvent = {
						aggregateId: 'save-id',
						payload: { foo: 'bar' },
						constructor: TestDomainEvent1,
					};
					vi.spyOn(aggregate, 'getDomainEvents').mockReturnValue([domainEvent]);
					vi.spyOn(aggregate, 'clearDomainEvents').mockImplementation(() => []);

					// Spy and mock typeConverter methods directly
					const mongoObj = {
						isModified: () => true,
						save: vi.fn().mockResolvedValue({ _id: 'save-id', foo: 'bar' }),
					};
					typeConverter.toPersistence.mockReturnValue(
						mongoObj as unknown as TestMongoType,
					);
					const domainObj = new DummyAggregateRoot(props, passport);
					typeConverter.toDomain.mockResolvedValueOnce(domainObj);

					// Act
					const result = await repo.save(aggregate);

					// Assert
					expect(aggregate.onSave).toHaveBeenCalledWith(true);
					expect(eventBus.dispatch).toHaveBeenCalledWith(
						domainEvent.constructor,
						domainEvent.payload,
					);
					expect(aggregate.clearDomainEvents).toHaveBeenCalled();
					expect(typeConverter.toPersistence).toHaveBeenCalledWith(aggregate);
					expect(mongoObj.save).toHaveBeenCalledWith({ session });
					expect(typeConverter.toDomain).toHaveBeenCalled();
					expect(result).toBe(domainObj);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['itemsInTransaction']).toContain(aggregate);
				});
			});

			describe('When the repository is saved with a deleted aggregate', () => {
				it('Then it should call the model delete method for the aggregate and return the aggregate', async () => {
					//
					// Arrange
					const props = { id: 'delete-id', foo: 'bar' };
					const aggregate = new DummyAggregateRoot(props, passport);
					aggregate.requestDelete();

					// Mock domain events
					const domainEvent = {
						aggregateId: 'delete-id',
						payload: { foo: 'bar' },
						constructor: TestDomainEvent1,
					};
					vi.spyOn(aggregate, 'getDomainEvents').mockReturnValue([domainEvent]);
					vi.spyOn(aggregate, 'clearDomainEvents').mockImplementation(() => []);

					// Spy and mock typeConverter methods directly
					const mongoObj = {
						isModified: () => true,
						save: vi.fn(), // Not used in this branch, but required for type
					};
					typeConverter.toPersistence.mockReturnValue(
						mongoObj as unknown as TestMongoType,
					);

					// Mock model.deleteOne to return an object with exec that resolves
					const execSpy = vi.fn().mockResolvedValue({});
					(model.deleteOne as unknown as Mock).mockReturnValueOnce({
						exec: execSpy,
					});

					// Act
					const result = await repo.save(aggregate);

					//
					// Assert
					expect(aggregate.onSave).toHaveBeenCalledWith(true);
					expect(eventBus.dispatch).toHaveBeenCalledWith(
						domainEvent.constructor,
						domainEvent.payload,
					);
					expect(aggregate.clearDomainEvents).toHaveBeenCalled();
					expect(typeConverter.toPersistence).toHaveBeenCalledWith(aggregate);
					expect(model.deleteOne).toHaveBeenCalledWith(
						{ _id: 'delete-id' },
						{ session },
					);
					expect(execSpy).toHaveBeenCalled(); // Ensure exec is awaited
					expect(result).toBe(aggregate);
                    // biome-ignore lint:useLiteralKeys
					expect(repo['itemsInTransaction']).toContain(aggregate);
				});
			});

			describe('When the repository save operation fails', () => {
				it('Then it should throw if mongoObj.save throws', async () => {
					//
					// Arrange
					const props = { id: 'err-id', foo: 'bar' };
					const aggregate = new DummyAggregateRoot(props, passport);

					// Mock domain events
					const domainEvent = {
						aggregateId: 'err-id',
						payload: { foo: 'bar' },
						constructor: TestDomainEvent1,
					};
					vi.spyOn(aggregate, 'getDomainEvents').mockReturnValue([domainEvent]);
					vi.spyOn(aggregate, 'clearDomainEvents').mockImplementation(() => []);

					// Spy and mock typeConverter methods directly
					const error = new Error('save failed');
					const mongoObj = {
						isModified: () => true,
						save: vi.fn().mockRejectedValue(error),
					};
					typeConverter.toPersistence.mockReturnValue(
						mongoObj as unknown as TestMongoType,
					);

					// Act
					const act = async () => await repo.save(aggregate);

					//
					// Assert
					await expect(act).rejects.toThrow('save failed');
				});
			});
		});
	});

	describe('Scenario: Getting an aggregate', () => {
		describe('Given an initialized repository', () => {
			describe('When the repository gets an aggregate that exists', () => {
				it('Then it should return the domain object if found (happy path)', async () => {
					//
					// Arrange
					const testId = 'test-id';
					const mongoDoc = { _id: testId, foo: 'test-foo' };
					// Mock model.findById().exec() to resolve to a mongoDoc
					(model.findById as unknown as Mock).mockReturnValueOnce({
						exec: vi.fn().mockResolvedValue(mongoDoc),
					});
					const domainObj = new DummyAggregateRoot(
						{ id: testId, foo: 'test-foo' },
						passport,
					);
					typeConverter.toDomain.mockResolvedValueOnce(domainObj);

					//
					// Act
					const result = await repo.get(testId);

					//
					// Assert
					expect(model.findById).toHaveBeenCalledWith(testId);
					expect(typeConverter.toDomain).toHaveBeenCalledWith(
						mongoDoc,
						passport,
					);
					expect(result).toBe(domainObj);
				});
			});
			describe('When the repository gets an aggregate that does not exist', () => {
				it('Then it should throw NotFoundError if the document is not found', async () => {
					//
					// Arrange
					const testId = 'not-found-id';
					(model.findById as unknown as Mock).mockReturnValueOnce({
						exec: vi.fn().mockResolvedValue(null),
					});

					//
					// Act
					let thrownError: unknown;
					try {
						await repo.get(testId);
					} catch (err) {
						thrownError = err;
					}

					//
					// Assert
					expect(thrownError).toBeInstanceOf(DomainSeedwork.NotFoundError);
					expect((thrownError as Error).message).toBe(
						`Item with id ${testId} not found`,
					);
				});
			});

			describe('When the repository gets an aggregate root and the domain conversion fails', () => {
				it('Then it should propagate errors thrown by typeConverter.toDomain', async () => {
					//
					// Arrange
					const testId = 'test-id';
					const mongoDoc = { _id: testId, foo: 'test-foo' };
					(model.findById as unknown as Mock).mockReturnValueOnce({
						exec: vi.fn().mockResolvedValue(mongoDoc),
					});
					const error = new Error('conversion error');
					typeConverter.toDomain.mockRejectedValueOnce(error);

					//
					// Act
					let thrownError: unknown;
					try {
						await repo.get(testId);
					} catch (err) {
						thrownError = err;
					}

					//
					// Assert
					expect(thrownError).toBe(error);
				});
			});

			describe('When the repository gets an aggregate root that does exist and the persistence layer fails', () => {
				it('Then it should propagate errors thrown by model.findById().exec()', async () => {
					//
					// Arrange
					const testId = 'error-id';
					const error = new Error('db error');
					(model.findById as unknown as Mock).mockReturnValueOnce({
						exec: vi.fn().mockRejectedValue(error),
					});

					//
					// Act
					let thrownError: unknown;
					try {
						await repo.get(testId);
					} catch (err) {
						thrownError = err;
					}

					//
					// Assert
					expect(thrownError).toBe(error);
				});
			});
		});
	});

	// Add more tests for get, save, getIntegrationEvents, etc.

describe('Scenario: Getting integration events', () => {
	describe('Given a repository with aggregates in itemsInTransaction', () => {
		describe('When getIntegrationEvents is called and aggregates have integration events', () => {
			it('Then it should return all integration events and clear them from each aggregate', () => {
				//
				// Arrange
				const event1 = { aggregateId: 'id1', payload: { foo: 'bar1' } };
				const event2 = { aggregateId: 'id2', payload: { foo: 'bar2' } };
				const aggregate1 = new DummyAggregateRoot({ id: 'id1', foo: 'bar1' }, passport);
				const aggregate2 = new DummyAggregateRoot({ id: 'id2', foo: 'bar2' }, passport);

				const getIntegrationEvents1 = vi.spyOn(aggregate1, 'getIntegrationEvents').mockReturnValue([event1]);
				const getIntegrationEvents2 = vi.spyOn(aggregate2, 'getIntegrationEvents').mockReturnValue([event2]);
				const clearIntegrationEvents1 = vi.spyOn(aggregate1, 'clearIntegrationEvents');
				const clearIntegrationEvents2 = vi.spyOn(aggregate2, 'clearIntegrationEvents');

                // biome-ignore lint:useLiteralKeys
				repo['itemsInTransaction'] = [aggregate1, aggregate2];

				//
				// Act
				const result = repo.getIntegrationEvents();

				//
				// Assert
				expect(getIntegrationEvents1).toHaveBeenCalled();
				expect(getIntegrationEvents2).toHaveBeenCalled();
				expect(clearIntegrationEvents1).toHaveBeenCalled();
				expect(clearIntegrationEvents2).toHaveBeenCalled();
				expect(result).toEqual([event1, event2]);
			});
		});

		describe('When getIntegrationEvents is called and aggregates have no integration events', () => {
			it('Then it should return an empty array and clear integration events from each aggregate', () => {
				//
				// Arrange
				const aggregate1 = new DummyAggregateRoot({ id: 'id1', foo: 'bar1' }, passport);
				const aggregate2 = new DummyAggregateRoot({ id: 'id2', foo: 'bar2' }, passport);

				const getIntegrationEvents1 = vi.spyOn(aggregate1, 'getIntegrationEvents').mockReturnValue([]);
				const getIntegrationEvents2 = vi.spyOn(aggregate2, 'getIntegrationEvents').mockReturnValue([]);
				const clearIntegrationEvents1 = vi.spyOn(aggregate1, 'clearIntegrationEvents');
				const clearIntegrationEvents2 = vi.spyOn(aggregate2, 'clearIntegrationEvents');

                // biome-ignore lint:useLiteralKeys
				repo['itemsInTransaction'] = [aggregate1, aggregate2];

				//
				// Act
				const result = repo.getIntegrationEvents();

				//
				// Assert
				expect(getIntegrationEvents1).toHaveBeenCalled();
				expect(getIntegrationEvents2).toHaveBeenCalled();
				expect(clearIntegrationEvents1).toHaveBeenCalled();
				expect(clearIntegrationEvents2).toHaveBeenCalled();
				expect(result).toEqual([]);
			});
		});
	});

	describe('Given a repository with no aggregates in itemsInTransaction', () => {
		describe('When getIntegrationEvents is called', () => {
			it('Then it should return an empty array', () => {
				//
				// Arrange
                // biome-ignore lint:useLiteralKeys
				repo['itemsInTransaction'] = [];

				//
				// Act
				const result = repo.getIntegrationEvents();

				//
				// Assert
				expect(result).toEqual([]);
        });
      });
    });
  });

});
