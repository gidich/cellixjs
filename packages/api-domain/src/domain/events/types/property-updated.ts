import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface PropertyUpdatedProps {
  id: string;
}

export class PropertyUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyUpdatedProps> {}
