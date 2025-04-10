import { DomainExecutionContext } from '../../../../domain-execution-context';
import { EndUserRole, EndUserRoleProps } from './end-user-role';
import { EndUserRoleRepository } from './end-user-role.repository';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, EndUserRoleProps, EndUserRole<EndUserRoleProps>, EndUserRoleRepository<EndUserRoleProps>> {
}
