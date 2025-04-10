import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface ServiceTicketV1DeletedEventProps {
    id: string;
}
export declare class ServiceTicketV1DeletedEvent extends DomainSeedwork.CustomDomainEventImpl<ServiceTicketV1DeletedEventProps> {
}
