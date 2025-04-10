import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface PropertyUpdatedProps {
    id: string;
}
export declare class PropertyUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyUpdatedProps> {
}
