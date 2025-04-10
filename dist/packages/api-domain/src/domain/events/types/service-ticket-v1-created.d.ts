import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface ServiceTicketV1CreatedProps {
    id: string;
}
export declare class ServiceTicketV1CreatedEvent extends DomainSeedwork.CustomDomainEventImpl<ServiceTicketV1CreatedProps> {
}
