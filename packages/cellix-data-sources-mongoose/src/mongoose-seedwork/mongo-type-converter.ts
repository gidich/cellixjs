import type { Base } from './base.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { MongooseDomainAdapterType } from './mongo-domain-adapter.ts';

export abstract class MongoTypeConverter<
	MongooseModelType extends Base,
	DomainPropInterface extends MongooseDomainAdapterType<MongooseModelType>,
	PassportType,
	DomainType extends DomainSeedwork.AggregateRoot<
		DomainPropInterface,
		PassportType
	>, 
    DomainServicesType extends DomainSeedwork.DomainService
> implements
		DomainSeedwork.TypeConverter<
			MongooseModelType,
			DomainPropInterface,
			PassportType,
			DomainType,
            DomainServicesType
		>
{
	private readonly adapter: new (
		args: MongooseModelType,
        domainServices: DomainServicesType
	) => DomainPropInterface;
	private readonly domainObject: new (
		args: DomainPropInterface,
		passport: PassportType,
        domainServices: DomainServicesType
	) => DomainType;

	constructor(
		adapter: new (args: MongooseModelType, domainServices: DomainServicesType) => DomainPropInterface,
		domainObject: new (
			args: DomainPropInterface,
			passport: PassportType,
            domainServices: DomainServicesType
		) => DomainType,
	) {
		this.adapter = adapter;
		this.domainObject = domainObject;
	}

	toDomain(mongoType: MongooseModelType, passport: PassportType, domainServices: DomainServicesType) {
		return new this.domainObject(this.toAdapter(mongoType, domainServices), passport, domainServices);
	}

	toPersistence(domainType: DomainType): MongooseModelType {
		return domainType.props.doc;
	}

	toAdapter(mongoType: MongooseModelType | DomainType, domainServices: DomainServicesType): DomainPropInterface {
		if (mongoType instanceof this.domainObject) {
			return mongoType.props;
		}
		return new this.adapter(mongoType as MongooseModelType, domainServices);
	}
}
