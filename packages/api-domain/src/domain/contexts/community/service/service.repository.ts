import { Service, type ServiceProps } from './service.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { CommunityEntityReference } from '../community/community.ts';

export interface ServiceRepository<props extends ServiceProps> extends DomainSeedwork.Repository<Service<props>> {
  getNewInstance(serviceName: string, description: string, community: CommunityEntityReference): Promise<Service<props>>;
  getById(id: string): Promise<Service<props>>
}