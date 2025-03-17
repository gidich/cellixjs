import { DomainSeedwork } from 'api-data-sources-seedwork';
import { DomainExecutionContext } from '../../../../domain-execution-context';
import { VendorUserRole, VendorUserRoleProps } from './vendor-user-role';
import { VendorUserRoleRepository } from './vendor-user-role.repository';

export interface VendorUserRoleUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, VendorUserRoleProps, VendorUserRole<VendorUserRoleProps>, VendorUserRoleRepository<VendorUserRoleProps>> {
}
