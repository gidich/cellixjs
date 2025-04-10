import { ClientSession, Model } from 'mongoose';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import { Base } from './base';
export declare abstract class MongoRepositoryBase<MongoType extends Base, PropType extends DomainSeedwork.DomainEntityProps, DomainType extends DomainSeedwork.AggregateRoot<PropType>, ContextType extends DomainSeedwork.BaseDomainExecutionContext> implements DomainSeedwork.Repository<DomainType> {
    protected model: Model<MongoType>;
    typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>;
    protected eventBus: DomainSeedwork.EventBus;
    protected session: ClientSession;
    protected context: ContextType;
    protected itemsInTransaction: DomainType[];
    constructor(model: Model<MongoType>, typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>, eventBus: DomainSeedwork.EventBus, session: ClientSession, context: ContextType);
    get(id: string): Promise<DomainType>;
    save(item: DomainType): Promise<DomainType>;
    getIntegrationEvents(): DomainSeedwork.DomainEvent[];
    static create<ContextType extends DomainSeedwork.BaseDomainExecutionContext, MongoType extends Base, PropType extends DomainSeedwork.DomainEntityProps, DomainType extends DomainSeedwork.AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<MongoType, PropType, DomainType, ContextType>>(model: Model<MongoType>, typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>, bus: DomainSeedwork.EventBus, session: ClientSession, context: ContextType, repoClass: new (model: Model<MongoType>, typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, DomainType, ContextType>, bus: DomainSeedwork.EventBus, session: ClientSession, context: ContextType) => RepoType): RepoType;
}
