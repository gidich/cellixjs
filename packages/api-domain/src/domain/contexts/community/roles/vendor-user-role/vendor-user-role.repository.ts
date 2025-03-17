import { VendorUserRole, VendorUserRoleProps } from './vendor-user-role';
import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityEntityReference } from '../../community/community';

export interface VendorUserRoleRepository<props extends VendorUserRoleProps> extends DomainSeedwork.Repository<VendorUserRole<props>> {
  getNewInstance(name: string, community: CommunityEntityReference): Promise<VendorUserRole<props>>;
  getById(id: string): Promise<VendorUserRole<props>>;
}