import { type Base } from './base.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork'; 
import { type MongooseDomainAdapterType } from './mongo-domain-adapter.ts';

export abstract class MongoTypeConverter<
  MongooseModelType extends Base,
  DomainPropInterface extends MongooseDomainAdapterType<MongooseModelType>,
  DomainType extends DomainSeedwork.AggregateRoot<DomainPropInterface>,
  ContextType extends DomainSeedwork.BaseDomainExecutionContext,
> implements DomainSeedwork.TypeConverter<
  MongooseModelType,
  DomainPropInterface, 
  DomainType, 
  ContextType>
{
  private adapter: new (args: MongooseModelType) => DomainPropInterface;
  private domainObject: new (args: DomainPropInterface, context: ContextType) => DomainType;

  constructor(
    adapter: new (args: MongooseModelType) => DomainPropInterface,
    domainObject: new (args: DomainPropInterface, context: ContextType) => DomainType
  ) {
    this.adapter = adapter;
    this.domainObject = domainObject;
  }

  
  toDomain(mongoType: MongooseModelType, context: ContextType) {
    return new this.domainObject(this.toAdapter(mongoType), context);
  }

  toPersistence(domainType: DomainType): MongooseModelType {
    return domainType.props.doc;
  }

  toAdapter(mongoType: MongooseModelType | DomainType): DomainPropInterface {
    if (mongoType instanceof this.domainObject) {
      return mongoType.props;
    }
    return new this.adapter(mongoType as MongooseModelType);
  }
    
}
