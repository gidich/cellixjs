import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface CommunityWhiteLabelDomainUpdatedProps {
    communityId: string;
    whiteLabelDomain: string;
    oldWhiteLabelDomain?: string;
}
export declare class CommunityWhiteLabelDomainUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<CommunityWhiteLabelDomainUpdatedProps> {
}
