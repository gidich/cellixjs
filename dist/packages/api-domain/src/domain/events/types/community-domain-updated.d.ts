import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface CommunityDomainUpdatedProps {
    communityId: string;
    domain: string;
    oldDomain?: string;
}
export declare class CommunityDomainUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<CommunityDomainUpdatedProps> {
}
