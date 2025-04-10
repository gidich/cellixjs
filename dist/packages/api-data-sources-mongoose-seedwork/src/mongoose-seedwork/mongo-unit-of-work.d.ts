import { ClientSession, Model } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import { Base } from './base';
export declare class MongoUnitOfWork<MongoType extends Base, PropType extends DomainSeedwork.DomainEntityProps, DomainType extends DomainSeedwork.AggregateRoot<PropType>, ContextType extends DomainSeedwork.BaseDomainExecutionContext, RepoType extends MongoRepositoryBase<MongoType, PropType, DomainType, ContextType>> extends DomainSeedwork.PersistenceUnitOfWork<ContextType, PropType, DomainType, RepoType> {
    readonly model: Model<MongoType>;
    private readonly typeConverter;
    private readonly bus;
    private readonly integrationEventBus;
    private readonly repoClass;
    constructor(model: Model<MongoType>, typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>, bus: DomainSeedwork.EventBus, integrationEventBus: DomainSeedwork.EventBus, repoClass: new (model: Model<MongoType>, typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>, bus: DomainSeedwork.EventBus, session: ClientSession, context: ContextType) => RepoType);
    withTransaction(context: ContextType, func: (repository: RepoType) => Promise<void>): Promise<void>;
}
