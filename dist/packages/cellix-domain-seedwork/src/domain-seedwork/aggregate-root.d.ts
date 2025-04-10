import { DomainEntity, DomainEntityProps } from './domain-entity';
import { CustomDomainEvent, DomainEvent } from './domain-event';
export interface RootEventRegistry {
    addDomainEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): any;
    addIntegrationEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): any;
}
export declare class AggregateRoot<PropType extends DomainEntityProps> extends DomainEntity<PropType> implements RootEventRegistry {
    private _isDeleted;
    get isDeleted(): boolean;
    protected set isDeleted(value: boolean);
    private domainEvents;
    addDomainEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): void;
    clearDomainEvents(): void;
    getDomainEvents(): DomainEvent[];
    private integrationEvents;
    addIntegrationEvent<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (aggregateId: string) => T, props: T['payload']): void;
    clearIntegrationEvents(): void;
    getIntegrationEvents(): DomainEvent[];
    onSave(isModified: boolean): void;
}
