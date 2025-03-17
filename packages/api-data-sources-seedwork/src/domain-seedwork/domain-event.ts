export interface CustomDomainEvent<T> extends DomainEvent {
  get payload(): T;
  set payload(payload: T);
}

export interface DomainEvent {
  get aggregateId(): string;
}

export abstract class DomainEventBase implements DomainEvent {
  constructor(private readonly _aggregateId: string) {}
  get aggregateId(): string {
    return this._aggregateId;
  }
}

export abstract class CustomDomainEventImpl<T> extends DomainEventBase implements CustomDomainEvent<T> {
  private _payload: T;
  get payload(): T {
    return this._payload;
  }
  set payload(payload: T) {
    this._payload = payload;
  }
}
