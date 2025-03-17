import { Service, ServiceProps } from './service';
import { DomainSeedwork } from 'api-data-sources-seedwork';
import { CommunityEntityReference } from '../community/community';

export interface ServiceRepository<props extends ServiceProps> extends DomainSeedwork.Repository<Service<props>> {
  getNewInstance(serviceName: string, description: string, community: CommunityEntityReference): Promise<Service<props>>;
  getById(id: string): Promise<Service<props>>
}