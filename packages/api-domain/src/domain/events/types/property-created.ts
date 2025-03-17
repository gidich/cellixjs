import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface PropertyCreatedProps {
  id: string;
}

export class PropertyCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<PropertyCreatedProps> {}
