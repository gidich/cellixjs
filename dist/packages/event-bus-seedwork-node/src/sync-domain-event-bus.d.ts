export interface SyncDomainEventPayloadBaseType {
}
export interface SyncDomainEventType<EventPayloadType extends SyncDomainEventPayloadBaseType> {
    get payload(): EventPayloadType;
    set payload(payload: EventPayloadType);
}
export declare abstract class SyncDomainEventImpl<EventPayloadType extends SyncDomainEventPayloadBaseType> implements SyncDomainEventType<EventPayloadType> {
    private _payload;
    get payload(): EventPayloadType;
    set payload(payload: EventPayloadType);
}
