import { type Repository } from './repository.ts';
import { AggregateRoot } from './aggregate-root.ts';
import { type DomainEntityProps } from './domain-entity.ts';
import { type BaseDomainExecutionContext } from './base-domain-execution-context.ts';

export interface UnitOfWork<ContextType extends BaseDomainExecutionContext, PropType extends DomainEntityProps, Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>> {
  withTransaction(context: ContextType, func: (repository: RepoType) => Promise<void>): Promise<void>;
}

export abstract class PersistenceUnitOfWork<ContextType extends BaseDomainExecutionContext, PropType extends DomainEntityProps, Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>>
  implements UnitOfWork<ContextType, PropType, Root, RepoType>
{
  abstract withTransaction(context: ContextType, func: (repository: RepoType) => Promise<void>): Promise<void>;
}
