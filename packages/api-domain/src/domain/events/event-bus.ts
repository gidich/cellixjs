import { DomainSeedwork } from 'cellix-domain-seedwork';
import { NodeEventBusInstance } from 'event-bus-seedwork-node';

export const EventBusInstance: DomainSeedwork.EventBus = NodeEventBusInstance as DomainSeedwork.EventBus;