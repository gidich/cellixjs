import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface ViolationTicketV1CreatedProps {
  id: string;
}

export class ViolationTicketV1CreatedEvent extends DomainSeedwork.CustomDomainEventImpl<ViolationTicketV1CreatedProps> {}
