import { CustomDomainEvent, DomainEvent } from './domain-event';

export interface EventBus {
  dispatch<T extends DomainEvent>(event: new (...args: any) => T, data: any): Promise<void>;
  //  register<T extends DomainEvent>(event: T,listener: HandleEvent<T>): void;
  register<EventProps, T extends CustomDomainEvent<EventProps>>(event: new (...args: any) => T, func: (payload: T['payload']) => Promise<void>): void;
}
