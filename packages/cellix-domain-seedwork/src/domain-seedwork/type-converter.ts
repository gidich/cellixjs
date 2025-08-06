import type { AggregateRoot } from './aggregate-root.ts';
import type { DomainEntityProps } from './domain-entity.ts';
import type { DomainService } from './domain-service.ts';

export interface TypeConverter<
	PersistenceType,
	DomainPropType extends DomainEntityProps,
	PassportType,
	DomainType extends AggregateRoot<DomainPropType, PassportType>,
    DomainServicesType extends DomainService
> {
	toDomain(
		persistenceType: PersistenceType,
		passport: PassportType,
        domainServices: DomainServicesType,
	): DomainType;
	toPersistence(domainType: DomainType): PersistenceType;
	toAdapter(persistenceType: PersistenceType | DomainType, domainServices: DomainServicesType): DomainPropType;
}
