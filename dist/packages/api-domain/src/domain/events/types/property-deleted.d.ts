import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface PropertyDeletedEventProps {
    id: string;
}
export declare class PropertyDeletedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyDeletedEventProps> {
}
