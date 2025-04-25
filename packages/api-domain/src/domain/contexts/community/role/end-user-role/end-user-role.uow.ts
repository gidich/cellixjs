import type { DomainExecutionContext } from '../../../../domain-execution-context.ts';
import { EndUserRole, type EndUserRoleProps } from './end-user-role.ts';
import type { EndUserRoleRepository } from './end-user-role.repository.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface EndUserRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, EndUserRoleProps,  EndUserRole<EndUserRoleProps>, EndUserRoleRepository<EndUserRoleProps>> {
}
