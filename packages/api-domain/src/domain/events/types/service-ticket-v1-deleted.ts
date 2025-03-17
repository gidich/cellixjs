import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface ServiceTicketV1DeletedEventProps {
  id: string;
}

export class ServiceTicketV1DeletedEvent extends DomainSeedwork.CustomDomainEventImpl<ServiceTicketV1DeletedEventProps> {}
