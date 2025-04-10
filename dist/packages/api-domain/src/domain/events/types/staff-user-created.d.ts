import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface StaffUserCreatedProps {
    externalId: string;
}
export declare class StaffUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<StaffUserCreatedProps> {
}
