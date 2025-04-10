import { Base } from './base';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import { MongooseDomainAdapterType } from './mongo-domain-adapter';
export declare abstract class MongoTypeConverter<MongooseModelType extends Base, DomainPropInterface extends MongooseDomainAdapterType<MongooseModelType>, DomainType extends DomainSeedwork.AggregateRoot<DomainPropInterface>, ContextType extends DomainSeedwork.BaseDomainExecutionContext> implements DomainSeedwork.TypeConverter<MongooseModelType, DomainPropInterface, DomainType, ContextType> {
    private adapter;
    private domainObject;
    constructor(adapter: new (args: MongooseModelType) => DomainPropInterface, domainObject: new (args: DomainPropInterface, context: ContextType) => DomainType);
    toDomain(mongoType: MongooseModelType, context: ContextType): DomainType;
    toPersistence(domainType: DomainType): MongooseModelType;
    toAdapter(mongoType: MongooseModelType | DomainType): DomainPropInterface;
}
