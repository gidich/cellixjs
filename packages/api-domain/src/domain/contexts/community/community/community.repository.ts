import { DomainSeedwork } from 'api-data-sources-seedwork';
import { Community, CommunityProps } from './community';
import { EndUserEntityReference } from '../../user/end-user/end-user';

export interface CommunityRepository<props extends CommunityProps> extends DomainSeedwork.Repository<Community<props>> {
  getNewInstance(communityName: string, createdByUser: EndUserEntityReference): Promise<Community<props>> ;
  getByIdWithCreatedBy(id: string): Promise<Community<props>>;
}