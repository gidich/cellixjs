import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface CommunityWhiteLabelDomainUpdatedProps {
  communityId: string;
  whiteLabelDomain: string;
  oldWhiteLabelDomain?: string;
}

export class CommunityWhiteLabelDomainUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<CommunityWhiteLabelDomainUpdatedProps> {}