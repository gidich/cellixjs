import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface VendorUserCreatedProps {
  userId: string;
}

export class VendorUserCreatedEvent extends DomainSeedwork.CustomDomainEventImpl<VendorUserCreatedProps> {}
