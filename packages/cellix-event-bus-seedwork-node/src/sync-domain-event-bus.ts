//// Sync Domain Event
// biome-ignore lint:noEmptyInterface
export interface SyncDomainEventPayloadBaseType {}

export interface SyncDomainEventType<
	EventPayloadType extends SyncDomainEventPayloadBaseType,
> {
	get payload(): EventPayloadType;
	set payload(payload: EventPayloadType);
}

export abstract class SyncDomainEventImpl<
	EventPayloadType extends SyncDomainEventPayloadBaseType,
> implements SyncDomainEventType<EventPayloadType>
{
	private _payload?: EventPayloadType;
	get payload(): EventPayloadType {
		if (this._payload === undefined) {
			throw new Error('Payload is not set');
		}
		return this._payload;
	}
	set payload(payload: EventPayloadType) {
		this._payload = payload;
	}
}