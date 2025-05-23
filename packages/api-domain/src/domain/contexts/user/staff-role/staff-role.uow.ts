import { StaffRole, type StaffRoleProps } from './staff-role.ts';
import type { StaffRoleRepository } from './staff-role.repository.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';

export interface StaffRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, StaffRoleProps,  StaffRole<StaffRoleProps>, StaffRoleRepository<StaffRoleProps>> {
}
