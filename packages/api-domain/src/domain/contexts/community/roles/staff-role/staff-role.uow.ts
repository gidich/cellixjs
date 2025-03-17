import { DomainExecutionContext } from '../../../../domain-execution-context';
import { StaffRole, StaffRoleProps } from './staff-role';
import { StaffRoleRepository } from './staff-role.repository';
import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface StaffRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, StaffRoleProps,  StaffRole<StaffRoleProps>, StaffRoleRepository<StaffRoleProps>> {
}
