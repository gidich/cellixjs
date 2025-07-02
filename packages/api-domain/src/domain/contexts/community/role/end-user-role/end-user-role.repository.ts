import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { EndUserRole, EndUserRoleProps } from './end-user-role.ts';
import type { CommunityEntityReference } from '../../community/community.ts';

export interface EndUserRoleRepository<props extends EndUserRoleProps>
	extends DomainSeedwork.Repository<EndUserRole<props>> {
	getNewInstance(
		name: string,
		community: CommunityEntityReference
	): Promise<EndUserRole<props>>;
	getById(id: string): Promise<EndUserRole<props>>;
}
