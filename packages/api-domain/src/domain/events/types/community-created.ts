import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface CommunityCreatedProps {
  communityId: string;
}

export class CommunityCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<CommunityCreatedProps> {}