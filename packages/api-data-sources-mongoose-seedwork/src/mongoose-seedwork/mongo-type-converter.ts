import { Base } from './base';
import { DomainSeedwork } from 'api-data-sources-seedwork'; 
import { MongooseDomainAdapterType } from './mongo-domain-adapter';

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
  constructor(private adapter: new (args: MongooseModelType) => DomainPropInterface, private domainObject: new (args: DomainPropInterface, context: ContextType) => DomainType) {}

  
  toDomain(mongoType: MongooseModelType, context: ContextType) {
    if (!mongoType) {
      return null;
    }
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
