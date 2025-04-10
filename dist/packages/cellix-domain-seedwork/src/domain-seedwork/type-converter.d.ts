import { BaseDomainExecutionContext } from './base-domain-execution-context';
import { DomainEntityProps } from './domain-entity';
import { AggregateRoot } from './aggregate-root';
export interface TypeConverter<PersistenceType, DomainPropType extends DomainEntityProps, DomainType extends AggregateRoot<DomainPropType>, ContextType extends BaseDomainExecutionContext> {
    toDomain(persistenceType: PersistenceType, context: ContextType): DomainType;
    toPersistence(domainType: DomainType): PersistenceType;
    toAdapter(persistenceType: PersistenceType | DomainType): DomainPropType;
}
