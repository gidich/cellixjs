import { type BaseDomainExecutionContext } from './base-domain-execution-context.ts';
import { type DomainEntityProps } from './domain-entity.ts';
import { AggregateRoot } from './aggregate-root.ts';

export interface TypeConverter<
  PersistenceType, 
  DomainPropType extends DomainEntityProps, 
  DomainType extends AggregateRoot<DomainPropType>, 
  ContextType extends BaseDomainExecutionContext
  > {
  toDomain(persistenceType: PersistenceType, context: ContextType): DomainType;
  toPersistence(domainType: DomainType): PersistenceType;
  toAdapter(persistenceType: PersistenceType | DomainType): DomainPropType;
}
