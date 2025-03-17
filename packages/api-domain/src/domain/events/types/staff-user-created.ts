import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface StaffUserCreatedProps {
  externalId: string;
}

export class StaffUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<StaffUserCreatedProps> {}
