import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface PropertyDeletedEventProps {
  id: string;
}

export class PropertyDeletedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyDeletedEventProps> {}
