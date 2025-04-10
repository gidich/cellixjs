import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface PropertyCreatedProps {
    id: string;
}
export declare class PropertyCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyCreatedProps> {
}
