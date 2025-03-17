import { EndUserRole, EndUserRoleProps } from './end-user-role';
import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityEntityReference } from '../../community/community';

export interface EndUserRoleRepository<props extends EndUserRoleProps> extends DomainSeedwork.Repository<EndUserRole<props>> {
  getNewInstance(name: string, community: CommunityEntityReference): Promise<EndUserRole<props>>;
  getById(id: string): Promise<EndUserRole<props>>;
}