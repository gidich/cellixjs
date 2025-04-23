import { DomainSeedwork } from '@cellix/domain-seedwork';
import { Community, type CommunityProps } from './community.ts';
import { type EndUserEntityReference } from '../../user/end-user/end-user.ts';

export interface CommunityRepository<props extends CommunityProps> extends DomainSeedwork.Repository<Community<props>> {
  getNewInstance(communityName: string, createdByUser: EndUserEntityReference): Promise<Community<props>> ;
  getByIdWithCreatedBy(id: string): Promise<Community<props>>;
}