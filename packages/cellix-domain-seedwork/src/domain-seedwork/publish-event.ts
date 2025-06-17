import type { DomainEvent } from './domain-event.ts';
import { type EventBus } from './event-bus.ts';

export interface PublishEvent {
  publish<T extends { payload: unknown } & DomainEvent>(eventToPublish: new (...args:unknown[]) => T, data: T['payload']): Promise<void>;
}

export class EventPublisher implements PublishEvent {
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  async publish<T extends { payload: unknown } & DomainEvent>(eventToPublish: new (...args:unknown[]) => T, data: T['payload']) {
    await this.eventBus.dispatch(eventToPublish, data);
  }
}
