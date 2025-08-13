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
    DomainReferenceType
> implements
		DomainSeedwork.TypeConverter<
			MongooseModelType,
			DomainPropInterface,
			PassportType,
			DomainType,
            DomainReferenceType
		>
{
	private readonly adapter: new (
		args: MongooseModelType
	) => DomainPropInterface;
	private readonly domainObject: new (
		args: DomainPropInterface,
		passport: PassportType
	) => DomainType;
    private readonly domainReference: (
        args: DomainPropInterface,
        passport: PassportType
    ) => DomainReferenceType;

	constructor(
		adapter: new (args: MongooseModelType) => DomainPropInterface,
		domainObject: new (
			args: DomainPropInterface,
			passport: PassportType
		) => DomainType,
        domainReference: (
            args: DomainPropInterface,
            passport: PassportType
        ) => DomainReferenceType
	) {
		this.adapter = adapter;
		this.domainObject = domainObject;
		this.domainReference = domainReference;
	}

	toDomain(mongoType: MongooseModelType, passport: PassportType) {
		return new this.domainObject(this.toAdapter(mongoType), passport);
	}

    toEntityReference(mongoType: MongooseModelType, passport: PassportType) {
        return this.domainReference(this.toAdapter(mongoType), passport);
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
