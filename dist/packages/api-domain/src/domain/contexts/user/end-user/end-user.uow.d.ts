import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { EndUser, EndUserProps } from './end-user';
import { EndUserRepository } from './end-user.repository';
export interface EndUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, EndUserProps, EndUser<EndUserProps>, EndUserRepository<EndUserProps>> {
}
