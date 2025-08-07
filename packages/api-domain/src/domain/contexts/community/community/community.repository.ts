import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Community, CommunityProps } from './community.ts';
import type { EndUserEntityReference } from '../../user/end-user/end-user.ts';
import type { Services } from '../../../services/index.ts';

export interface CommunityRepository<props extends CommunityProps, domainServices extends Services>
	extends DomainSeedwork.Repository<Community<props, domainServices>> {
	getNewInstance(
		communityName: string,
		createdByUser: EndUserEntityReference,
	): Promise<Community<props, domainServices>>;
	/**
	 * Retrieves a community by its ID, including the user who created it.
	 * @param id - The ID of the community to retrieve.
	 * @returns A promise that resolves to the community with the specified ID, including the creator's information.
	 */
	getByIdWithCreatedBy(id: string): Promise<Community<props, domainServices>>;
}
