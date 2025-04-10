"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncDomainEventImpl = void 0;
class SyncDomainEventImpl {
    get payload() {
        return this._payload;
    }
    set payload(payload) {
        this._payload = payload;
    }
}
exports.SyncDomainEventImpl = SyncDomainEventImpl;
/*
//// Sync Domain Event Bus
export interface SyncDomainEventBus {

    get events(): SyncDomainEventType< any>[];
    addEvent<EventPayloadType extends SyncDomainEventPayloadBaseType, EventType extends SyncDomainEventType<EventPayloadType>>(
        event: new () => EventType,
        payload: EventPayloadType
    ) : void
    clearEvents (): void;
}

export class SyncDomainEventBusImpl implements SyncDomainEventBus {
    private _events: SyncDomainEventType<any>[] = [];

    public get events(): SyncDomainEventType<any>[] {
        return this._events;
    }

    public addEvent<EventPayloadType extends any, T extends SyncDomainEventType<EventPayloadType>>(
        event: new () => T,
        payload: EventPayloadType
    ) : void {
        let eventToAdd = new event();
        eventToAdd.payload = payload;
        this._events.push(eventToAdd);
    }

    public clearEvents (): void {
        this._events.splice(0, this._events.length);
    }
}
*/ 
//# sourceMappingURL=sync-domain-event-bus.js.map