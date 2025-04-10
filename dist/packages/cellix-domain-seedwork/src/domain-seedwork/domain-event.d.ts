export interface CustomDomainEvent<T> extends DomainEvent {
    get payload(): T;
    set payload(payload: T);
}
export interface DomainEvent {
    get aggregateId(): string;
}
export declare abstract class DomainEventBase implements DomainEvent {
    private readonly _aggregateId;
    constructor(_aggregateId: string);
    get aggregateId(): string;
}
export declare abstract class CustomDomainEventImpl<T> extends DomainEventBase implements CustomDomainEvent<T> {
    private _payload;
    get payload(): T;
    set payload(payload: T);
}
