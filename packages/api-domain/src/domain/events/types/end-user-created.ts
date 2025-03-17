import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface EndUserCreatedProps {
  userId: string;
}

export class EndUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<EndUserCreatedProps> {}
