import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface VendorUserCreatedProps {
    userId: string;
}
export declare class VendorUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<VendorUserCreatedProps> {
}
