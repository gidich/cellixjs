import { type DomainEntityProps } from './domain-entity.ts';
import { AggregateRoot } from './aggregate-root.ts';

export interface TypeConverter<
  PersistenceType, 
  DomainPropType extends DomainEntityProps, 
  PassportType,
  DomainType extends AggregateRoot<DomainPropType, PassportType>
  > {
  toDomain(persistenceType: PersistenceType, passport: PassportType): DomainType;
  toPersistence(domainType: DomainType): PersistenceType;
  toAdapter(persistenceType: PersistenceType | DomainType): DomainPropType;
}
