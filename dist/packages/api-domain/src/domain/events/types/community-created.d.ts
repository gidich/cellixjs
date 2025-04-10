import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface CommunityCreatedProps {
    communityId: string;
}
export declare class CommunityCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<CommunityCreatedProps> {
}
