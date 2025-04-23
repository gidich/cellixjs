import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { EndUser, type EndUserProps } from './end-user.ts';
import type { EndUserRepository } from './end-user.repository.ts';

export interface EndUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, EndUserProps,  EndUser<EndUserProps>, EndUserRepository<EndUserProps>> {
}
