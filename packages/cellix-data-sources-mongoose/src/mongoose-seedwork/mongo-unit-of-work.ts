import mongoose, { type ClientSession, type Model } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Base } from './base.ts';

export class MongoUnitOfWork<
	MongoType extends Base,
	PropType extends DomainSeedwork.DomainEntityProps,
	PassportType,
	DomainType extends DomainSeedwork.AggregateRoot<PropType, PassportType>,
	RepoType extends MongoRepositoryBase<
		MongoType,
		PropType,
		PassportType,
		DomainType
	>
> implements
		DomainSeedwork.UnitOfWork<PassportType, PropType, DomainType, RepoType>
{
	public readonly model: Model<MongoType>;
	public readonly typeConverter: DomainSeedwork.TypeConverter<
		MongoType,
		PropType,
		PassportType,
		DomainType
	>;
	public readonly bus: DomainSeedwork.EventBus;
	public readonly integrationEventBus: DomainSeedwork.EventBus;
	// protected passport: PassportType;
	public readonly repoClass: new (
		passport: PassportType,
		model: Model<MongoType>,
		typeConverter: DomainSeedwork.TypeConverter<
			MongoType,
			PropType,
			PassportType,
			DomainType
		>,
		bus: DomainSeedwork.EventBus,
		session: ClientSession,
	) => RepoType;

	constructor(
		//  passport: PassportType,
		bus: DomainSeedwork.EventBus,
		integrationEventBus: DomainSeedwork.EventBus,
		model: Model<MongoType>,
		typeConverter: DomainSeedwork.TypeConverter<
			MongoType,
			PropType,
			PassportType,
			DomainType
		>,
		repoClass: new (
			passport: PassportType,
			model: Model<MongoType>,
			typeConverter: DomainSeedwork.TypeConverter<
				MongoType,
				PropType,
				PassportType,
				DomainType
			>,
			bus: DomainSeedwork.EventBus,
			session: ClientSession,
		) => RepoType,
	) {
		//  this.passport = passport;
		this.model = model;
		this.typeConverter = typeConverter;
		this.bus = bus;
		this.integrationEventBus = integrationEventBus;
		this.repoClass = repoClass;
	}

	async withTransaction<TReturn>(
		passport: PassportType,
		func: (repository: RepoType) => Promise<TReturn>,
	): Promise<TReturn> {
		let repoEvents: ReadonlyArray<DomainSeedwork.CustomDomainEvent<unknown>> =
			[]; //todo: can we make this an arry of CustomDomainEvents?
        let result!: TReturn;

		await mongoose.connection.transaction(async (session: ClientSession) => {
			console.log('transaction');
			const repo = MongoRepositoryBase.create(
				passport,
				this.model,
				this.typeConverter,
				this.bus,
				session,
				this.repoClass,
			);
			console.log('repo created');
			try {
				result = await func(repo);
				// await console.log('func done');
			} catch (e) {
				console.log('func failed');
				console.log(e);
				throw e;
			}
			repoEvents = repo.getIntegrationEvents();
		});
		console.log(`${repoEvents.length} integration events`);
		//Send integration events after transaction is completed
		for (const event of repoEvents) {
			await this.integrationEventBus.dispatch(
				event.constructor as new (
					aggregateId: string
				) => typeof event,
				event.payload,
			);
            console.log(`dispatch integration event ${event.constructor.name} with payload ${JSON.stringify(event.payload)}`)
		}
        return result;
	}
}
