import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../../domain-execution-context.ts';
import { VendorUserRole, type VendorUserRoleProps } from './vendor-user-role.ts';
import type { VendorUserRoleRepository } from './vendor-user-role.repository.ts';

export interface VendorUserRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, VendorUserRoleProps, VendorUserRole<VendorUserRoleProps>, VendorUserRoleRepository<VendorUserRoleProps>> {
}
