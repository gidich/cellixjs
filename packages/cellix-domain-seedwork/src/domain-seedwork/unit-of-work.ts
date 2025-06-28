import { type Repository } from './repository.ts';
import { AggregateRoot } from './aggregate-root.ts';
import { type DomainEntityProps } from './domain-entity.ts';

export interface UnitOfWork<
	PassportType,
	PropType extends DomainEntityProps,
	Root extends AggregateRoot<PropType, PassportType>,
	RepoType extends Repository<Root>,
> {
	withTransaction(
		passport: PassportType,
		func: (repository: RepoType) => Promise<void>,
	): Promise<void>;
}
