import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserCreatedProps {
    userId: string;
}
export declare class EndUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<EndUserCreatedProps> {
}
